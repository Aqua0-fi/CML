"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const INK = "#16130F";
const CREAM = "#F4F1EA";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.28)";

type Slide = {
  kicker: string;
  title: React.ReactNode;
  body: React.ReactNode;
  foot?: string;
};

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: MUTED,
  marginBottom: 28,
};
const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(38px, 5.6vw, 84px)",
  lineHeight: 1.04,
  fontWeight: 620,
  letterSpacing: "-0.02em",
  fontVariationSettings: "'opsz' 144",
  textWrap: "balance",
} as React.CSSProperties;
const bodyStyle: React.CSSProperties = {
  margin: "32px 0 0 0",
  maxWidth: 700,
  fontSize: "clamp(18px, 2.1vw, 25px)",
  lineHeight: 1.5,
  fontWeight: 360,
  fontVariationSettings: "'opsz' 18",
  color: INK,
  textWrap: "pretty",
} as React.CSSProperties;
const accent = { color: RED };

// Small list bullet (What's included)
const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
    <span style={{ color: RED, fontSize: 15, lineHeight: 1 }}>◇</span>
    <span style={{ fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.45, fontWeight: 360 }}>
      {children}
    </span>
  </div>
);

// Roadmap row (The three weeks)
const Week: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
    <div
      style={{
        color: RED,
        fontSize: 14,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        flex: "0 0 86px",
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: "clamp(17px, 2vw, 23px)", lineHeight: 1.4, fontWeight: 360, maxWidth: 560 }}>
      {children}
    </div>
  </div>
);

const SLIDES: Slide[] = [
  {
    kicker: "Cross Margin Labs · Residency",
    title: (
      <>
        Residency Goa<span style={accent}>.</span>
      </>
    ),
    body: "Three weeks in Goa to build the next DeFi primitives — and validate the business around them.",
    foot: "Goa, India",
  },
  {
    kicker: "01 — Origin",
    title: "It started at Edge City.",
    body: (
      <>
        We met at Edge City, Patagonia, at the Vibe Code Residency — the room
        where <span style={accent}>Aqua0</span> was born: where a founder met
        his CTO, and an idea became infrastructure. Edge City is home to us.
      </>
    ),
  },
  {
    kicker: "02 — The goal",
    title: "Build the next DeFi primitives.",
    body: "Three weeks to create real innovations in DeFi — deepening liquidity and making core primitives more efficient. The kind of work that became Aqua0.",
  },
  {
    kicker: "03 — Who it's for",
    title: "Engineers and go-to-market, in balance.",
    body: "We're not just shipping a proof of concept — we're validating a business. So we pair strong engineers with go-to-market builders.",
    foot: "6–10 builders · plus the Aqua0 team already on the ground",
  },
  {
    kicker: "04 — What's included",
    title: "On us.",
    body: (
      <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
        <Bullet>Edge City tickets</Bullet>
        <Bullet>The residency & stay, fully covered</Bullet>
        <Bullet>Backed by our partners & sponsors</Bullet>
      </div>
    ),
  },
  {
    kicker: "05 — The three weeks",
    title: (
      <>
        In with an idea.
        <br />
        Out with <span style={accent}>two products</span>.
      </>
    ),
    body: (
      <div style={{ display: "grid", gap: 22, maxWidth: 720 }}>
        <Week n="Week 01">
          Plan &amp; prototype — scope the idea and build a working proof of
          concept.
        </Week>
        <Week n="Week 02">Build — turn the PoC into a working MVP.</Week>
        <Week n="Week 03">
          Validate — take it to the market and gather real validation.
        </Week>
      </div>
    ),
  },
  {
    kicker: "Residency Goa",
    title: (
      <>
        Then we take it back
        <br />
        to Edge City<span style={accent}>.</span>
      </>
    ),
    body: "We show what we built where it all began.",
    foot: "Cross Margin Labs, Inc. · Goa 2026",
  },
];

export default function DeckPage() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const go = useCallback(
    (d: number) => setI((v) => Math.max(0, Math.min(n - 1, v + d))),
    [n],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        setI(0);
      } else if (e.key === "End") {
        setI(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, n]);

  const s = SLIDES[i];
  const num = String(i + 1).padStart(2, "0");
  const total = String(n).padStart(2, "0");

  return (
    <main
      style={{
        height: "100vh",
        overflow: "hidden",
        background: CREAM,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "28px clamp(20px, 5vw, 56px)",
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
        <div style={{ fontSize: 13, letterSpacing: "0.14em", color: MUTED }}>
          {num} <span style={{ opacity: 0.5 }}>/ {total}</span>
        </div>
      </header>

      {/* Slide */}
      <section
        onClick={() => go(1)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px clamp(20px, 5vw, 56px)",
          cursor: "pointer",
          minHeight: 0,
        }}
      >
        <div
          key={i}
          style={{
            animation: "cml-hero-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <div style={kickerStyle}>{s.kicker}</div>
          <h1 style={titleStyle}>{s.title}</h1>
          <div style={bodyStyle}>{s.body}</div>
          {s.foot ? (
            <div
              style={{
                marginTop: 40,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {s.foot}
            </div>
          ) : null}
        </div>
      </section>

      {/* Controls */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "22px clamp(20px, 5vw, 56px) 30px",
        }}
      >
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          aria-label="Previous"
          className="cml-link"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            cursor: i === 0 ? "default" : "pointer",
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
            opacity: i === 0 ? 0.35 : 1,
          }}
        >
          ← Prev
        </button>

        <div style={{ flex: 1, height: 1, background: HAIR, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${((i + 1) / n) * 100}%`,
              background: INK,
              transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <button
          onClick={() => go(1)}
          disabled={i === n - 1}
          aria-label="Next"
          className="cml-link"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            cursor: i === n - 1 ? "default" : "pointer",
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
            opacity: i === n - 1 ? 0.35 : 1,
          }}
        >
          Next →
        </button>
      </footer>
    </main>
  );
}
