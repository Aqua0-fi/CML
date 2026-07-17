"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const INK = "#16130F";
const CREAM = "#F4F1EA";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.28)";
// Keep in sync with the main deck so browsers fetch fresh motif art.
const MOTIF_V = "3";

type Slide = {
  kicker: string;
  title: React.ReactNode;
  body: React.ReactNode;
  foot?: string;
  motif?: string;
  wide?: boolean;
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
  fontSize: "clamp(36px, 5vw, 76px)",
  lineHeight: 1.05,
  fontWeight: 620,
  letterSpacing: "-0.02em",
  fontVariationSettings: "'opsz' 144",
  textWrap: "balance",
} as React.CSSProperties;
const bodyStyle: React.CSSProperties = {
  margin: "32px 0 0 0",
  maxWidth: 640,
  fontSize: "clamp(18px, 2vw, 24px)",
  lineHeight: 1.5,
  fontWeight: 360,
  fontVariationSettings: "'opsz' 18",
  color: INK,
  textWrap: "pretty",
} as React.CSSProperties;
const accent = { color: RED };

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
    <span style={{ color: RED, fontSize: 15, lineHeight: 1 }}>◇</span>
    <span style={{ fontSize: "clamp(16px, 1.9vw, 21px)", lineHeight: 1.45, fontWeight: 360 }}>
      {children}
    </span>
  </div>
);

const Tier: React.FC<{
  name: string;
  price: string;
  items: string[];
  highlight?: boolean;
  tag?: string;
}> = ({ name, price, items, highlight, tag }) => (
  <div
    style={{
      position: "relative",
      border: highlight ? `1px solid ${RED}` : `1px solid rgba(139, 133, 122, 0.45)`,
      background: highlight ? "rgba(107, 34, 36, 0.045)" : "transparent",
      padding: "26px 24px 24px",
    }}
  >
    {tag ? (
      <div
        style={{
          position: "absolute",
          top: -9,
          left: 22,
          background: CREAM,
          padding: "0 10px",
          color: RED,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {tag}
      </div>
    ) : null}
    <div
      style={{
        fontSize: 13,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: highlight ? RED : MUTED,
      }}
    >
      {name}
    </div>
    <div
      style={{
        marginTop: 8,
        fontSize: "clamp(26px, 2.6vw, 36px)",
        fontWeight: 620,
        letterSpacing: "-0.01em",
        fontVariationSettings: "'opsz' 60",
      }}
    >
      {price}
    </div>
    <div style={{ marginTop: 16, display: "grid", gap: 9 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
          <span style={{ color: RED, fontSize: 10, lineHeight: 1 }}>◇</span>
          <span style={{ fontSize: 14.5, lineHeight: 1.45, fontWeight: 380 }}>{it}</span>
        </div>
      ))}
    </div>
  </div>
);

const SLIDES: Slide[] = [
  {
    kicker: "Cross Margin Labs · Residency Goa",
    title: (
      <>
        For Sponsors<span style={accent}>.</span>
      </>
    ),
    body: "Back the residency where the next liquidity tools get built, on your technology.",
    foot: "Goa, India",
    motif: "/deck/sp-cover.gif",
  },
  {
    kicker: "01 · The residency",
    title: "Three weeks. Two products.",
    body: "Six to ten senior builders plus the Aqua0 team, three weeks on the Goan shore, taking liquidity ideas from plan to validated MVP.",
    motif: "/deck/sp-weeks.gif",
  },
  {
    kicker: "02 · Why sponsor",
    title: "What you take home.",
    body: (
      <div style={{ display: "grid", gap: 15, maxWidth: 640 }}>
        <Bullet>
          New use cases for your tech: teams take your stack where your
          roadmap hasn&apos;t gone yet, and ship it.
        </Bullet>
        <Bullet>
          Cross-protocol rooms: three weeks next to other protocols, where
          integrations and composability actually happen.
        </Bullet>
        <Bullet>
          Builders fluent in your stack: senior engineers go deep in your
          docs and contracts, and leave as integrators and potential hires.
        </Bullet>
        <Bullet>
          Real market signal: week three puts what was built on your
          technology in front of users.
        </Bullet>
        <Bullet>
          Deal flow, first: first look at what ships, first right to keep
          building it.
        </Bullet>
      </div>
    ),
    motif: "/deck/sp-why.gif",
  },
  {
    kicker: "03 · The output",
    title: "Liquidity, made more efficient.",
    body: "Our thesis is capital efficiency: deeper liquidity and better primitives. Every product that leaves Goa is a liquidity tool your ecosystem keeps.",
    motif: "/deck/sp-output.gif",
  },
  {
    kicker: "04 · Sponsorship",
    title: "Three ways in.",
    wide: true,
    body: (
      <div className="tier-grid" style={{ marginTop: 8 }}>
        <Tier
          name="Tide"
          price="$7,500"
          items={[
            "Logo on the residency site and deck",
            "Demo day access at Edge City",
            "The final output report",
          ]}
        />
        <Tier
          name="Current"
          price="$10,500"
          highlight
          tag="Recommended"
          items={[
            "Everything in Tide",
            "A team ships a liquidity product on your stack: new use cases for your tech",
            "Live demos every week: watch it grow from PoC to MVP to market",
            "Your workshop with the residents: onboard them into your docs and contracts",
            "Direct line to the builders: talent, integrations and deal flow",
          ]}
        />
        <Tier
          name="Deep"
          price="$15,500"
          items={[
            "Everything in Current",
            "Both products prioritize your stack",
            "Private weekly demos with both teams, plus a roadmap session with yours",
            "Co-branding: the residency, powered by you",
            "First right to keep building what ships: integrate or incubate it",
          ]}
        />
      </div>
    ),
  },
  {
    kicker: "05 · In good company",
    title: "Alongside 1inch.",
    body: "1inch is our founding technology partner. The partner bench is small on purpose: join it early.",
    motif: "/deck/sp-partner.gif",
  },
  {
    kicker: "Residency Goa",
    title: (
      <>
        Let&apos;s build liquidity
        <br />
        together<span style={accent}>.</span>
      </>
    ),
    body: (
      <div>
        <div style={{ marginBottom: 36 }}>
          Cross Margin Labs, Inc. · Delaware, USA
        </div>
        <a
          href="https://calendar.app.google/8oD5St1imBwwz5ey7"
          target="_blank"
          rel="noopener noreferrer"
          className="cml-deck-btn"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "15px 30px",
            border: "1px solid #6B2224",
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Become a Sponsor <span className="cml-deck-arrow">→</span>
        </a>
      </div>
    ),
    foot: "© 2026 Cross Margin Labs, Inc.",
    motif: "/deck/sp-close.gif",
  },
];

export default function SponsorsDeckPage() {
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

      {/* Slide (scrolls if content is taller than the viewport, e.g. tiers on mobile) */}
      <section
        onClick={() => go(1)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "40px clamp(20px, 5vw, 56px)",
          cursor: "pointer",
          minHeight: 0,
        }}
      >
        <div
          key={i}
          className={s.motif ? "deck-grid" : undefined}
          style={{
            margin: "auto 0",
            animation: "cml-hero-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <div>
            <div style={kickerStyle}>{s.kicker}</div>
            <h1 style={titleStyle}>{s.title}</h1>
            <div style={s.wide ? { ...bodyStyle, maxWidth: "none" } : bodyStyle}>
              {s.body}
            </div>
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

          {s.motif ? (
            <div className="deck-motif">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${s.motif}?v=${MOTIF_V}`}
                alt=""
                width={480}
                height={420}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
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
