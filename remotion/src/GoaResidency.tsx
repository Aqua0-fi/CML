import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily } = loadFont();

const CREAM = "#F4F1EA";
const INK = "#16130F";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.55)";

const TAU = Math.PI * 2;

/** Static stroked path (the whole scene is always present — no draw-in). */
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

// ---- Geometry helpers -------------------------------------------------------

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

const COL_XS = [435, 513, 591, 669, 747, 825];
const SPRING_Y = 430;
const COL_BOTTOM = 520;

type NodeDef = {
  x: number;
  y: number;
  r: number;
  accent?: boolean;
  label?: string;
  ldx?: number;
  ldy?: number;
  anchor?: "start" | "middle" | "end";
};
const NODES: NodeDef[] = [
  { x: 630, y: 84, r: 8, accent: true, label: "DeFi", ldx: 16, ldy: 5 },
  { x: 506, y: 152, r: 7, label: "Liquidity", ldx: -14, ldy: -12, anchor: "end" },
  { x: 700, y: 132, r: 7, label: "Yield", ldx: 15, ldy: -12 },
  { x: 776, y: 208, r: 7, label: "Cross-chain", ldx: 15, ldy: 6 },
  { x: 556, y: 214, r: 6 },
  { x: 672, y: 240, r: 6 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 3],
  [4, 5],
  [5, 2],
  [3, 5],
  [1, 2],
];

/** A constellation node: always present, gently breathing. */
const Node: React.FC<{ node: NodeDef }> = ({ node }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = (frame / durationInFrames) * TAU;
  const pulse = 1 + 0.13 * Math.sin(3 * a + node.x * 0.03);
  const r = node.r * pulse;
  return (
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill={node.accent ? RED : CREAM}
        stroke={node.accent ? RED : INK}
        strokeWidth={2}
      />
      {node.label ? (
        <text
          x={node.x + (node.ldx ?? 12)}
          y={node.y + (node.ldy ?? -12)}
          fontSize={14}
          letterSpacing={2.5}
          fill={MUTED}
          fontFamily={fontFamily}
          textAnchor={node.anchor ?? "start"}
          style={{ textTransform: "uppercase" }}
        >
          {node.label}
        </text>
      ) : null}
    </g>
  );
};

const WAVES = [
  { y: 450, amp: 4, wl: 62, bob: 3, cyc: 2, ph: 0 },
  { y: 463, amp: 3.4, wl: 74, bob: 2.4, cyc: 2, ph: 1.2 },
  { y: 476, amp: 3, wl: 88, bob: 2, cyc: 2, ph: 2.1 },
];

export const GoaResidency: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames; // 0..1 over the loop

  // Ambient (all periodic over the loop -> seamless)
  const sunPulse = 1 + 0.03 * Math.sin(p * 2 * TAU);
  const trunkSwayL = 0.8 * Math.sin(p * 2 * TAU);
  const frondSwayL = 2.6 * Math.sin(p * 2 * TAU + 0.4);
  const trunkSwayR = 0.7 * Math.sin(p * 2 * TAU + 1.6);
  const frondSwayR = 2.4 * Math.sin(p * 2 * TAU + 2.1);
  const constX = 2 * Math.sin(p * 1 * TAU);
  const constY = 1.6 * Math.sin(p * 2 * TAU + 1);
  const threadOffset = -(p * 36); // 4 dash periods -> seamless upward flow

  // Arcade arches (near-semicircular tops)
  const arches: string[] = [];
  for (let i = 0; i < COL_XS.length - 1; i++) {
    const x1 = COL_XS[i];
    const x2 = COL_XS[i + 1];
    const r = (x2 - x1) / 2;
    arches.push(
      `M ${x1} ${SPRING_Y} C ${x1} ${SPRING_Y - r * 1.33} ${x2} ${
        SPRING_Y - r * 1.33
      } ${x2} ${SPRING_Y}`,
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <svg
        viewBox="0 0 1280 720"
        width="1280"
        height="720"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ---- Sea (behind) ---- */}
        <P d="M 0 430 L 1280 430" stroke={HAIR} sw={1.5} />
        {WAVES.map((w, i) => {
          const tx = -(p * w.wl); // travels exactly one wavelength -> seamless
          const ty = w.bob * Math.sin(p * w.cyc * TAU + w.ph);
          return (
            <g key={i} transform={`translate(${tx} ${ty})`} opacity={0.9}>
              <P
                d={wavePath(w.y, -2 * w.wl, 1280 + 2 * w.wl, w.amp, w.wl)}
                stroke={HAIR}
                sw={1.4}
              />
            </g>
          );
        })}

        {/* ---- Sun over the sea ---- */}
        <g transform={`translate(1078 430) scale(${sunPulse})`}>
          <circle cx={0} cy={0} r={54} fill="none" stroke={RED} strokeWidth={2} opacity={0.85} />
          {[22, 34, 46].map((dy, i) => (
            <line
              key={i}
              x1={-26 + i * 4}
              y1={dy}
              x2={26 - i * 4}
              y2={dy}
              stroke={RED}
              strokeWidth={1.4}
              opacity={0.4}
            />
          ))}
        </g>

        {/* ---- Cream occluder: the house blocks the distant sea ---- */}
        <rect x={414} y={244} width={432} height={300} fill={CREAM} />

        {/* ---- Palms (sway in the breeze) ---- */}
        <g transform={`rotate(${trunkSwayL} 330 520)`}>
          <P d="M330 520 C326 470 320 420 316 372" sw={2} />
          <g transform={`rotate(${frondSwayL} 316 372)`}>
            <P d="M316 372 C300 360 285 360 272 368" sw={1.8} />
            <P d="M316 372 C305 352 300 338 300 326" sw={1.8} />
            <P d="M316 372 C330 356 346 352 360 358" sw={1.8} />
            <P d="M316 372 C322 352 332 342 344 334" sw={1.8} />
            <P d="M316 372 C310 366 300 374 290 384" sw={1.8} />
          </g>
        </g>
        <g transform={`rotate(${trunkSwayR} 950 520)`}>
          <P d="M950 520 C954 470 960 420 964 374" sw={2} />
          <g transform={`rotate(${frondSwayR} 964 374)`}>
            <P d="M964 374 C980 362 995 362 1008 370" sw={1.8} />
            <P d="M964 374 C975 354 980 340 980 328" sw={1.8} />
            <P d="M964 374 C950 358 934 354 920 360" sw={1.8} />
            <P d="M964 374 C958 354 948 344 936 336" sw={1.8} />
            <P d="M964 374 C970 368 980 376 990 386" sw={1.8} />
          </g>
        </g>

        {/* ---- House ---- */}
        {/* Roof (hipped, overhanging) */}
        <P d="M416 388 L500 330 L760 330 L844 388" sw={2.4} />
        <P d="M416 388 L844 388" sw={2} />
        <P d="M452 366 L792 366" stroke={HAIR} sw={1.2} />
        <P d="M478 348 L766 348" stroke={HAIR} sw={1.2} />

        {/* Central baroque (Indo-Portuguese) curvilinear gable */}
        <P d="M582 330 C582 302 600 300 606 284 C614 260 626 250 630 250 C634 250 646 260 654 284 C660 300 678 302 678 330" sw={2.2} />
        <P d="M584 330 L676 330" sw={1.8} />
        <P d="M622 320 L622 300 C622 288 638 288 638 300 L638 320 Z" sw={1.6} />
        {/* Finial cross (accent) */}
        <P d="M630 250 L630 232" stroke={RED} sw={2} />
        <P d="M622 240 L638 240" stroke={RED} sw={2} />

        {/* Cornice above the arcade */}
        <P d="M420 388 L840 388" sw={2} />

        {/* Arcade */}
        {COL_XS.map((x, i) => (
          <P key={`col${i}`} d={`M ${x} ${COL_BOTTOM} L ${x} ${SPRING_Y}`} sw={2} />
        ))}
        {arches.map((d, i) => (
          <P key={`arch${i}`} d={d} sw={2} />
        ))}
        <P d="M420 520 L840 520" sw={2} />

        {/* Central door */}
        <P d="M606 520 L606 452" sw={1.8} />
        <P d="M654 520 L654 452" sw={1.8} />
        <P d="M630 520 L630 452" stroke={HAIR} sw={1.3} />
        <P d="M598 528 L662 528" stroke={HAIR} sw={1.5} />
        <P d="M590 536 L670 536" stroke={HAIR} sw={1.5} />

        {/* Side windows */}
        {[537, 723].map((cx, i) => (
          <g key={`win${i}`}>
            <P
              d={`M ${cx - 17} 500 L ${cx - 17} 462 C ${cx - 17} 450 ${
                cx + 17
              } 450 ${cx + 17} 462 L ${cx + 17} 500 Z`}
              sw={1.6}
            />
            <P d={`M ${cx} 500 L ${cx} 456`} stroke={HAIR} sw={1.2} />
          </g>
        ))}

        {/* ---- Rising thread from the house to the constellation (energy flows up) ---- */}
        <path
          d="M630 250 L630 96"
          fill="none"
          stroke={MUTED}
          strokeWidth={1.4}
          strokeDasharray="2 7"
          strokeDashoffset={threadOffset}
          strokeLinecap="round"
          opacity={0.7}
        />

        {/* ---- DeFi constellation (gently floats as one; nodes breathe) ---- */}
        <g transform={`translate(${constX} ${constY})`}>
          {EDGES.map(([a, b], i) => (
            <P
              key={`edge${i}`}
              d={`M ${NODES[a].x} ${NODES[a].y} L ${NODES[b].x} ${NODES[b].y}`}
              stroke={INK}
              sw={1.4}
              opacity={0.5}
            />
          ))}
          {NODES.map((n, i) => (
            <Node key={`node${i}`} node={n} />
          ))}
        </g>

        {/* ---- Blueprint baseline + ticks ---- */}
        <P d="M120 604 L1160 604" stroke={HAIR} sw={1.2} />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 120 + (i * (1160 - 120)) / 8;
          return (
            <line
              key={`tick${i}`}
              x1={x}
              y1={604}
              x2={x}
              y2={611}
              stroke={HAIR}
              strokeWidth={1.2}
            />
          );
        })}

        {/* ---- Caption ---- */}
        <text
          x={640}
          y={656}
          textAnchor="middle"
          fontSize={17}
          letterSpacing={4}
          fill={MUTED}
          fontFamily={fontFamily}
          style={{ textTransform: "uppercase" }}
        >
          Goa — where the future of DeFi is built
        </text>
      </svg>
    </AbsoluteFill>
  );
};
