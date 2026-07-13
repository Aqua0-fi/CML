import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily } = loadFont();

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
}> = ({ d, stroke = INK, sw = 2, opacity = 1 }) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={opacity}
  />
);

function wavePath(y: number, x0: number, x1: number, amp: number, wl: number) {
  let d = `M ${x0} ${y}`;
  let up = true;
  for (let x = x0; x < x1; x += wl) {
    const cx = x + wl / 2;
    const ex = x + wl;
    d += ` Q ${cx} ${y + (up ? -amp : amp)} ${ex} ${y}`;
    up = !up;
  }
  return d;
}

// Window geometry
const X1 = 380;
const X2 = 900;
const SPRING = 336;
const R = (X2 - X1) / 2; // 260
const SILL = 600;

function archTop(x1: number, x2: number, spring: number) {
  const r = (x2 - x1) / 2;
  return `M ${x1} ${spring} C ${x1} ${spring - r * 1.33} ${x2} ${
    spring - r * 1.33
  } ${x2} ${spring}`;
}
function openingD() {
  return `M ${X1} ${SILL} L ${X1} ${SPRING} C ${X1} ${SPRING - R * 1.33} ${X2} ${
    SPRING - R * 1.33
  } ${X2} ${SPRING} L ${X2} ${SILL} Z`;
}

// A softly-breathing, drifting mathematical formula in the sky
const Formula: React.FC<{
  x: number;
  y: number;
  size: number;
  op: number;
  phase: number;
  children: React.ReactNode;
}> = ({ x, y, size, op, phase, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const breathe = 0.78 + 0.22 * Math.sin(p * 2 * TAU + phase);
  const dy = 2.4 * Math.sin(p * 2 * TAU + phase * 1.3);
  return (
    <g opacity={op * breathe} transform={`translate(0 ${dy})`}>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={size}
        fill={INK}
        letterSpacing={0.5}
      >
        {children}
      </text>
    </g>
  );
};

const IT = { fontStyle: "italic" as const };

export const GoaResidency: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;

  const sunPulse = 1 + 0.03 * Math.sin(p * 2 * TAU);

  // Sheer curtain on the left, breathing in the breeze
  const curtain: string[] = [];
  for (let i = 0; i < 5; i++) {
    const baseX = 402 + i * 20;
    const billow = 26 + 14 * Math.sin(p * 2 * TAU + i * 0.7);
    const top = 96 + i * 4;
    curtain.push(
      `M ${baseX} ${top} C ${baseX + billow} ${top + 150} ${baseX + billow} ${top + 300} ${baseX} 560`,
    );
  }

  // Steam rising from the cup
  const steam: string[] = [];
  for (let i = 0; i < 2; i++) {
    const sx = 828 + i * 14;
    const drift = 6 * Math.sin(p * 2 * TAU + i * 1.4);
    steam.push(
      `M ${sx} 584 C ${sx - 8 - drift} 566 ${sx + 8 + drift} 548 ${sx - drift} 528 C ${sx - 6 - drift} 514 ${sx + 4} 502 ${sx} 492`,
    );
  }
  const steamFade = 0.28 + 0.1 * Math.sin(p * 2 * TAU);

  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <svg viewBox="0 0 1280 720" width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="win">
            <path d={openingD()} />
          </clipPath>
        </defs>

        {/* ---- The view (clipped to the window) ---- */}
        <g clipPath="url(#win)">
          {/* Horizon */}
          <P d="M 360 392 L 920 392" stroke={HAIR} sw={1.5} />

          {/* Sun */}
          <g transform={`translate(716 392) scale(${sunPulse})`}>
            <circle cx={0} cy={0} r={44} fill="none" stroke={RED} strokeWidth={2} opacity={0.85} />
            {[18, 28, 38].map((dy, i) => (
              <line key={i} x1={-20 + i * 4} y1={dy} x2={20 - i * 4} y2={dy} stroke={RED} strokeWidth={1.2} opacity={0.4} />
            ))}
          </g>

          {/* Sea */}
          {[
            { y: 406, amp: 3, wl: 60, bob: 2.4, ph: 0 },
            { y: 420, amp: 2.6, wl: 72, bob: 2, ph: 1.1 },
            { y: 436, amp: 2.2, wl: 86, bob: 1.7, ph: 2.0 },
            { y: 454, amp: 1.9, wl: 102, bob: 1.4, ph: 2.7 },
            { y: 474, amp: 1.6, wl: 120, bob: 1.2, ph: 3.2 },
          ].map((w, i) => {
            const tx = -(p * w.wl);
            const ty = w.bob * Math.sin(p * 2 * TAU + w.ph);
            return (
              <g key={i} transform={`translate(${tx} ${ty})`} opacity={0.82}>
                <P d={wavePath(w.y, X1 - 2 * w.wl, X2 + 2 * w.wl, w.amp, w.wl)} stroke={HAIR} sw={1.3} />
              </g>
            );
          })}

          {/* ---- DeFi as quiet mathematics, drifting in the sky ---- */}
          {/* Constant-product AMM: x·y = k */}
          <Formula x={628} y={168} size={34} op={0.62} phase={0}>
            <tspan {...IT}>x</tspan>
            <tspan> · </tspan>
            <tspan {...IT}>y</tspan>
            <tspan>{"  =  "}</tspan>
            <tspan {...IT} fill={RED}>k</tspan>
          </Formula>

          {/* Utilisation (lending markets): U = B / (B + C) */}
          <Formula x={748} y={242} size={21} op={0.5} phase={1.4}>
            <tspan {...IT}>U</tspan>
            <tspan>{"  =  "}</tspan>
            <tspan {...IT}>B</tspan>
            <tspan>{" / ( "}</tspan>
            <tspan {...IT}>B</tspan>
            <tspan>{" + "}</tspan>
            <tspan {...IT}>C</tspan>
            <tspan>{" )"}</tspan>
          </Formula>

          {/* Impermanent loss: IL = 2√r / (1 + r) − 1 */}
          <Formula x={508} y={300} size={20} op={0.5} phase={2.6}>
            <tspan {...IT}>IL</tspan>
            <tspan>{"  =  2√"}</tspan>
            <tspan {...IT}>r</tspan>
            <tspan>{" / (1 + "}</tspan>
            <tspan {...IT}>r</tspan>
            <tspan>{" ) − 1"}</tspan>
          </Formula>

          {/* Swap with fee γ (AMM): Δy = γ y Δx / (x + γ Δx) */}
          <Formula x={636} y={334} size={15} op={0.42} phase={3.7}>
            <tspan>{"Δ"}</tspan>
            <tspan {...IT}>y</tspan>
            <tspan>{"  =  γ "}</tspan>
            <tspan {...IT}>y</tspan>
            <tspan>{" Δ"}</tspan>
            <tspan {...IT}>x</tspan>
            <tspan>{"  / ( "}</tspan>
            <tspan {...IT}>x</tspan>
            <tspan>{" + γ Δ"}</tspan>
            <tspan {...IT}>x</tspan>
            <tspan>{" )"}</tspan>
          </Formula>

          {/* Sheer curtain, breathing */}
          {curtain.map((d, i) => (
            <P key={`c${i}`} d={d} stroke={HAIR} sw={1.2} opacity={0.55} />
          ))}
        </g>

        {/* ---- Window frame (foreground) ---- */}
        <P d={`M ${X1 - 16} ${SILL} L ${X1 - 16} ${SPRING}`} sw={2} />
        <P d={`M ${X2 + 16} ${SILL} L ${X2 + 16} ${SPRING}`} sw={2} />
        <P d={archTop(X1 - 16, X2 + 16, SPRING)} sw={2} />
        <P d={`M ${X1} ${SILL} L ${X1} ${SPRING}`} sw={2} />
        <P d={`M ${X2} ${SILL} L ${X2} ${SPRING}`} sw={2} />
        <P d={archTop(X1, X2, SPRING)} sw={2} />
        <P d={`M 640 ${SPRING - R} L 640 ${SPRING - R - 16}`} stroke={HAIR} sw={1.3} />

        {/* Sill */}
        <P d={`M ${X1 - 34} ${SILL} L ${X2 + 34} ${SILL}`} sw={2.2} />
        <P d={`M ${X1 - 34} ${SILL} L ${X1 - 34} ${SILL + 16}`} sw={2} />
        <P d={`M ${X2 + 34} ${SILL} L ${X2 + 34} ${SILL + 16}`} sw={2} />
        <P d={`M ${X1 - 44} ${SILL + 16} L ${X2 + 44} ${SILL + 16}`} sw={2.2} />

        {/* A cup of chai on the sill, with rising steam */}
        {steam.map((d, i) => (
          <P key={`s${i}`} d={d} stroke={HAIR} sw={1.3} opacity={steamFade} />
        ))}
        <P d="M 812 578 L 856 578" sw={1.6} />
        <P d="M 814 578 L 818 596 Q 834 604 850 596 L 854 578" sw={1.6} />
        <P d="M 854 582 Q 868 585 863 595 Q 861 599 854 599" sw={1.5} />
      </svg>
    </AbsoluteFill>
  );
};
