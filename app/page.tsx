"use client";

import { useEffect, useRef } from "react";

// External link for the Aqua0 portfolio card (was the `aquaUrl` design prop; default "#").
const AQUA_URL = "#";

const GRAIN_BG =
  "url('data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Hero headline, letter by letter, with the settle-animation delays from the design.
const LINE_1A: [string, number][] = [
  ["C", 0.45],
  ["r", 0.49],
  ["o", 0.53],
  ["s", 0.57],
  ["s", 0.61],
];
const LINE_1B: [string, number][] = [
  ["M", 0.67],
  ["a", 0.71],
  ["r", 0.75],
  ["g", 0.79],
  ["i", 0.83],
  ["n", 0.87],
];
const LINE_2: [string, number][] = [
  ["L", 0.97],
  ["a", 1.01],
  ["b", 1.05],
  ["s", 1.09],
];

function Letters({ chars }: { chars: [string, number][] }) {
  return (
    <>
      {chars.map(([ch, delay], i) => (
        <span key={i} className="cml-l" style={{ animationDelay: `${delay}s` }}>
          {ch}
        </span>
      ))}
    </>
  );
}

// Blueprint registration crosshair framing the headline.
function Crosshair({
  style,
  delay,
}: {
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <div
      data-anno
      aria-hidden="true"
      style={{
        position: "absolute",
        opacity: 0,
        animation: `cml-anno-in 0.9s ${EASE} ${delay}s both`,
        ...style,
      }}
    >
      <div style={{ position: "relative", width: 17, height: 17 }}>
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 0,
            width: 1,
            height: 17,
            background: "rgba(139, 133, 122, 0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            height: 1,
            width: 17,
            background: "rgba(139, 133, 122, 0.55)",
          }}
        />
      </div>
    </div>
  );
}

const mutedLink: React.CSSProperties = {
  fontSize: 13,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#8B857A",
  transition: "color 0.4s ease",
};

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    reducedRef.current = reduced;

    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      root.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
        el.style.transform = "scaleX(1)";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) {
            const delay = parseFloat(
              el.getAttribute("data-reveal-delay") || "0",
            );
            el.style.transitionDelay = `${delay}s, ${delay}s`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          } else if (el.hasAttribute("data-draw")) {
            el.style.transform = "scaleX(1)";
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    root
      .querySelectorAll("[data-reveal], [data-draw]")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  // Hero: barely-perceptible weight shift tracking the cursor across the headline.
  const onHeroMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (reducedRef.current) return;
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const wght = Math.round(670 + x * 60);
    el.style.fontVariationSettings = `'opsz' 144, 'wght' ${wght}`;
  };
  const onHeroLeave = () => {
    const el = heroRef.current;
    if (!el) return;
    el.style.transition = "font-variation-settings 0.8s ease";
    el.style.fontVariationSettings = `'opsz' 144`;
  };

  return (
    <div
      ref={rootRef}
      style={{ minHeight: "100vh", background: "#F4F1EA", position: "relative" }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: "-4%",
          width: "108%",
          height: "108%",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0.05,
          backgroundImage: GRAIN_BG,
          animation: "cml-grain-shift 14s steps(6) infinite",
        }}
      />

      {/* Blueprint grid: vertical hairlines drawing themselves in */}
      <div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "max(48px, calc((100vw - 1280px) / 2 + 48px))",
            width: 1,
            background: "rgba(139, 133, 122, 0.22)",
            transformOrigin: "top",
            animation: `cml-line-grow-y 1.8s ${EASE} 0.1s both`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: "max(48px, calc((100vw - 1280px) / 2 + 48px))",
            width: 1,
            background: "rgba(139, 133, 122, 0.22)",
            transformOrigin: "top",
            animation: `cml-line-grow-y 1.8s ${EASE} 0.25s both`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 1,
            background: "rgba(139, 133, 122, 0.10)",
            transformOrigin: "top",
            animation: `cml-line-grow-y 2.2s ${EASE} 0.4s both`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 48px",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            padding: "28px 24px",
            borderBottom: "1px solid rgba(139, 133, 122, 0.28)",
            opacity: 0,
            animation: `cml-hero-rise 1s ${EASE} 0.15s both`,
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.01em",
              fontVariationSettings: "'opsz' 30",
            }}
          >
            Cross Margin Labs
          </div>
          <nav style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
            <a href="#mission" className="cml-link" style={mutedLink}>
              Mission
            </a>
            <a href="#portfolio" className="cml-link" style={mutedLink}>
              What We Build
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section
          style={{
            minHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "96px 24px 72px 24px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8B857A",
              marginBottom: 48,
              opacity: 0,
              animation: `cml-hero-rise 1s ${EASE} 0.35s both`,
            }}
          >
            Research &amp; Development · Est. Delaware, USA
          </div>
          <div style={{ position: "relative", alignSelf: "flex-start" }}>
            <Crosshair style={{ top: -34, left: -42 }} delay={1.7} />
            <Crosshair style={{ top: -34, right: -42 }} delay={1.85} />
            <Crosshair style={{ bottom: -30, left: -42 }} delay={2} />
            <Crosshair style={{ bottom: -30, right: -42 }} delay={2.15} />

            <h1
              ref={heroRef}
              onMouseMove={onHeroMove}
              onMouseLeave={onHeroLeave}
              style={{
                margin: 0,
                fontSize: "clamp(64px, 10.5vw, 152px)",
                lineHeight: 0.98,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                fontVariationSettings: "'opsz' 144",
                textWrap: "balance",
                cursor: "default",
              } as React.CSSProperties}
            >
              <span style={{ display: "block" }}>
                <Letters chars={LINE_1A} />
                <span style={{ display: "inline-block", width: "0.24em" }} />
                <Letters chars={LINE_1B} />
              </span>
              <span style={{ display: "block" }}>
                <Letters chars={LINE_2} />
                <span
                  data-anno
                  style={{
                    display: "inline-block",
                    color: "#6B2224",
                    opacity: 0,
                    animation: "cml-fade-in 1.2s ease 1.55s both",
                  }}
                >
                  .
                </span>
              </span>
            </h1>

            {/* Measurement line: baseline annotation drawing in beneath the headline */}
            <div
              data-anno
              aria-hidden="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 36,
                opacity: 0,
                animation: "cml-fade-in 1s ease 2.1s both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 220px",
                }}
              >
                <div
                  style={{
                    width: 1,
                    height: 9,
                    background: "rgba(139, 133, 122, 0.55)",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(139, 133, 122, 0.4)",
                    transformOrigin: "left",
                    animation: `cml-measure-draw 1.4s ${EASE} 2.2s both`,
                  }}
                />
                <div
                  style={{
                    width: 1,
                    height: 9,
                    background: "rgba(139, 133, 122, 0.55)",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#8B857A",
                }}
              >
                Fig. 01 — Financial Infrastructure
              </div>
            </div>
          </div>
          <p
            style={{
              margin: "56px 0 0 0",
              maxWidth: 560,
              fontSize: "clamp(19px, 2vw, 24px)",
              lineHeight: 1.45,
              fontWeight: 340,
              fontVariationSettings: "'opsz' 18",
              color: "#16130F",
              opacity: 0,
              animation: `cml-hero-rise 1.2s ${EASE} 1.35s both`,
            }}
          >
            A research and development company building financial infrastructure
            for the on-chain economy.
          </p>

          {/* Term-structure curve: a faint yield curve drawing itself across the hero base */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 8,
              height: 150,
              pointerEvents: "none",
            }}
          >
            <svg
              viewBox="0 0 1000 150"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <path
                d="M 0,138 C 180,132 300,108 460,84 C 640,57 820,42 1000,36"
                fill="none"
                stroke="rgba(139, 133, 122, 0.38)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                style={{ animation: `cml-path-draw 3s ${EASE} 2.3s backwards` }}
              />
              <line
                x1="0"
                y1="150"
                x2="1000"
                y2="150"
                stroke="rgba(139, 133, 122, 0.25)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                style={{ animation: `cml-path-draw 2s ${EASE} 2.2s backwards` }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 1,
                    height: 7,
                    background: "rgba(139, 133, 122, 0.45)",
                  }}
                />
              ))}
            </div>
            <div
              data-anno
              style={{
                position: "absolute",
                right: 0,
                top: 8,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B857A",
                opacity: 0,
                animation: "cml-fade-in 1.2s ease 4.4s both",
              }}
            >
              Fig. 02 — Term Structure
            </div>
          </div>
        </section>

        {/* Hairline divider with tick */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 24px" }}>
          <div
            style={{
              width: 8,
              height: 8,
              border: "1px solid rgba(139, 133, 122, 0.5)",
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}
          />
          <div
            data-draw
            style={{
              flex: 1,
              height: 1,
              background: "rgba(139, 133, 122, 0.28)",
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: `transform 1.6s ${EASE}`,
            }}
          />
        </div>

        {/* Mission */}
        <section id="mission" style={{ padding: "140px 24px 160px 24px" }}>
          <div
            data-reveal
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8B857A",
              marginBottom: 56,
              opacity: 0,
              transform: "translateY(24px)",
              transition: `opacity 1s ${EASE}, transform 1s ${EASE}`,
            }}
          >
            01 — Mission
          </div>
          <p
            data-reveal
            data-reveal-delay="0.18"
            style={
              {
                margin: 0,
                maxWidth: 880,
                fontSize: "clamp(28px, 3.6vw, 44px)",
                lineHeight: 1.32,
                fontWeight: 420,
                letterSpacing: "-0.01em",
                fontVariationSettings: "'opsz' 60",
                textWrap: "pretty",
                opacity: 0,
                transform: "translateY(24px)",
                transition: `opacity 1.1s ${EASE}, transform 1.1s ${EASE}`,
              } as React.CSSProperties
            }
          >
            We research, design, and ship financial infrastructure at the
            intersection of financial engineering and decentralized finance. Our
            focus is capital efficiency, liquidity, and the systems that move
            value across chains.
          </p>
        </section>

        {/* Hairline divider with tick */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 24px" }}>
          <div
            data-draw
            style={{
              flex: 1,
              height: 1,
              background: "rgba(139, 133, 122, 0.28)",
              transform: "scaleX(0)",
              transformOrigin: "right",
              transition: `transform 1.6s ${EASE}`,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              border: "1px solid rgba(139, 133, 122, 0.5)",
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Portfolio */}
        <section id="portfolio" style={{ padding: "140px 24px 180px 24px" }}>
          <div
            data-reveal
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8B857A",
              marginBottom: 72,
              opacity: 0,
              transform: "translateY(24px)",
              transition: `opacity 1s ${EASE}, transform 1s ${EASE}`,
            }}
          >
            02 — What We Build
          </div>

          <a
            href={AQUA_URL}
            data-aqua-card
            data-reveal
            data-reveal-delay="0.18"
            style={{
              display: "block",
              borderTop: "1px solid #16130F",
              borderBottom: "1px solid rgba(139, 133, 122, 0.28)",
              padding: "64px 0 72px 0",
              opacity: 0,
              transform: "translateY(24px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "clamp(44px, 6vw, 76px)",
                    fontWeight: 560,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    fontVariationSettings: "'opsz' 144",
                    color: "#16130F",
                  }}
                >
                  Aqua0
                </div>
                <p
                  style={{
                    margin: "32px 0 0 0",
                    maxWidth: 560,
                    fontSize: 20,
                    lineHeight: 1.5,
                    fontWeight: 340,
                    fontVariationSettings: "'opsz' 18",
                    color: "#16130F",
                  }}
                >
                  Cross-chain shared liquidity infrastructure for stablecoin
                  issuers.
                </p>
              </div>
              <div style={{ whiteSpace: "nowrap", paddingTop: 12 }}>
                <span
                  style={{ fontSize: 16, fontWeight: 500, color: "#6B2224" }}
                >
                  Visit Aqua0 <span data-aqua-arrow>→</span>
                </span>
                <div
                  data-aqua-underline
                  style={{ height: 1, background: "#6B2224", marginTop: 5 }}
                />
              </div>
            </div>
          </a>
        </section>

        {/* Footer */}
        <footer
          data-reveal
          style={{
            borderTop: "1px solid rgba(139, 133, 122, 0.28)",
            padding: "48px 24px 56px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 24,
            alignItems: "baseline",
            opacity: 0,
            transform: "translateY(24px)",
            transition: `opacity 1s ${EASE}, transform 1s ${EASE}`,
          }}
        >
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "#8B857A",
              maxWidth: 520,
            }}
          >
            Cross Margin Labs, Inc. · Delaware, USA · 2026
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
            <a
              href="mailto:contact@crossmarginlabs.com"
              className="cml-link"
              style={mutedLink}
            >
              Contact
            </a>
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8B857A",
              }}
            >
              © 2026 Cross Margin Labs, Inc.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
