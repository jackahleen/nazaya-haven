import { NextRequest, NextResponse } from "next/server";
import { cacheKey } from "@/lib/cache/cache-keys";
import { writeJsonCache } from "@/lib/cache/json-cache";
import { getCachedResources } from "@/lib/resources/free-source-cache";
import { rerankResources } from "@/integrations/contextual-ai/client";
import {
  getOrCreateSessionContext,
  updateSessionContext,
} from "@/lib/memory/agent-memory";
import { recordResourceSearch } from "@/lib/memory/cross-context";
import {
  getSessionIdFromRequest,
  getUserIdFromRequest,
} from "@/lib/memory/session-utils";
import type { CommunityResourceCategory, CommunityResourceResults, CommunityResource } from "@/data/community-resources";

const VALID_CATEGORIES = [
  "housing",
  "food",
  "family",
  "health",
  "community",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  housing: "Housing",
  food: "Food Insecurity",
  family: "Family Care",
  health: "Mental & Physical Health",
  community: "Community Support",
};

const CATEGORY_HINTS: Record<Category, string> = {
  housing: "emergency shelter, rental assistance, eviction prevention (not legal representation)",
  food: "food banks, pantries, SNAP/WIC assistance, free meal programs",
  family: "childcare assistance, parenting support, family resource centers",
  health: "free or low-cost therapy, mental health clinics, community health centers, sliding-scale healthcare",
  community: "LGBTQ centers, community centers, peer support groups, general social services",
};

/**
 * Helper to check if a category has meaningful results
 */
function hasResults(results: CommunityResourceResults, category: CommunityResourceCategory): boolean {
  const items = results[category];
  return Array.isArray(items) && items.length > 0;
}

export async function POST(req: NextRequest) {
  const { zip, categories, sessionId: clientSessionId } = await req.json();

  // Derive session ID
  const sessionId = clientSessionId || (await getSessionIdFromRequest(req)) || "session-unknown";
  const userId = getUserIdFromRequest(req) || undefined;

  // Load or create session context
  const sessionContext = await getOrCreateSessionContext(sessionId, userId);

  if (!zip || typeof zip !== "string" || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: "Please enter a valid 5-digit zip code." },
      { status: 400 }
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one category." },
      { status: 400 }
    );
  }

  const selected: Category[] = categories.filter((c: string) =>
    VALID_CATEGORIES.includes(c as Category)
  );

  if (selected.length === 0) {
    return NextResponse.json(
      { error: "No valid categories selected." },
      { status: 400 }
    );
  }

  // Update session context with search info
  await updateSessionContext(sessionId, {
    currentLane: "resources",
    entities: {
      ...sessionContext.entities,
      zip_code: zip,
      concern_tags: selected.join(","),
    },
  });

  // CACHE-FIRST: Try Redis then free sources
  const freeResults = await getCachedResources({
    zip,
    categories: selected,
  });

  // Check which categories have NO local results (gaps to fill with Claude)
  const gapsNeedingClaude = selected.filter((cat) => !hasResults(freeResults, cat));

  // If all categories are satisfied by free sources, record and return immediately
  if (gapsNeedingClaude.length === 0) {
    // Record resource views in memory (for cross-context)
    const freeResultsData = freeResults as Record<string, unknown>;
    for (const category of selected) {
      const resources = freeResultsData[category];
      if (Array.isArray(resources)) {
        for (const res of resources.slice(0, 3)) {
          const resource = res as Record<string, unknown>;
          await recordResourceSearch(
            sessionId,
            String(resource.name || "unknown"),
            String(resource.name || "unknown"),
            category
          );
        }
      }
    }
    return NextResponse.json(freeResults, {
      headers: {
        "x-nazaya-source": "cache",
        "x-nazaya-cache": "hit",
      },
    });
  }

  // Fallback when no API key or no gaps: return free results as-is
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(freeResults, {
      headers: {
        "x-nazaya-source": "free",
        "x-nazaya-cache": "no-api",
      },
    });
  }

  // Call Claude only for gap-filling
  const categoryInstructions = gapsNeedingClaude
    .map(
      (cat) =>
        `- "${cat}" (${CATEGORY_LABELS[cat]}): ${CATEGORY_HINTS[cat]}`
    )
    .join("\n");

  const jsonShape = gapsNeedingClaude
    .map((cat) => `    "${cat}": [ { "name": "", "description": "", "phone": "", "website": "", "address": "" } ]`)
    .join(",\n");

  const prompt = `You are helping a parent or family near zip code ${zip} find real, local support resources. Search the web for each category below and return up to 3 local results per category, plus 1-2 well-known national resources/hotlines relevant to families overall (these go in a separate "national" array, not tied to one category).

Categories to search for:
${categoryInstructions}

Do not include legal aid, eviction defense, or attorney referrals in any category — that is handled on a separate page.

Respond ONLY with valid JSON, no other text, in this exact shape:
{
${jsonShape},
  "national": [ { "name": "", "description": "", "phone": "", "website": "" } ]
}

If a field is unknown, use an empty string. Only include real organizations found via search — never invent names, phone numbers, or addresses.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      // Fall back to free results instead of erroring
      return NextResponse.json(freeResults, {
        headers: {
          "x-nazaya-source": "free",
          "x-nazaya-cache": "claude-error",
        },
      });
    }

    const data = await response.json();

    const textBlocks = data.content
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    const cleaned = textBlocks.replace(/```json|```/g, "").trim();

    let parsed: CommunityResourceResults;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Could not parse Claude response:", cleaned);
      // Fall back to free results instead of erroring
      return NextResponse.json(freeResults, {
        headers: {
          "x-nazaya-source": "free",
          "x-nazaya-cache": "parse-error",
        },
      });
    }

    // Merge Claude results with free results
    const merged: CommunityResourceResults = { ...freeResults };
    for (const category of gapsNeedingClaude) {
      if (parsed[category]) {
        merged[category] = parsed[category];
      }
    }

    // Optionally re-rank resources by relevance to the caregiver's need.
    // If CONTEXTUAL_API_KEY is not set, this is a no-op (identity pass-through).
    if (typeof merged === "object" && merged !== null) {
      const needDescription = selected
        .map((cat: string) => CATEGORY_LABELS[cat as Category])
        .join(", ");

      // Helper to convert CommunityResource to rerank input type
      const toRerankInput = (r: CommunityResource) => ({
        name: r.name,
        description: r.description,
        phone: r.phone,
        website: r.website,
        address: r.address || "",
      });

      // Helper to convert rerank output back to CommunityResource
      const toCommunityResource = (r: ReturnType<typeof toRerankInput>): CommunityResource => ({
        ...r,
        counties: [] as readonly string[],
      });

      // Re-rank each category array
      for (const category of selected) {
        const resources = merged[category as CommunityResourceCategory];
        if (Array.isArray(resources) && resources.length > 0) {
          const reranked = await rerankResources(
            resources.map(toRerankInput),
            needDescription,
          );
          merged[category as CommunityResourceCategory] = reranked.map(toCommunityResource);
        }
      }

      // Re-rank national resources with a generic query
      if (Array.isArray(merged.national) && merged.national.length > 0) {
        const reranked = await rerankResources(
          merged.national.map(toRerankInput),
          "family support and parenting resources",
        );
        merged.national = reranked.map(toCommunityResource);
      }
    }

    // Record resource views in memory (for cross-context)
    const mergedData = merged as Record<string, unknown>;
    for (const category of Object.keys(mergedData)) {
      if (category === "national") continue;
      const resources = mergedData[category];
      if (Array.isArray(resources)) {
        for (const res of resources.slice(0, 3)) {
          const resource = res as Record<string, unknown>;
          await recordResourceSearch(
            sessionId,
            String(resource.name || "unknown"),
            String(resource.name || "unknown"),
            category
          );
        }
      }
    }

    // Cache the merged and re-ranked results
    const cacheCategories = [...selected].sort();
    const key = cacheKey("resource-search", { zip, selected: cacheCategories });
    await writeJsonCache(key, merged, 60 * 60 * 24);

    return NextResponse.json(merged, {
      headers: {
        "x-nazaya-source": "mixed-reranked",
        "x-nazaya-cache": "miss",
      },
    });
  } catch (err) {
    console.error("Claude resource search failed:", err);
    // Fall back gracefully to free results
    return NextResponse.json(freeResults, {
      headers: {
        "x-nazaya-source": "free",
        "x-nazaya-cache": "fetch-error",
      },
    });
  }
}
