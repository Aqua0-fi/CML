import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily } = loadFont();

const CREAM = "#F4F1EA";
const INK = "#16130F";
const RED = "#6B2224";
const MUTED = "#8B857A";

const LINE_1 = "Cross Margin";
const LINE_2 = "Labs";

const STAGGER = 2.2; // frames between letters
const FIRST_DELAY = 8;

const Letter: React.FC<{ char: string; delay: number }> = ({ char, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 90 },
    durationInFrames: 30,
  });
  const y = interpolate(t, [0, 1], [34, 0]);
  const blur = interpolate(t, [0, 1], [10, 0]);
  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        transform: `translateY(${y}px)`,
        opacity: t,
        filter: `blur(${blur}px)`,
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export const CrossMarginLabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrow = spring({ frame: frame - 4, fps, durationInFrames: 24 });

  const totalLetters = LINE_1.length + LINE_2.length;
  const periodStart = FIRST_DELAY + totalLetters * STAGGER + 4;
  const periodT = spring({
    frame: frame - periodStart,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  const lineStart = periodStart + 8;
  const lineT = spring({
    frame: frame - lineStart,
    fps,
    durationInFrames: 40,
    config: { damping: 200 },
  });
  const captionT = spring({
    frame: frame - (lineStart + 10),
    fps,
    durationInFrames: 24,
  });

  // Sequential per-letter delays across both lines.
  let idx = 0;
  const nextDelay = () => FIRST_DELAY + idx++ * STAGGER;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        fontFamily,
        color: INK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", padding: 80 }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: 44,
            opacity: eyebrow,
            transform: `translateY(${interpolate(eyebrow, [0, 1], [16, 0])}px)`,
          }}
        >
          Research &amp; Development
        </div>

        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          <div>
            {LINE_1.split("").map((c, i) => (
              <Letter key={`a${i}`} char={c} delay={nextDelay()} />
            ))}
          </div>
          <div>
            {LINE_2.split("").map((c, i) => (
              <Letter key={`b${i}`} char={c} delay={nextDelay()} />
            ))}
            <span
              style={{
                display: "inline-block",
                color: RED,
                opacity: periodT,
                transform: `scale(${interpolate(periodT, [0, 1], [0.3, 1])})`,
              }}
            >
              .
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 52,
          }}
        >
          <div
            style={{
              width: 220,
              height: 2,
              background: "rgba(139, 133, 122, 0.55)",
              transform: `scaleX(${lineT})`,
              transformOrigin: "center",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: MUTED,
            marginTop: 22,
            opacity: captionT,
          }}
        >
          Fig. 01 — Financial Infrastructure
        </div>
      </div>
    </AbsoluteFill>
  );
};
