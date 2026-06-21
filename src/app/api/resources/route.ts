import { NextRequest, NextResponse } from "next/server";
import { cacheKey } from "@/lib/cache/cache-keys";
import { readJsonCache, writeJsonCache } from "@/lib/cache/json-cache";
import { rerankResources } from "@/integrations/contextual-ai/client";

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

export async function POST(req: NextRequest) {
  const { zip, categories } = await req.json();

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

  const cacheCategories = [...selected].sort();
  const key = cacheKey("resource-search", { zip, selected: cacheCategories });
  const cached = await readJsonCache(key);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "x-nazaya-cache": "hit" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing an API key." },
      { status: 500 }
    );
  }

  const categoryInstructions = selected
    .map(
      (cat) =>
        `- "${cat}" (${CATEGORY_LABELS[cat]}): ${CATEGORY_HINTS[cat]}`
    )
    .join("\n");

  const jsonShape = selected
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
      return NextResponse.json(
        { error: "Failed to fetch resources." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const textBlocks = data.content
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    const cleaned = textBlocks.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Could not parse Claude response:", cleaned);
      return NextResponse.json(
        { error: "Could not parse resource data." },
        { status: 502 }
      );
    }

    // Optionally re-rank resources by relevance to the caregiver's need.
    // If CONTEXTUAL_API_KEY is not set, this is a no-op (identity pass-through).
    if (typeof parsed === "object" && parsed !== null) {
      const needDescription = selected
        .map((cat: string) => CATEGORY_LABELS[cat as Category])
        .join(", ");

      // Re-rank each category array
      for (const category of Object.keys(parsed)) {
        if (category === "national" || !Array.isArray(parsed[category])) {
          continue;
        }
        const resources = parsed[category];
        if (resources.length > 0) {
          parsed[category] = await rerankResources(resources, needDescription);
        }
      }

      // Re-rank national resources with a generic query
      if (Array.isArray(parsed.national) && parsed.national.length > 0) {
        parsed.national = await rerankResources(
          parsed.national,
          "family support and parenting resources",
        );
      }
    }

    await writeJsonCache(key, parsed, 60 * 60 * 24);

    return NextResponse.json(parsed, {
      headers: { "x-nazaya-cache": "miss" },
    });
  } catch (err) {
    console.error("Resource search failed:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
