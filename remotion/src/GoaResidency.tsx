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
const HAIR = "rgba(139, 133, 122, 0.55)";

/** A stroked path that draws itself in (blueprint style). */
const DrawPath: React.FC<{
  d: string;
  delay: number;
  dur?: number;
  stroke?: string;
  sw?: number;
  opacity?: number;
}> = ({ d, delay, dur = 28, stroke = INK, sw = 2, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({
    frame: frame - delay,
    fps,
    durationInFrames: dur,
    config: { damping: 200 },
  });
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - t}
      opacity={opacity}
    />
  );
};

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
const SPRING_Y = 430; // arcade springline
const COL_BOTTOM = 520;

// DeFi constellation over the house
type NodeDef = {
  x: number;
  y: number;
  r: number;
  delay: number;
  accent?: boolean;
  label?: string;
  ldx?: number;
  ldy?: number;
  anchor?: "start" | "middle" | "end";
};
const NODES: NodeDef[] = [
  { x: 630, y: 84, r: 8, delay: 88, accent: true, label: "DeFi", ldx: 16, ldy: 5 },
  { x: 506, y: 152, r: 7, delay: 92, label: "Liquidity", ldx: -14, ldy: -12, anchor: "end" },
  { x: 700, y: 132, r: 7, delay: 96, label: "Yield", ldx: 15, ldy: -12 },
  { x: 776, y: 208, r: 7, delay: 100, label: "Cross-chain", ldx: 15, ldy: 6 },
  { x: 556, y: 214, r: 6, delay: 104 },
  { x: 672, y: 240, r: 6, delay: 108 },
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

const Node: React.FC<{ node: NodeDef }> = ({ node }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({
    frame: frame - node.delay,
    fps,
    durationInFrames: 18,
    config: { damping: 12, stiffness: 200 },
  });
  const pulse = 1 + 0.14 * Math.sin((frame - node.delay) * 0.14);
  const r = node.r * Math.max(0, t) * pulse;
  return (
    <g opacity={Math.max(0, t)}>
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

export const GoaResidency: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fade = interpolate(
    frame,
    [0, 12, durationInFrames - 18, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Ambient
  const waveBob = 2.6 * Math.sin(frame * 0.11);
  const sunPulse = 1 + 0.03 * Math.sin(frame * 0.09);
  const sunT = spring({
    frame: frame - 8,
    fps: 30,
    durationInFrames: 26,
    config: { damping: 14, stiffness: 160 },
  });
  const captionT = spring({
    frame: frame - 120,
    fps: 30,
    durationInFrames: 26,
  });

  // Arcade arches as rounded (near-semicircular) cubic tops.
  const arches = [];
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
      <AbsoluteFill style={{ opacity: fade }}>
        <svg
          viewBox="0 0 1280 720"
          width="1280"
          height="720"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ---- Sea (behind) ---- */}
          <DrawPath d="M 0 430 L 1280 430" delay={4} dur={34} stroke={HAIR} sw={1.5} />
          <g transform={`translate(0 ${waveBob})`} opacity={0.9}>
            <DrawPath d={wavePath(450, 20, 1260, 4, 62)} delay={14} dur={40} stroke={HAIR} sw={1.4} />
            <DrawPath d={wavePath(463, 20, 1260, 3.4, 74)} delay={18} dur={40} stroke={HAIR} sw={1.4} />
            <DrawPath d={wavePath(476, 20, 1260, 3, 88)} delay={22} dur={40} stroke={HAIR} sw={1.3} />
          </g>

          {/* ---- Sun over the sea ---- */}
          <g
            opacity={Math.max(0, sunT)}
            transform={`translate(1078 430) scale(${sunPulse})`}
          >
            <circle cx={0} cy={0} r={54} fill="none" stroke={RED} strokeWidth={2} opacity={0.85} />
            {[452 - 430, 464 - 430, 476 - 430].map((dy, i) => (
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

          {/* ---- Palms (foreground, beside the house) ---- */}
          <g>
            <DrawPath d="M330 520 C326 470 320 420 316 372" delay={60} dur={30} sw={2} />
            <DrawPath d="M316 372 C300 360 285 360 272 368" delay={64} dur={22} sw={1.8} />
            <DrawPath d="M316 372 C305 352 300 338 300 326" delay={66} dur={22} sw={1.8} />
            <DrawPath d="M316 372 C330 356 346 352 360 358" delay={68} dur={22} sw={1.8} />
            <DrawPath d="M316 372 C322 352 332 342 344 334" delay={70} dur={22} sw={1.8} />
            <DrawPath d="M316 372 C310 366 300 374 290 384" delay={72} dur={22} sw={1.8} />
          </g>
          <g>
            <DrawPath d="M950 520 C954 470 960 420 964 374" delay={66} dur={30} sw={2} />
            <DrawPath d="M964 374 C980 362 995 362 1008 370" delay={70} dur={22} sw={1.8} />
            <DrawPath d="M964 374 C975 354 980 340 980 328" delay={72} dur={22} sw={1.8} />
            <DrawPath d="M964 374 C950 358 934 354 920 360" delay={74} dur={22} sw={1.8} />
            <DrawPath d="M964 374 C958 354 948 344 936 336" delay={76} dur={22} sw={1.8} />
            <DrawPath d="M964 374 C970 368 980 376 990 386" delay={78} dur={22} sw={1.8} />
          </g>

          {/* ---- House ---- */}
          {/* Roof (hipped, overhanging) */}
          <DrawPath
            d="M416 388 L500 330 L760 330 L844 388"
            delay={20}
            dur={30}
            sw={2.4}
          />
          <DrawPath d="M416 388 L844 388" delay={22} dur={26} sw={2} />
          {/* Roof tile hints */}
          <DrawPath d="M452 366 L792 366" delay={30} dur={26} stroke={HAIR} sw={1.2} />
          <DrawPath d="M478 348 L766 348" delay={32} dur={26} stroke={HAIR} sw={1.2} />

          {/* Central baroque (Indo-Portuguese) curvilinear gable */}
          <DrawPath
            d="M582 330 C582 302 600 300 606 284 C614 260 626 250 630 250 C634 250 646 260 654 284 C660 300 678 302 678 330"
            delay={34}
            dur={30}
            sw={2.2}
          />
          <DrawPath d="M584 330 L676 330" delay={36} dur={20} sw={1.8} />
          {/* Gable arched window */}
          <DrawPath
            d="M622 320 L622 300 C622 288 638 288 638 300 L638 320 Z"
            delay={46}
            dur={22}
            sw={1.6}
          />
          {/* Finial cross (accent) */}
          <DrawPath d="M630 250 L630 232" delay={44} dur={16} stroke={RED} sw={2} />
          <DrawPath d="M622 240 L638 240" delay={46} dur={16} stroke={RED} sw={2} />

          {/* Cornice above the arcade */}
          <DrawPath d="M420 388 L840 388" delay={24} dur={26} sw={2} />

          {/* Arcade columns */}
          {COL_XS.map((x, i) => (
            <DrawPath
              key={`col${i}`}
              d={`M ${x} ${COL_BOTTOM} L ${x} ${SPRING_Y}`}
              delay={40 + i * 2}
              dur={22}
              sw={2}
            />
          ))}
          {/* Arcade arches */}
          {arches.map((d, i) => (
            <DrawPath key={`arch${i}`} d={d} delay={46 + i * 2} dur={22} sw={2} />
          ))}
          {/* Base / plinth line */}
          <DrawPath d="M420 520 L840 520" delay={40} dur={26} sw={2} />

          {/* Central door (main bay) */}
          <DrawPath d="M606 520 L606 452" delay={52} dur={18} sw={1.8} />
          <DrawPath d="M654 520 L654 452" delay={53} dur={18} sw={1.8} />
          <DrawPath d="M630 520 L630 452" delay={54} dur={18} stroke={HAIR} sw={1.3} />
          {/* Front steps */}
          <DrawPath d="M598 528 L662 528" delay={56} dur={16} stroke={HAIR} sw={1.5} />
          <DrawPath d="M590 536 L670 536" delay={57} dur={16} stroke={HAIR} sw={1.5} />

          {/* Side windows (bays flanking the door) */}
          {[537, 723].map((cx, i) => (
            <g key={`win${i}`}>
              <DrawPath
                d={`M ${cx - 17} 500 L ${cx - 17} 462 C ${cx - 17} 450 ${
                  cx + 17
                } 450 ${cx + 17} 462 L ${cx + 17} 500 Z`}
                delay={54 + i * 2}
                dur={20}
                sw={1.6}
              />
              <DrawPath
                d={`M ${cx} 500 L ${cx} 456`}
                delay={56 + i * 2}
                dur={16}
                stroke={HAIR}
                sw={1.2}
              />
            </g>
          ))}

          {/* ---- Rising thread from the sacred house to the DeFi constellation ---- */}
          <path
            d="M630 250 L630 96"
            fill="none"
            stroke={MUTED}
            strokeWidth={1.4}
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity={interpolate(frame, [92, 112], [0, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />

          {/* ---- DeFi constellation (edges then nodes) ---- */}
          {EDGES.map(([a, b], i) => (
            <DrawPath
              key={`edge${i}`}
              d={`M ${NODES[a].x} ${NODES[a].y} L ${NODES[b].x} ${NODES[b].y}`}
              delay={82 + i * 3}
              dur={20}
              stroke={INK}
              sw={1.4}
              opacity={0.5}
            />
          ))}
          {NODES.map((n, i) => (
            <Node key={`node${i}`} node={n} />
          ))}

          {/* ---- Blueprint baseline + ticks ---- */}
          <DrawPath d="M120 604 L1160 604" delay={8} dur={40} stroke={HAIR} sw={1.2} />
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
                opacity={interpolate(frame, [40, 60], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
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
            opacity={Math.max(0, captionT)}
            style={{ textTransform: "uppercase" }}
          >
            Goa — where the future of DeFi is built
          </text>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
