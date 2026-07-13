import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const CREAM = "#F4F1EA";
const INK = "#16130F";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.55)";
const TAU = Math.PI * 2;

const P: React.FC<{
  d: string;
  stroke?: string;
  sw?: number;
  opacity?: number;
  dash?: string;
}> = ({ d, stroke = INK, sw = 2, opacity = 1, dash }) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash}
    opacity={opacity}
  />
);

function wavePath(y: number, x0: number, x1: number, amp: number, wl: number) {
  let d = `M ${x0} ${y}`;
  let up = true;
  for (let x = x0; x < x1; x += wl) {
    d += ` Q ${x + wl / 2} ${y + (up ? -amp : amp)} ${x + wl} ${y}`;
    up = !up;
  }
  return d;
}

const diamond = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`;

// Draw one motif's art within a 0..480 × 0..420 box.
export const MotifArt: React.FC<{ which: string }> = ({ which }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const s = (c: number, ph = 0) => Math.sin(p * c * TAU + ph);
  const tri = 1 - Math.abs(2 * (p % 1) - 1); // 0→1→0

  switch (which) {
    // Cover — an arched window onto the sea
    case "cover": {
      const sun = 1 + 0.06 * s(2);
      return (
        <>
          <P d="M150 300 C150 214 330 214 330 300" sw={2.2} />
          <P d="M150 300 L150 322" sw={2.2} />
          <P d="M330 300 L330 322" sw={2.2} />
          <P d="M136 322 L344 322" sw={2.2} />
          <P d="M170 254 L310 254" stroke={HAIR} sw={1.4} />
          <g transform={`translate(0 ${2.2 * s(2)})`}>
            <P d={wavePath(268, 172, 308, 2.4, 26)} stroke={HAIR} sw={1.3} />
            <P d={wavePath(280, 172, 308, 2, 32)} stroke={HAIR} sw={1.2} />
          </g>
          <g transform={`translate(240 254) scale(${sun})`}>
            <circle r={17} fill="none" stroke={RED} strokeWidth={2} />
          </g>
        </>
      );
    }

    // Origin — two builders meet; something is born
    case "origin": {
      const px = 168 + tri * 144; // pulse travels 168→312→168
      const born = Math.max(0, 1 - Math.abs(px - 240) / 26);
      return (
        <>
          <P d="M168 210 L312 210" stroke={MUTED} sw={1.4} opacity={0.5} />
          <circle cx={168} cy={210} r={11} fill={CREAM} stroke={INK} strokeWidth={2} />
          <circle cx={312} cy={210} r={11} fill={CREAM} stroke={INK} strokeWidth={2} />
          <path d={diamond(240, 210, 7 + born * 7)} fill={RED} stroke={RED} strokeWidth={1.4} opacity={0.35 + born * 0.65} />
          <circle cx={px} cy={210} r={3.4} fill={RED} />
        </>
      );
    }

    // Goal — the constant-product curve, a point sliding along it
    case "goal": {
      const k = 46000;
      const pts: string[] = [];
      for (let x = 150; x <= 332; x += 20.2) pts.push(`${x.toFixed(1)} ${(k / x).toFixed(1)}`);
      const curve = "M" + pts.join(" L");
      const tx = 150 + tri * 182;
      const ty = k / tx;
      return (
        <>
          <P d="M132 300 L344 300" stroke={HAIR} sw={1.3} />
          <P d="M132 300 L132 120" stroke={HAIR} sw={1.3} />
          <P d={curve} stroke={INK} sw={2} />
          <circle cx={tx} cy={ty} r={5} fill={RED} />
        </>
      );
    }

    // Who — engineers and go-to-market, in balance
    case "who": {
      const ang = 5.5 * s(2);
      return (
        <>
          <g transform={`rotate(${ang} 240 232)`}>
            <P d="M156 232 L324 232" sw={2.2} />
            <circle cx={156} cy={232} r={13} fill={CREAM} stroke={INK} strokeWidth={2} />
            <path d={diamond(324, 232, 12)} fill={RED} stroke={RED} strokeWidth={1.4} />
          </g>
          <P d="M240 236 L221 288 L259 288 Z" sw={2.2} />
          <P d="M206 300 L274 300" stroke={HAIR} sw={1.6} />
        </>
      );
    }

    // Included — a ticket
    case "included": {
      const fy = 3 * s(2);
      return (
        <g transform={`translate(0 ${fy})`}>
          <P d="M156 168 L324 168 Q332 168 332 176 L332 244 Q332 252 324 252 L156 252 Q148 252 148 244 L148 176 Q148 168 156 168 Z" sw={2.2} />
          <P d="M296 168 L296 252" stroke={MUTED} sw={1.3} dash="3 7" />
          <path d={diamond(186, 210, 7)} fill={RED} stroke={RED} strokeWidth={1.4} />
          <P d="M212 202 L280 202" stroke={HAIR} sw={1.5} />
          <P d="M212 218 L262 218" stroke={HAIR} sw={1.5} />
        </g>
      );
    }

    // The three weeks — a progressing timeline
    case "weeks": {
      const xs = [162, 240, 318];
      const dotx = 162 + tri * 156;
      return (
        <>
          <P d="M150 214 L330 214" stroke={HAIR} sw={1.4} />
          {xs.map((x, i) => {
            const near = 1 - Math.min(1, Math.abs(dotx - x) / 34);
            return (
              <g key={i}>
                <circle cx={x} cy={214} r={7} fill={near > 0.5 ? RED : CREAM} stroke={near > 0.5 ? RED : INK} strokeWidth={2} />
                <text x={x} y={246} textAnchor="middle" fontSize={13} fill={MUTED} letterSpacing={1}>
                  {`0${i + 1}`}
                </text>
              </g>
            );
          })}
          <circle cx={dotx} cy={214} r={3.6} fill={RED} />
        </>
      );
    }

    // Sponsors — interlocking links (partnership)
    case "sponsors": {
      const b = 1 + 0.04 * s(2);
      return (
        <g transform={`translate(240 212) scale(${b})`}>
          <ellipse cx={-34} cy={0} rx={46} ry={28} fill="none" stroke={INK} strokeWidth={2.4} />
          <ellipse cx={34} cy={0} rx={46} ry={28} fill="none" stroke={RED} strokeWidth={2.4} />
        </g>
      );
    }

    // Close — a location ping (Edge City)
    case "close": {
      const r1 = ((p * 2) % 1);
      const r2 = ((p * 2 + 0.5) % 1);
      const ring = (t: number) => (
        <circle cx={240} cy={262} r={8 + t * 40} fill="none" stroke={RED} strokeWidth={1.6} opacity={0.5 * (1 - t)} />
      );
      return (
        <>
          {ring(r1)}
          {ring(r2)}
          <P d="M240 168 C214 168 200 188 200 208 C200 234 240 262 240 262 C240 262 280 234 280 208 C280 188 266 168 240 168 Z" sw={2.2} />
          <circle cx={240} cy={206} r={9} fill={RED} />
        </>
      );
    }

    default:
      return null;
  }
};

// A single motif composition.
export const Motif: React.FC<{ which: string }> = ({ which }) => (
  <AbsoluteFill style={{ backgroundColor: CREAM }}>
    <svg viewBox="0 0 480 420" width={480} height={420} xmlns="http://www.w3.org/2000/svg">
      <MotifArt which={which} />
    </svg>
  </AbsoluteFill>
);

// Preview sheet — all motifs in a grid (for a single still).
const ALL = ["cover", "origin", "goal", "who", "included", "weeks", "sponsors", "close"];
export const MotifSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CREAM }}>
    <svg viewBox="0 0 1920 840" width={1920} height={840} xmlns="http://www.w3.org/2000/svg">
      {ALL.map((m, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        return (
          <g key={m} transform={`translate(${col * 480} ${row * 420})`}>
            <rect x={1} y={1} width={478} height={418} fill="none" stroke="rgba(139,133,122,0.28)" strokeWidth={1} />
            <text x={20} y={34} fontSize={16} fill={MUTED} letterSpacing={2} style={{ textTransform: "uppercase" }}>
              {m}
            </text>
            <MotifArt which={m} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
