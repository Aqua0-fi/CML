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

  // Honeypot: bots fill hidden fields. Pretend success, drop it.
  if (typeof data._gotcha === "string" && data._gotcha.trim() !== "") {
    return NextResponse.json({ ok: true });
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
    // No provider wired yet: log so the form is testable in dev.
    console.log("[residency] application received:\n" + JSON.stringify(payload, null, 2));
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "provider" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
