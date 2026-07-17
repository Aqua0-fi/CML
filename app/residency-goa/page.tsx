import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Residency Goa — Cross Margin Labs",
  description: "Residency Goa — Cross Margin Labs.",
};

const gutter = "clamp(20px, 5vw, 48px)";

export default function ResidencyGoaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F4F1EA",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top mark — the only way back to the site */}
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: `28px ${gutter}`,
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/"
          className="cml-link"
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: "#8B857A",
            fontVariationSettings: "'opsz' 30",
            transition: "color 0.4s ease",
          }}
        >
          ← Cross Margin Labs
        </Link>
      </div>

      {/* Center */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `48px ${gutter}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            animation:
              "cml-hero-rise 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8B857A",
              marginBottom: 32,
            }}
          >
            Cross Margin Labs · Residency
          </div>
          <h1
            style={
              {
                margin: 0,
                fontSize: "clamp(52px, 9vw, 132px)",
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                fontVariationSettings: "'opsz' 144",
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            Residency Goa<span style={{ color: "#6B2224" }}>.</span>
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
          >
            <div
              style={{
                width: 56,
                height: 1,
                background: "rgba(139, 133, 122, 0.5)",
              }}
            />
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B857A",
              }}
            >
              Goa, India
            </div>
            <div
              style={{
                width: 56,
                height: 1,
                background: "rgba(139, 133, 122, 0.5)",
              }}
            />
          </div>

          {/* Ambient scene — its cream background blends into the page */}
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              margin: "44px auto 0",
            }}
          >
            <Image
              src="/residency-goa-scene.gif"
              alt="A Portuguese-colonial villa by the sea in Goa, with a constellation of DeFi concepts forming above it."
              width={1280}
              height={720}
              unoptimized
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <div
            style={{
              marginTop: 52,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/residency-goa/deck"
              className="cml-deck-btn"
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
              See Deck <span className="cml-deck-arrow">→</span>
            </Link>
            <Link
              href="/residency-goa/sponsors"
              className="cml-btn-ink"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "15px 30px",
                border: "1px solid #16130F",
                fontSize: 13,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              For Sponsors <span className="cml-deck-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: `24px ${gutter} 40px`,
          boxSizing: "border-box",
        }}
      >
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
    </main>
  );
}
