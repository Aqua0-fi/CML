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

function polar(cx: number, cy: number, r: number, ang: number) {
  const a = ((ang - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}
function arc(cx: number, cy: number, r: number, deg: number) {
  const d = Math.min(359.9, Math.max(0.001, deg));
  const [sx, sy] = polar(cx, cy, r, 0);
  const [ex, ey] = polar(cx, cy, r, d);
  const large = d > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

// faint horizontal gridlines + baseline + left axis
const Frame: React.FC<{ ticks?: number[] }> = ({ ticks = [168, 212, 256] }) => (
  <>
    {ticks.map((y) => (
      <line key={y} x1={CX0} y1={y} x2={CX1} y2={y} stroke={GRID} strokeWidth={1} />
    ))}
    <line x1={CX0} y1={CY0} x2={CX0} y2={CY1} stroke={AXIS} strokeWidth={1.2} />
    <line x1={CX0} y1={CY1} x2={CX1} y2={CY1} stroke={AXIS} strokeWidth={1.2} />
  </>
);

export const MotifArt: React.FC<{ which: string }> = ({ which }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const s = (c: number, ph = 0) => Math.sin(p * c * TAU + ph);
  const tri = 1 - Math.abs(2 * (p % 1) - 1);
  const triE = ease(tri);

  switch (which) {
    // Cover — a family of yield curves (term structure)
    case "cover": {
      const curve = (H: number, ph: number) => {
        const pts: string[] = [];
        for (let i = 0; i <= 24; i++) {
          const x = CX0 + (i / 24) * (CX1 - CX0);
          const u = i / 24;
          const y = CY1 - H * (1.03 + 0.05 * Math.sin(p * TAU + ph)) * (1 - Math.pow(1 - u, 1.7));
          pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        return pts;
      };
      const top = curve(168, 0);
      const line = "M" + top.join(" L");
      const area = `M${CX0} ${CY1} L` + top.join(" L") + ` L${CX1} ${CY1} Z`;
      const mk = Math.round(triE * 24);
      const [mx, my] = top[mk].split(" ").map(Number);
      return (
        <>
          <Frame />
          <P d={"M" + curve(96, 1.4).join(" L")} stroke={MUTED} sw={1.4} opacity={0.55} />
          <P d={"M" + curve(58, 2.6).join(" L")} stroke={MUTED} sw={1.3} opacity={0.4} />
          <path d={area} fill={RED} opacity={0.08} />
          <P d={line} stroke={RED} sw={2.2} />
          <circle cx={mx} cy={my} r={4.5} fill={RED} />
          <Label x={CX0} y={CY1 + 22} size={12}>Term structure</Label>
        </>
      );
    }

    // Origin — two series converge into one (a founder meets his CTO)
    case "origin": {
      const mx = 300;
      const my = 224;
      const A = { x0: CX0, y0: 150 };
      const B = { x0: CX0, y0: 300 };
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const ax = lerp(A.x0, mx, triE);
      const ay = lerp(A.y0, my, triE);
      const bx = lerp(B.x0, mx, triE);
      const by = lerp(B.y0, my, triE);
      const ripple = (p % 1);
      return (
        <>
          <Frame ticks={[170, 224, 278]} />
          <P d={`M${A.x0} ${A.y0} L${mx} ${my}`} stroke={MUTED} sw={1.5} opacity={0.5} />
          <P d={`M${B.x0} ${B.y0} L${mx} ${my}`} stroke={MUTED} sw={1.5} opacity={0.5} />
          <P d={`M${mx} ${my} L${CX1} ${my}`} stroke={INK} sw={2.4} />
          <circle cx={ax} cy={ay} r={4} fill={INK} />
          <circle cx={bx} cy={by} r={4} fill={INK} />
          <circle cx={mx} cy={my} r={9 + ripple * 22} fill="none" stroke={RED} strokeWidth={1.3} opacity={0.5 * (1 - ripple)} />
          <path d={diamond(mx, my, 8)} fill={RED} stroke={RED} strokeWidth={1.2} />
          <Label x={CX1} y={my - 14} anchor="end">Aqua0</Label>
        </>
      );
    }

    // Goal — the AMM invariant x·y = k with liquidity shaded
    case "goal": {
      const f = (x: number) => {
        const u = (x - CX0) / (CX1 - CX0);
        return CY1 - (CY1 - CY0) * Math.pow(1 - u, 1.8);
      };
      const pts: string[] = [];
      for (let x = CX0; x <= CX1; x += 11) pts.push(`${x} ${f(x).toFixed(1)}`);
      const line = "M" + pts.join(" L");
      const area = `M${CX0} ${CY1} L` + pts.join(" L") + ` L${CX1} ${CY1} Z`;
      const tx = CX0 + 26 + triE * (CX1 - CX0 - 52);
      const ty = f(tx);
      return (
        <>
          <Frame />
          <path d={area} fill={RED} opacity={0.09} />
          <P d={`M${tx} ${ty} L${tx} ${CY1}`} stroke={MUTED} sw={1} dash="2 5" />
          <P d={`M${tx} ${ty} L${CX0} ${ty}`} stroke={MUTED} sw={1} dash="2 5" />
          <P d={line} stroke={RED} sw={2.4} />
          <circle cx={tx} cy={ty} r={5} fill={RED} />
          <Label x={CX0} y={CY1 + 22}>x · y = k</Label>
        </>
      );
    }

    // Who — diverging bars: engineering ⇄ go-to-market, balanced
    case "who": {
      const cxc = 244;
      const rows = [172, 216, 260];
      const base = [92, 78, 70];
      const bal = 6 * s(2);
      return (
        <>
          <Label x={cxc - 96} y={140} anchor="end">Eng</Label>
          <Label x={cxc + 96} y={140} anchor="start">GTM</Label>
          {rows.map((y, i) => {
            const L = base[i] + bal;
            const R = base[i] - bal;
            return (
              <g key={i}>
                <rect x={cxc - L} y={y - 9} width={L} height={18} fill={INK} opacity={0.85} rx={2} />
                <rect x={cxc} y={y - 9} width={R} height={18} fill={RED} opacity={0.85} rx={2} />
              </g>
            );
          })}
          <line x1={cxc} y1={150} x2={cxc} y2={286} stroke={AXIS} strokeWidth={1.4} />
        </>
      );
    }

    // Included — a coverage KPI ring at 100%
    case "included": {
      const cx = 244;
      const cy = 214;
      const r = 60;
      const frac = ease(Math.min(1, tri * 1.15));
      return (
        <>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={GRID} strokeWidth={7} />
          <path d={arc(cx, cy, r, frac * 360)} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <text x={cx} y={cy + 4} fontSize={34} fill={INK} fontFamily={fontFamily} textAnchor="middle" fontWeight={600}>
            {Math.round(frac * 100)}%
          </text>
          <Label x={cx} y={cy + 30} anchor="middle" size={11}>Covered</Label>
        </>
      );
    }

    // The three weeks — a mini Gantt with a sweeping playhead
    case "weeks": {
      const rows = [
        { y: 168, x0: 118, x1: 236, n: "01" },
        { y: 214, x0: 190, x1: 320, n: "02" },
        { y: 260, x0: 268, x1: 392, n: "03" },
      ];
      const play = CX0 + 20 + triE * (CX1 - CX0 - 20);
      return (
        <>
          <Frame ticks={[]} />
          {[140, 200, 260, 320, 380].map((x) => (
            <line key={x} x1={x} y1={CY0} x2={x} y2={CY1} stroke={GRID} strokeWidth={1} />
          ))}
          {rows.map((r, i) => {
            const fillEnd = Math.max(r.x0, Math.min(play, r.x1));
            return (
              <g key={i}>
                <rect x={r.x0} y={r.y - 9} width={r.x1 - r.x0} height={18} fill="none" stroke={AXIS} strokeWidth={1.3} rx={3} />
                <rect x={r.x0} y={r.y - 9} width={fillEnd - r.x0} height={18} fill={RED} opacity={0.85} rx={3} />
                <Label x={CX0 - 4} y={r.y + 4} anchor="end" size={11}>{r.n}</Label>
              </g>
            );
          })}
          <line x1={play} y1={CY0 - 4} x2={play} y2={CY1 + 4} stroke={INK} strokeWidth={1.4} />
          <circle cx={play} cy={CY0 - 4} r={3} fill={INK} />
        </>
      );
    }

    // Sponsors — a partner network graph, 1inch highlighted
    case "sponsors": {
      const nodes = [
        { x: 244, y: 210, hub: true },
        { x: 150, y: 150, one: true },
        { x: 340, y: 150 },
        { x: 358, y: 250 },
        { x: 244, y: 300 },
        { x: 130, y: 258 },
        { x: 300, y: 196 },
      ];
      const edges: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 6], [2, 6], [3, 4],
      ];
      const drift = nodes.map((nd, i) => [nd.x + 3 * s(1, i), nd.y + 3 * s(1.3, i * 1.7)] as const);
      const pe = edges[Math.floor((p % 1) * edges.length) % edges.length];
      const pf = ((p % 1) * edges.length) % 1;
      const [a, b] = pe;
      const px = drift[a][0] + (drift[b][0] - drift[a][0]) * pf;
      const py = drift[a][1] + (drift[b][1] - drift[a][1]) * pf;
      return (
        <>
          {edges.map(([u, v], i) => (
            <line key={i} x1={drift[u][0]} y1={drift[u][1]} x2={drift[v][0]} y2={drift[v][1]} stroke={GRID} strokeWidth={1.2} />
          ))}
          <circle cx={px} cy={py} r={3} fill={RED} />
          {nodes.map((nd, i) => {
            const [x, y] = drift[i];
            if (nd.one) return <path key={i} d={diamond(x, y, 9)} fill={RED} stroke={RED} strokeWidth={1.2} />;
            if (nd.hub)
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={11} fill={CREAM} stroke={INK} strokeWidth={2} />
                  <circle cx={x} cy={y} r={4} fill={INK} />
                </g>
              );
            return <circle key={i} cx={x} cy={y} r={6} fill={CREAM} stroke={INK} strokeWidth={1.8} />;
          })}
          <Label x={drift[1][0] - 14} y={drift[1][1] - 12} anchor="end">1inch</Label>
        </>
      );
    }

    // Close — growth bars with a trend line, a marker at the peak
    case "close": {
      const bx = [120, 168, 216, 264, 312, 360];
      const h = [46, 66, 92, 120, 152, 186];
      const grow = ease(Math.min(1, tri * 1.2));
      const tops = bx.map((x, i) => [x, CY1 - h[i] * grow] as const);
      const trend = "M" + tops.map((t) => `${t[0]} ${t[1]}`).join(" L");
      const [lx, ly] = tops[tops.length - 1];
      return (
        <>
          <Frame ticks={[168, 212, 256]} />
          {bx.map((x, i) => (
            <rect key={i} x={x - 13} y={CY1 - h[i] * grow} width={26} height={h[i] * grow} fill={INK} opacity={0.12} stroke={AXIS} strokeWidth={1} />
          ))}
          <P d={trend} stroke={RED} sw={2.4} />
          {tops.map((t, i) => (
            <circle key={i} cx={t[0]} cy={t[1]} r={2.6} fill={RED} />
          ))}
          <circle cx={lx} cy={ly} r={6} fill="none" stroke={RED} strokeWidth={1.6} opacity={0.5 + 0.4 * s(3)} />
          <P d={`M${lx} ${ly - 14} L${lx} ${ly - 24} M${lx - 5} ${ly - 19} L${lx} ${ly - 24} L${lx + 5} ${ly - 19}`} stroke={RED} sw={1.6} />
          <Label x={CX0} y={CY1 + 22}>Output</Label>
        </>
      );
    }

    default:
      return null;
  }
};

export const Motif: React.FC<{ which: string }> = ({ which }) => (
  <AbsoluteFill style={{ backgroundColor: CREAM }}>
    <svg viewBox="0 0 480 420" width={480} height={420} xmlns="http://www.w3.org/2000/svg">
      <MotifArt which={which} />
    </svg>
  </AbsoluteFill>
);

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
            <text x={20} y={30} fontSize={15} fill={MUTED} letterSpacing={2} fontFamily={fontFamily} style={{ textTransform: "uppercase" }}>
              {m}
            </text>
            <MotifArt which={m} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
