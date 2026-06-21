import { NextResponse } from "next/server";

// Mints a short-lived Deepgram token for browser microphone capture so the
// long-lived DEEPGRAM_API_KEY never reaches the client. Runs only on a hosted
// runtime (Vercel); on the static GitHub Pages export this route handler is
// omitted from the build output, so the client voice UI falls back to typed
// input. Caregiver transcripts are treated as needs, never cached in Redis.
//
// NOTE: confirm the grant endpoint/shape against current Deepgram auth docs
// (or use @deepgram/sdk grantToken) when wiring the live voice agent.

export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Deepgram is not configured for this runtime. Static preview uses typed input; the hosted runtime mints short-lived tokens here.",
      },
      { status: 501 },
    );
  }

  try {
    const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 30, scopes: ["usage:write"] }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Deepgram token grant failed", detail);
      return NextResponse.json(
        { error: "Failed to mint Deepgram token." },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Deepgram token route error", error);
    return NextResponse.json({ error: "Token mint failed." }, { status: 500 });
  }
}
