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
  maxWidth: 680,
  fontSize: "clamp(18px, 2.1vw, 25px)",
  lineHeight: 1.5,
  fontWeight: 360,
  fontVariationSettings: "'opsz' 18",
  color: INK,
  textWrap: "pretty",
} as React.CSSProperties;
const accent = { color: RED };

const SLIDES: Slide[] = [
  {
    kicker: "Cross Margin Labs · Residency",
    title: (
      <>
        Residency Goa<span style={accent}>.</span>
      </>
    ),
    body: "A three-week hacker house on the Goan shore — where ideas become working DeFi infrastructure.",
    foot: "Goa, India",
  },
  {
    kicker: "01 — Origin",
    title: "It began at a residency.",
    body: (
      <>
        We met at Edge City, Patagonia, at the Vibe Code Residency. That room is
        where <span style={accent}>Aqua0</span> was born — where a founder met
        his CTO, and an idea turned into infrastructure.
      </>
    ),
    foot: "Fig. — Edge City, Patagonia",
  },
  {
    kicker: "02 — The idea",
    title: "So we're taking it a level further.",
    body: "Cross Margin Labs Residency — our own. One shore, three weeks, a room full of builders, engineered to turn ideas into shipped work.",
  },
  {
    kicker: "03 — What it is",
    title: "A hacker house. A focus group. Three weeks.",
    body: "Small teams build real innovations on our partners' technology — making a market maker more efficient, sharpening a mechanism, shipping the next Aqua0.",
  },
  {
    kicker: "04 — The outcome",
    title: (
      <>
        In with an idea.
        <br />
        Out with a <span style={accent}>proof of concept</span>.
      </>
    ),
    body: "Every team leaves with — at minimum — a working PoC. Something concrete to put in front of our sponsors.",
  },
  {
    kicker: "05 — Why we build it",
    title: "What we're really after.",
    body: (
      <div style={{ display: "grid", gap: 28, maxWidth: 720 }}>
        <div>
          <div style={{ ...accent, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            Innovation
          </div>
          <div style={{ fontSize: "clamp(18px, 2.1vw, 25px)", lineHeight: 1.45, fontWeight: 360 }}>
            The strongest cases, we keep developing — new infrastructure worth
            continuing.
          </div>
        </div>
        <div>
          <div style={{ ...accent, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            People
          </div>
          <div style={{ fontSize: "clamp(18px, 2.1vw, 25px)", lineHeight: 1.45, fontWeight: 360 }}>
            The builders worth building with — potential hires, over the medium
            term.
          </div>
        </div>
      </div>
    ),
  },
  {
    kicker: "06 — The place",
    title: "Goa.",
    body: "Portuguese arches, the Arabian Sea, and a veranda where financial engineering and DeFi are argued into the future.",
  },
  {
    kicker: "Residency Goa",
    title: (
      <>
        Come build the future
        <br />
        with us<span style={accent}>.</span>
      </>
    ),
    body: "Cross Margin Labs, Inc. · Delaware, USA",
    foot: "© 2026 Cross Margin Labs, Inc.",
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

        <div
          style={{
            flex: 1,
            height: 1,
            background: HAIR,
            position: "relative",
          }}
        >
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
