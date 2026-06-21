// Triggers a Devin PR review via the Devin API. This adapter runs only on
// GitHub Actions (gated by secrets.DEVIN_API_KEY and secrets.DEVIN_ORG_ID);
// the Next.js app does not directly call this. The devin-pr-review.yml workflow
// uses this to post AI-generated code review summaries as PR comments.
//
// When unconfigured (secrets absent), this gracefully returns null so the
// workflow can log a diagnostic message and exit 0 without failing the PR.
//
// NOTE: Update the Devin API endpoint/shape against current docs when going live.

export interface DevinReviewConfig {
  apiKey: string;
  orgId: string;
  prUrl: string;
}

export interface DevinReviewResult {
  reviewId: string;
  status: "submitted" | "in_progress" | "complete";
  summary?: string;
  reviewUrl?: string;
}

/**
 * Triggers a Devin API review for a pull request.
 * Returns null if the API is not configured (missing env vars).
 * Throws on actual API errors (network, auth, etc.).
 */
export async function triggerDevinReview(
  prUrl: string,
): Promise<DevinReviewResult | null> {
  const apiKey = process.env.DEVIN_API_KEY;
  const orgId = process.env.DEVIN_ORG_ID;

  if (!apiKey || !orgId) {
    // Unconfigured; gracefully degrade
    return null;
  }

  const devinApiUrl = "https://api.cognition.dev/v1/reviews";

  try {
    const response = await fetch(devinApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Organization-ID": orgId,
      },
      body: JSON.stringify({
        pull_request_url: prUrl,
        review_scope: "auto",
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Devin API error ${response.status}: ${detail}`);
    }

    const data = (await response.json()) as Partial<DevinReviewResult>;
    return {
      reviewId: data.reviewId ?? "unknown",
      status: data.status ?? "submitted",
      summary: data.summary,
      reviewUrl: data.reviewUrl,
    };
  } catch (error) {
    console.error("Devin review submission failed", error);
    throw error;
  }
}
