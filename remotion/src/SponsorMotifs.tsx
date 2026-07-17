import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily } = loadFont();

const CREAM = "#F4F1EA";
const INK = "#16130F";
const RED = "#6B2224";
const MUTED = "#8B857A";
const GRID = "rgba(139, 133, 122, 0.28)";
const AXIS = "rgba(139, 133, 122, 0.55)";
const TAU = Math.PI * 2;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// chart frame
const CX0 = 92;
const CX1 = 400;
const CY0 = 118;
const CY1 = 312;

const P: React.FC<{
  d: string;
  stroke?: string;
  sw?: number;
  opacity?: number;
  dash?: string;
  fill?: string;
}> = ({ d, stroke = INK, sw = 2, opacity = 1, dash, fill = "none" }) => (
  <path
    d={d}
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash}
    opacity={opacity}
  />
);

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
}> = ({ x, y, children, size = 12, fill = MUTED, anchor = "start" }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontFamily={fontFamily} letterSpacing={1.5} textAnchor={anchor} style={{ textTransform: "uppercase" }}>
    {children}
  </text>
);

const diamond = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`;

const Frame: React.FC<{ ticks?: number[] }> = ({ ticks = [168, 212, 256] }) => (
  <>
    {ticks.map((y) => (
      <line key={y} x1={CX0} y1={y} x2={CX1} y2={y} stroke={GRID} strokeWidth={1} />
    ))}
    <line x1={CX0} y1={CY0} x2={CX0} y2={CY1} stroke={AXIS} strokeWidth={1.2} />
    <line x1={CX0} y1={CY1} x2={CX1} y2={CY1} stroke={AXIS} strokeWidth={1.2} />
  </>
);

function wavePath(y: number, x0: number, x1: number, amp: number, wl: number, phase: number) {
  let d = `M ${x0} ${y + amp * Math.sin(phase)}`;
  for (let x = x0 + 6; x <= x1; x += 6) {
    const yy = y + amp * Math.sin(phase + ((x - x0) / wl) * TAU);
    d += ` L ${x} ${yy.toFixed(1)}`;
  }
  return d;
}

// partial polyline reveal
function reveal(pts: [number, number][], u: number) {
  const n = pts.length - 1;
  const t = Math.max(0, Math.min(1, u)) * n;
  const k = Math.floor(t);
  const f = t - k;
  const out = pts.slice(0, k + 1).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`);
  let end: [number, number] = pts[Math.min(k, n)];
  if (k < n) {
    const nx = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f;
    const ny = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
    out.push(`${nx.toFixed(1)} ${ny.toFixed(1)}`);
    end = [nx, ny];
  }
  return { d: "M" + out.join(" L"), end };
}

export const SponsorMotifArt: React.FC<{ which: string }> = ({ which }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const s = (c: number, ph = 0) => Math.sin(p * c * TAU + ph);
  const tri = 1 - Math.abs(2 * (p % 1) - 1);
  const triE = ease(tri);

  switch (which) {
    // Cover — an order-book depth chart: liquidity walls around mid
    case "sp-cover": {
      const mid = 246;
      const lh = [176, 150, 122, 96, 64, 38];
      const rh = [42, 72, 100, 128, 156, 182];
      const steps = (hs: number[], x0: number, x1: number, ph: number) => {
        const w = (x1 - x0) / hs.length;
        let d = `M ${x0} ${CY1}`;
        hs.forEach((h, i) => {
          const hh = h * (1 + 0.045 * s(2, ph + i));
          d += ` L ${x0 + i * w} ${CY1 - hh} L ${x0 + (i + 1) * w} ${CY1 - hh}`;
        });
        d += ` L ${x1} ${CY1} Z`;
        return d;
      };
      const bids = steps(lh, CX0, mid, 0);
      const asks = steps(rh, mid, CX1, 2);
      return (
        <>
          <Frame />
          <path d={bids} fill={RED} opacity={0.1} />
          <P d={bids} stroke={RED} sw={1.8} />
          <path d={asks} fill={INK} opacity={0.07} />
          <P d={asks} stroke={INK} sw={1.6} opacity={0.8} />
          <line x1={mid} y1={CY0 - 2} x2={mid} y2={CY1} stroke={MUTED} strokeWidth={1} strokeDasharray="2 5" />
          <circle cx={mid} cy={CY0 + 6 + 3 * s(2)} r={3.5} fill={RED} />
          <Label x={CX0} y={CY1 + 22}>Market depth</Label>
        </>
      );
    }

    // Three weeks, two products — a two-line burn-up across week columns
    case "sp-weeks": {
      const w3 = (CX1 - CX0) / 3;
      const A: [number, number][] = [
        [CX0, CY1], [CX0 + 52, 276], [CX0 + 104, 252], [CX0 + 154, 224], [CX0 + 206, 188], [CX0 + 258, 162], [CX1 - 8, 132],
      ];
      const B: [number, number][] = [
        [CX0, CY1], [CX0 + 52, 290], [CX0 + 104, 272], [CX0 + 154, 246], [CX0 + 206, 226], [CX0 + 258, 196], [CX1 - 8, 172],
      ];
      const ra = reveal(A, triE);
      const rb = reveal(B, Math.max(0, triE - 0.06));
      return (
        <>
          <Frame ticks={[168, 212, 256]} />
          {[1, 2].map((i) => (
            <line key={i} x1={CX0 + i * w3} y1={CY0} x2={CX0 + i * w3} y2={CY1} stroke={GRID} strokeWidth={1} />
          ))}
          {["01", "02", "03"].map((n, i) => (
            <Label key={n} x={CX0 + i * w3 + w3 / 2} y={CY1 + 22} size={11} anchor="middle">{n}</Label>
          ))}
          <P d={rb.d} stroke={INK} sw={1.8} opacity={0.75} />
          <circle cx={rb.end[0]} cy={rb.end[1]} r={3.5} fill={INK} />
          <P d={ra.d} stroke={RED} sw={2.4} />
          <path d={diamond(ra.end[0], ra.end[1], 6)} fill={RED} stroke={RED} strokeWidth={1} />
          <Label x={CX1} y={CY0 - 10} anchor="end">Two products</Label>
        </>
      );
    }

    // Why sponsor — integrations shipping on your stack, stacking up
    case "sp-why": {
      const rows = [
        { y: 150, w: 262, red: true },
        { y: 196, w: 205 },
        { y: 242, w: 160 },
        { y: 288, w: 112 },
      ];
      return (
        <>
          <line x1={CX0} y1={CY0} x2={CX0} y2={CY1} stroke={AXIS} strokeWidth={1.2} />
          {rows.map((r, i) => {
            const grow = ease(Math.max(0, Math.min(1, tri * 1.25 - i * 0.08)));
            const w = r.w * grow;
            return (
              <g key={i}>
                {r.red ? (
                  <rect x={CX0} y={r.y - 11} width={w} height={22} fill={RED} opacity={0.85} rx={2} />
                ) : (
                  <rect x={CX0} y={r.y - 11} width={w} height={22} fill={INK} opacity={0.12} stroke={AXIS} strokeWidth={1} rx={2} />
                )}
              </g>
            );
          })}
          <path d={diamond(CX0 + rows[0].w * ease(Math.min(1, tri * 1.25)) + 14, rows[0].y, 5)} fill={RED} stroke={RED} strokeWidth={1} opacity={0.9} />
          <Label x={CX0} y={CY1 + 22}>Integrations</Label>
        </>
      );
    }

    // Output — slippage curves: yours, flatter
    case "sp-output": {
      const f1 = (u: number) => CY1 - (CY1 - CY0 - 6) * Math.pow(u, 1.5);
      const f2 = (u: number) => CY1 - (CY1 - CY0 - 6) * 0.45 * Math.pow(u, 1.75);
      const line = (f: (u: number) => number) => {
        const pts: string[] = [];
        for (let i = 0; i <= 30; i++) {
          const u = i / 30;
          pts.push(`${(CX0 + u * (CX1 - CX0)).toFixed(1)} ${f(u).toFixed(1)}`);
        }
        return "M" + pts.join(" L");
      };
      const tu = 0.18 + triE * 0.74;
      const tx = CX0 + tu * (CX1 - CX0);
      return (
        <>
          <Frame />
          <P d={line(f1)} stroke={MUTED} sw={1.6} opacity={0.6} />
          <P d={line(f2)} stroke={RED} sw={2.4} />
          <line x1={tx} y1={f1(tu)} x2={tx} y2={CY1} stroke={MUTED} strokeWidth={1} strokeDasharray="2 5" />
          <circle cx={tx} cy={f1(tu)} r={3} fill={MUTED} />
          <circle cx={tx} cy={f2(tu)} r={5} fill={RED} />
          <Label x={CX1} y={f1(1) - 10} anchor="end" size={11}>Before</Label>
          <Label x={CX1} y={f2(1) - 10} anchor="end" size={11} fill={RED}>On your stack</Label>
          <Label x={CX0} y={CY1 + 22}>Slippage</Label>
        </>
      );
    }

    // Partner — orbits around the residency, 1inch on the inner ring
    case "sp-partner": {
      const cx = 246;
      const cy = 214;
      const rot = p * 360; // one full, seamless revolution
      const orbit = (r: number) => (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={GRID} strokeWidth={1.1} strokeDasharray="3 6" />
      );
      const at = (r: number, deg: number) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
      };
      const outer = [0, 90, 180, 270].map((o) => at(96, rot + o));
      const [ix, iy] = at(52, 0); // 1inch holds the apex of the inner ring
      const pulse = 1 + 0.12 * s(3);
      return (
        <>
          {orbit(52)}
          {orbit(96)}
          {outer.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5.5} fill={CREAM} stroke={INK} strokeWidth={1.8} />
          ))}
          <path d={diamond(ix, iy, 9 * pulse)} fill={RED} stroke={RED} strokeWidth={1.2} />
          <circle cx={cx} cy={cy} r={11} fill={CREAM} stroke={INK} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={4} fill={INK} />
          <Label x={ix} y={iy - 18} anchor="middle">1inch</Label>
          <Label x={cx} y={cy + 96 + 34} anchor="middle" size={11}>Partner orbit</Label>
        </>
      );
    }

    // Close — a liquidity pool, filling
    case "sp-close": {
      const x0 = 152;
      const x1 = 340;
      const top = 150;
      const bot = 300;
      const level = bot - 18 - triE * 104;
      const ph = p * 2 * TAU;
      const wave = wavePath(level, x0 + 3, x1 - 3, 3.2, 74, ph);
      const surface = `${wave} L ${x1 - 3} ${bot - 3} L ${x0 + 3} ${bot - 3} Z`;
      return (
        <>
          <P d={`M ${x0} ${top} L ${x0} ${bot} L ${x1} ${bot} L ${x1} ${top}`} sw={2.2} />
          <line x1={x0 - 10} y1={top} x2={x0 + 10} y2={top} stroke={AXIS} strokeWidth={1.3} />
          <line x1={x1 - 10} y1={top} x2={x1 + 10} y2={top} stroke={AXIS} strokeWidth={1.3} />
          <line x1={x0 + 8} y1={176} x2={x1 - 8} y2={176} stroke={MUTED} strokeWidth={1} strokeDasharray="2 5" />
          <path d={surface} fill={RED} opacity={0.11} />
          <P d={wave} stroke={RED} sw={2} />
          <circle cx={(x0 + x1) / 2 + 34 * s(1)} cy={level - 4 + 2.4 * s(2, 1)} r={3.4} fill={RED} />
          <Label x={x1 - 8} y={170} anchor="end" size={11}>Target</Label>
          <Label x={x0} y={bot + 24}>Pool depth</Label>
        </>
      );
    }

    default:
      return null;
  }
};

export const SponsorMotif: React.FC<{ which: string }> = ({ which }) => (
  <AbsoluteFill style={{ backgroundColor: CREAM }}>
    <svg viewBox="0 0 480 420" width={480} height={420} xmlns="http://www.w3.org/2000/svg">
      <SponsorMotifArt which={which} />
    </svg>
  </AbsoluteFill>
);

const ALL = ["sp-cover", "sp-weeks", "sp-why", "sp-output", "sp-partner", "sp-close"];
export const SponsorSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CREAM }}>
    <svg viewBox="0 0 1440 840" width={1440} height={840} xmlns="http://www.w3.org/2000/svg">
      {ALL.map((m, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        return (
          <g key={m} transform={`translate(${col * 480} ${row * 420})`}>
            <rect x={1} y={1} width={478} height={418} fill="none" stroke="rgba(139,133,122,0.28)" strokeWidth={1} />
            <text x={20} y={30} fontSize={15} fill={MUTED} letterSpacing={2} fontFamily={fontFamily} style={{ textTransform: "uppercase" }}>
              {m}
            </text>
            <SponsorMotifArt which={m} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
