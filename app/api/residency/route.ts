import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Order here controls how fields appear in the provider dashboard / email.
const FIELDS = [
  "name",
  "email",
  "handle",
  "location",
  "role",
  "workingOn",
  "links",
  "defiExperience",
  "impressiveBuilt",
  "impressiveNonWork",
  "stayLength",
  "stayDates",
  "coverage",
  "coverageSituation",
  "buildExplore",
] as const;

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const REQUIRED = FIELDS.filter(
    (f) => f !== "stayDates" && f !== "coverageSituation",
  );
  const missing = REQUIRED.filter(
    (f) => String(data[f] ?? "").trim() === "",
  );
  const email = String(data.email ?? "").trim();
  if (missing.length > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const name = String(data.name).trim();

  const payload: Record<string, unknown> = {
    _subject: `Aqua0 Residency application: ${name}`,
  };
  for (const f of FIELDS) {
    payload[f] = typeof data[f] === "string" ? data[f] : "";
  }

  // Swap providers (Formspree / Basin / Getform / ...) with this one env var.
  const endpoint = process.env.RESIDENCY_FORM_ENDPOINT;
  if (!endpoint) {
    // Fail loudly instead of pretending success with nowhere to store the data.
    console.error(
      "[residency] RESIDENCY_FORM_ENDPOINT is not set. Restart the dev server after editing .env.local, and set the var on your host for production.",
    );
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  // Apps Script is slow and occasionally flaky, so time out and retry once.
  const attempts = 2;
  for (let i = 1; i <= attempts; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const text = await res.text();
      // The provider must confirm success in its body, otherwise a Google
      // error page (still HTTP 200) would look like a false success.
      if (res.ok && /"ok"\s*:\s*true/.test(text)) {
        return NextResponse.json({ ok: true });
      }
      console.error(
        `[residency] attempt ${i}/${attempts} not confirmed (status ${res.status}): ` +
          text.slice(0, 200),
      );
    } catch (err) {
      console.error(`[residency] attempt ${i}/${attempts} failed:`, String(err));
    } finally {
      clearTimeout(timeout);
    }
  }

  return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
}
