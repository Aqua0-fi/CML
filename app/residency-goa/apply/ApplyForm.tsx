"use client";

import { useState } from "react";
import Link from "next/link";

const INK = "#16130F";
const CREAM = "#F4F1EA";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.28)";

const ROLE_OPTIONS = ["Engineer", "Business or BD", "Research", "Design", "Other"];
const STAY_OPTIONS = [
  "Full three weeks (Oct 11 to Nov 1)",
  "Two weeks",
  "One week",
];
const COVERAGE_OPTIONS = [
  "I'll cover my Edge City ticket",
  "I need help with the Edge City ticket",
  "I need a full scholarship",
];

type FormState = {
  name: string;
  email: string;
  handle: string;
  location: string;
  role: string;
  workingOn: string;
  links: string;
  defiExperience: string;
  impressiveBuilt: string;
  impressiveNonWork: string;
  stayLength: string;
  stayDates: string;
  coverage: string;
  coverageSituation: string;
  buildExplore: string;
  _gotcha: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  handle: "",
  location: "",
  role: "",
  workingOn: "",
  links: "",
  defiExperience: "",
  impressiveBuilt: "",
  impressiveNonWork: "",
  stayLength: "",
  stayDates: "",
  coverage: "",
  coverageSituation: "",
  buildExplore: "",
  _gotcha: "",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 16,
  fontWeight: 500,
  color: INK,
  fontVariationSettings: "'opsz' 24",
  lineHeight: 1.4,
};
const noteStyle: React.CSSProperties = {
  fontSize: 13.5,
  color: MUTED,
  lineHeight: 1.5,
};

const Field: React.FC<{
  label: string;
  optional?: boolean;
  noteAbove?: string;
  note?: string;
  error?: boolean;
  children: React.ReactNode;
}> = ({ label, optional, noteAbove, note, error, children }) => (
  <div style={{ marginBottom: 34 }}>
    <label style={labelStyle}>
      {label}
      {optional ? (
        <span style={{ color: MUTED, fontWeight: 400 }}> (optional)</span>
      ) : null}
    </label>
    {noteAbove ? <div style={{ ...noteStyle, marginTop: 6 }}>{noteAbove}</div> : null}
    <div style={{ marginTop: 11 }}>{children}</div>
    {note ? <div style={{ ...noteStyle, marginTop: 9 }}>{note}</div> : null}
    {error ? (
      <div style={{ marginTop: 8, fontSize: 13.5, color: RED }}>
        Please pick one.
      </div>
    ) : null}
  </div>
);

const RadioGroup: React.FC<{
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ name, value, options, onChange }) => (
  <div style={{ display: "grid", gap: 13 }}>
    {options.map((opt) => (
      <label key={opt} className="cml-radio">
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
        />
        <span className="cml-radio-dot" />
        <span>{opt}</span>
      </label>
    ))}
  </div>
);

export default function ApplyForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [radioError, setRadioError] = useState<{
    role?: boolean;
    stayLength?: boolean;
    coverage?: boolean;
  }>({});

  const set = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const showDates = form.stayLength !== "" && form.stayLength !== STAY_OPTIONS[0];
  const showSituation =
    form.coverage === COVERAGE_OPTIONS[1] || form.coverage === COVERAGE_OPTIONS[2];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      role: !form.role,
      stayLength: !form.stayLength,
      coverage: !form.coverage,
    };
    setRadioError(errs);
    if (errs.role || errs.stayLength || errs.coverage) {
      const first = document.querySelector<HTMLElement>("[data-radio-error]");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/residency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: CREAM, position: "relative" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 40px)",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            padding: "28px 0",
            borderBottom: `1px solid ${HAIR}`,
          }}
        >
          <Link
            href="/residency-goa"
            className="cml-link"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: MUTED,
              fontVariationSettings: "'opsz' 30",
              transition: "color 0.4s ease",
            }}
          >
            ← Cross Margin Labs
          </Link>
        </header>

        {status === "done" ? (
          <section style={{ padding: "120px 0 160px" }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: MUTED,
                marginBottom: 28,
              }}
            >
              Aqua0 Residency · Goa, India
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 620,
                letterSpacing: "-0.02em",
                fontVariationSettings: "'opsz' 144",
              }}
            >
              Got it<span style={{ color: RED }}>.</span>
            </h1>
            <p
              style={{
                margin: "28px 0 0 0",
                fontSize: 20,
                lineHeight: 1.5,
                fontWeight: 360,
                maxWidth: 520,
                color: INK,
              }}
            >
              We read every one of these. If it looks like a fit, we'll reach
              out. Thanks for taking the time.
            </p>
            <div style={{ marginTop: 40 }}>
              <Link
                href="/residency-goa"
                className="cml-link"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                ← Back
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* Intro */}
            <section style={{ padding: "72px 0 8px" }}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginBottom: 28,
                }}
              >
                Aqua0 Residency · Goa, India
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(38px, 5.6vw, 72px)",
                  lineHeight: 1.04,
                  fontWeight: 620,
                  letterSpacing: "-0.02em",
                  fontVariationSettings: "'opsz' 144",
                  textWrap: "balance",
                } as React.CSSProperties}
              >
                Aqua0 Residency
              </h1>
              <p
                style={{
                  margin: "32px 0 0 0",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.55,
                  fontWeight: 360,
                  color: INK,
                }}
              >
                Three weeks living and building with a small group of people
                obsessed with DeFi. October 11 to November 1, at Edge City in
                Goa. Not a conference. A house, a city by the sea, and enough
                time to actually ship something. We cover housing for everyone
                selected. The Edge City ticket is separate, and we have some
                scholarships for that too.
              </p>

              {/* Disclaimer */}
              <div
                style={{
                  marginTop: 28,
                  padding: "20px 22px",
                  borderLeft: `2px solid ${RED}`,
                  background: "rgba(107, 34, 36, 0.04)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    fontWeight: 360,
                    color: INK,
                  }}
                >
                  Two things to be upfront about. We're not here to build low
                  hanging fruit. If you're looking for a hackathon project you
                  can ship in a weekend, this isn't it. And part of what we build
                  will likely run on top of our partners' tech, which we haven't
                  confirmed yet, so some of the direction will be set once those
                  conversations close.
                </p>
              </div>
            </section>

            {/* Form */}
            <form onSubmit={onSubmit} style={{ padding: "48px 0 120px" }}>
              {/* honeypot */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form._gotcha}
                onChange={(e) => set("_gotcha")(e.target.value)}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  opacity: 0,
                }}
              />

              <Field label="Name">
                <input
                  className="cml-input"
                  required
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                />
              </Field>

              <Field label="Email">
                <input
                  className="cml-input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              </Field>

              <Field label="Telegram or X handle">
                <input
                  className="cml-input"
                  required
                  placeholder="@yourhandle"
                  value={form.handle}
                  onChange={(e) => set("handle")(e.target.value)}
                />
              </Field>

              <Field label="Where are you based?">
                <input
                  className="cml-input"
                  required
                  placeholder="City, country"
                  value={form.location}
                  onChange={(e) => set("location")(e.target.value)}
                />
              </Field>

              <div data-radio-error={radioError.role ? "" : undefined}>
                <Field label="What do you do?" error={radioError.role}>
                  <RadioGroup
                    name="role"
                    value={form.role}
                    options={ROLE_OPTIONS}
                    onChange={(v) => {
                      set("role")(v);
                      setRadioError((r) => ({ ...r, role: false }));
                    }}
                  />
                </Field>
              </div>

              <Field label="What are you working on right now?">
                <textarea
                  className="cml-textarea"
                  required
                  value={form.workingOn}
                  onChange={(e) => set("workingOn")(e.target.value)}
                />
              </Field>

              <Field label="Links" note="GitHub, X, LinkedIn">
                <input
                  className="cml-input"
                  required
                  placeholder="github.com/you, x.com/you, linkedin.com/in/you"
                  value={form.links}
                  onChange={(e) => set("links")(e.target.value)}
                />
              </Field>

              <Field label="Tell us about your DeFi experience. What have you built, shipped, sold, or run? Be specific.">
                <textarea
                  className="cml-textarea"
                  required
                  style={{ minHeight: 130 }}
                  value={form.defiExperience}
                  onChange={(e) => set("defiExperience")(e.target.value)}
                />
              </Field>

              <Field label="Tell us something impressive you've built.">
                <textarea
                  className="cml-textarea"
                  required
                  value={form.impressiveBuilt}
                  onChange={(e) => set("impressiveBuilt")(e.target.value)}
                />
              </Field>

              <Field label="Tell us something impressive you've done that has nothing to do with work.">
                <textarea
                  className="cml-textarea"
                  required
                  value={form.impressiveNonWork}
                  onChange={(e) => set("impressiveNonWork")(e.target.value)}
                />
              </Field>

              <div data-radio-error={radioError.stayLength ? "" : undefined}>
                <Field
                  label="How long can you stay?"
                  note="People who can stay the full three weeks get priority."
                  error={radioError.stayLength}
                >
                  <RadioGroup
                    name="stayLength"
                    value={form.stayLength}
                    options={STAY_OPTIONS}
                    onChange={(v) => {
                      set("stayLength")(v);
                      setRadioError((r) => ({ ...r, stayLength: false }));
                    }}
                  />
                </Field>
              </div>

              {showDates ? (
                <Field
                  label="If you're not staying the full time, which dates?"
                  optional
                >
                  <input
                    className="cml-input"
                    placeholder="e.g. Oct 11 to Oct 25"
                    value={form.stayDates}
                    onChange={(e) => set("stayDates")(e.target.value)}
                  />
                </Field>
              ) : null}

              <div data-radio-error={radioError.coverage ? "" : undefined}>
                <Field
                  label="Coverage"
                  noteAbove="We cover housing for everyone selected. The Edge City ticket is separate."
                  note="Full scholarships are limited and assigned based on profile."
                  error={radioError.coverage}
                >
                  <RadioGroup
                    name="coverage"
                    value={form.coverage}
                    options={COVERAGE_OPTIONS}
                    onChange={(v) => {
                      set("coverage")(v);
                      setRadioError((r) => ({ ...r, coverage: false }));
                    }}
                  />
                </Field>
              </div>

              {showSituation ? (
                <Field
                  label="If you need help, tell us briefly about your situation"
                  optional
                >
                  <textarea
                    className="cml-textarea"
                    value={form.coverageSituation}
                    onChange={(e) => set("coverageSituation")(e.target.value)}
                  />
                </Field>
              ) : null}

              <Field label="What would you want to build or explore in three weeks?">
                <textarea
                  className="cml-textarea"
                  required
                  style={{ minHeight: 130 }}
                  value={form.buildExplore}
                  onChange={(e) => set("buildExplore")(e.target.value)}
                />
              </Field>

              <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  className="cml-deck-btn"
                  disabled={status === "submitting"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 34px",
                    border: `1px solid ${RED}`,
                    background: "none",
                    font: "inherit",
                    fontSize: 13,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: status === "submitting" ? "default" : "pointer",
                    opacity: status === "submitting" ? 0.6 : 1,
                  }}
                >
                  {status === "submitting" ? "Sending..." : "Send it"}{" "}
                  <span className="cml-deck-arrow">→</span>
                </button>
                {status === "error" ? (
                  <span style={{ fontSize: 14.5, color: RED }}>
                    Something broke. Try again in a sec.
                  </span>
                ) : null}
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
