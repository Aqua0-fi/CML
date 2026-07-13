import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const CREAM = "#F4F1EA";
const INK = "#16130F";
const RED = "#6B2224";
const MUTED = "#8B857A";
const HAIR = "rgba(139, 133, 122, 0.5)";
const HAIR_SOFT = "rgba(139, 133, 122, 0.32)";
const TAU = Math.PI * 2;
const EASE = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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

// Blueprint registration crosshairs framing every motif
const Corners: React.FC = () => {
  const pts: [number, number][] = [
    [46, 46],
    [434, 46],
    [46, 374],
    [434, 374],
  ];
  return (
    <g opacity={0.42}>
      {pts.map(([x, y], i) => (
        <g key={i}>
          <line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke={MUTED} strokeWidth={1} />
          <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={MUTED} strokeWidth={1} />
        </g>
      ))}
    </g>
  );
};

export const MotifArt: React.FC<{ which: string }> = ({ which }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const s = (c: number, ph = 0) => Math.sin(p * c * TAU + ph);
  const tri = 1 - Math.abs(2 * (p % 1) - 1);
  const triE = EASE(tri);

  const body = (() => {
    switch (which) {
      // Cover — arched window onto the sea, with a small sail
      case "cover": {
        const sun = 1 + 0.06 * s(2);
        const boat = 3 * s(2);
        return (
          <>
            {/* outer molding + inner reveal */}
            <P d="M138 300 C138 200 342 200 342 300" sw={2.2} />
            <P d="M152 300 C152 214 328 214 328 300" sw={1.6} />
            <P d="M138 300 L138 320" sw={2.2} />
            <P d="M342 300 L342 320" sw={2.2} />
            <P d="M152 300 L152 320" sw={1.6} />
            <P d="M328 300 L328 320" sw={1.6} />
            <P d="M124 320 L356 320" sw={2.4} />
            <P d="M124 320 L124 330 L356 330 L356 320" sw={2} />
            {/* sea */}
            <P d="M164 258 L316 258" stroke={HAIR} sw={1.3} />
            <g transform={`translate(240 258) scale(${sun})`}>
              <circle r={16} fill="none" stroke={RED} strokeWidth={2} />
            </g>
            <g transform={`translate(${boat} 0)`}>
              <P d="M206 254 L206 240" sw={1.4} />
              <P d="M206 240 L216 254 L206 254" sw={1.4} stroke={RED} />
              <P d="M198 256 L214 256" sw={1.4} />
            </g>
            <g transform={`translate(0 ${2 * s(2)})`}>
              <P d={wavePath(272, 164, 316, 2.4, 26)} stroke={HAIR} sw={1.3} />
              <P d={wavePath(284, 164, 316, 2, 32)} stroke={HAIR_SOFT} sw={1.2} />
            </g>
          </>
        );
      }

      // Origin — two builders meet; Aqua0 is born
      case "origin": {
        const t = (p % 1);
        // pulse travels along the arc 0..1 (there) then the ripple blooms at center
        const arc = (u: number) => {
          const x = 158 + u * 164;
          const y = 210 - Math.sin(u * Math.PI) * 46;
          return [x, y] as const;
        };
        const [pxp, pyp] = arc(triE);
        const born = Math.max(0, 1 - Math.abs(triE - 0.5) / 0.16);
        const ripple = (t * 1) % 1;
        return (
          <>
            <P d="M158 210 C 200 150 280 150 322 210" stroke={MUTED} sw={1.3} opacity={0.55} />
            {/* nodes (double ring) */}
            {[158, 322].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy={210} r={12} fill={CREAM} stroke={INK} strokeWidth={2} />
                <circle cx={x} cy={210} r={5} fill={CREAM} stroke={MUTED} strokeWidth={1.2} />
              </g>
            ))}
            {/* ripple + Aqua0 diamond */}
            <circle cx={240} cy={210} r={10 + ripple * 26} fill="none" stroke={RED} strokeWidth={1.4} opacity={0.5 * (1 - ripple)} />
            <path d={diamond(240, 210, 7 + born * 8)} fill={RED} stroke={RED} strokeWidth={1.4} opacity={0.4 + born * 0.6} />
            <circle cx={pxp} cy={pyp} r={3.6} fill={RED} />
          </>
        );
      }

      // Goal — the constant-product curve, read like a chart
      case "goal": {
        const k = 44000;
        const pts: string[] = [];
        for (let x = 146; x <= 334; x += 15.7) pts.push(`${x.toFixed(1)} ${(k / x).toFixed(1)}`);
        const curve = "M" + pts.join(" L");
        const tx = 150 + triE * 178;
        const ty = k / tx;
        return (
          <>
            {/* axes + ticks */}
            <P d="M132 300 L346 300" stroke={HAIR} sw={1.3} />
            <P d="M132 300 L132 116" stroke={HAIR} sw={1.3} />
            {[180, 240, 300].map((x) => (
              <line key={x} x1={x} y1={300} x2={x} y2={306} stroke={HAIR} strokeWidth={1} />
            ))}
            {[250, 190, 130].map((y) => (
              <line key={y} x1={126} y1={y} x2={132} y2={y} stroke={HAIR} strokeWidth={1} />
            ))}
            {/* guide lines to the sliding point */}
            <P d={`M${tx} ${ty} L${tx} 300`} stroke={MUTED} sw={1} dash="2 5" opacity={0.7} />
            <P d={`M${tx} ${ty} L132 ${ty}`} stroke={MUTED} sw={1} dash="2 5" opacity={0.7} />
            <P d={curve} stroke={INK} sw={2} />
            <circle cx={tx} cy={ty} r={5} fill={RED} />
          </>
        );
      }

      // Who — a balance beam on a fulcrum (engineers ⇄ go-to-market)
      case "who": {
        const ang = 5.5 * s(2);
        return (
          <>
            {/* fulcrum + ground */}
            <P d="M240 244 L216 300 L264 300 Z" sw={2} />
            <P d="M204 300 L276 300" stroke={HAIR} sw={1.6} />
            {/* beam with a load on each end */}
            <g transform={`rotate(${ang} 240 240)`}>
              <P d="M150 240 L330 240" sw={2.4} />
              <P d="M150 240 L150 228" sw={1.4} />
              <P d="M330 240 L330 228" sw={1.4} />
              <circle cx={150} cy={215} r={12} fill={CREAM} stroke={INK} strokeWidth={2} />
              <circle cx={150} cy={215} r={4.5} fill={CREAM} stroke={MUTED} strokeWidth={1.1} />
              <path d={diamond(330, 215, 12)} fill={RED} stroke={RED} strokeWidth={1.2} />
            </g>
          </>
        );
      }

      // Included — a ticket with a stub, notches and a sweeping highlight
      case "included": {
        const fy = 3 * s(2);
        const sweep = 150 + ((p * 1) % 1) * 210; // light sweep across
        return (
          <g transform={`translate(0 ${fy})`}>
            <P d="M150 168 L318 168 Q326 168 326 176 L326 244 Q326 252 318 252 L150 252 Q142 252 142 244 L142 176 Q142 168 150 168 Z" sw={2.2} />
            {/* stub perforation with notches */}
            <circle cx={288} cy={168} r={5} fill={CREAM} stroke={INK} strokeWidth={1.4} />
            <circle cx={288} cy={252} r={5} fill={CREAM} stroke={INK} strokeWidth={1.4} />
            <P d="M288 175 L288 245" stroke={MUTED} sw={1.2} dash="3 6" />
            {/* seal + lines */}
            <circle cx={180} cy={210} r={13} fill="none" stroke={RED} strokeWidth={1.4} />
            <path d={diamond(180, 210, 5)} fill={RED} stroke={RED} strokeWidth={1} />
            <P d="M210 200 L272 200" stroke={HAIR} sw={1.5} />
            <P d="M210 214 L256 214" stroke={HAIR} sw={1.5} />
            <P d="M300 200 L314 200" stroke={HAIR} sw={1.4} />
            <P d="M300 214 L314 214" stroke={HAIR} sw={1.4} />
            {/* highlight sweep */}
            <line x1={sweep} y1={166} x2={sweep - 20} y2={256} stroke="#FFFFFF" strokeWidth={7} opacity={0.28} />
          </g>
        );
      }

      // The three weeks — a filling progress timeline
      case "weeks": {
        const xs = [166, 240, 314];
        const prog = 166 + triE * 148;
        return (
          <>
            <P d="M150 210 L330 210" stroke={HAIR} sw={1.3} />
            <P d={`M166 210 L${prog} 210`} stroke={RED} sw={2.2} />
            {xs.map((x, i) => {
              const done = prog >= x - 2;
              const active = Math.abs(prog - x) < 12;
              return (
                <g key={i}>
                  {active ? <circle cx={x} cy={210} r={13} fill="none" stroke={RED} strokeWidth={1.2} opacity={0.5} /> : null}
                  <circle cx={x} cy={210} r={7} fill={done ? RED : CREAM} stroke={done ? RED : INK} strokeWidth={2} />
                  <text x={x} y={242} textAnchor="middle" fontSize={13} fill={MUTED} letterSpacing={1}>
                    {`0${i + 1}`}
                  </text>
                </g>
              );
            })}
            <circle cx={prog} cy={210} r={3.6} fill={RED} />
          </>
        );
      }

      // Sponsors — a partner ecosystem (hub & spokes), 1inch highlighted
      case "sponsors": {
        const rot = 6 * s(1);
        const N = 6;
        return (
          <>
            <g transform={`rotate(${rot} 240 206)`}>
              {Array.from({ length: N }).map((_, i) => {
                const a = (i / N) * TAU - Math.PI / 2;
                const x = 240 + Math.cos(a) * 86;
                const y = 206 + Math.sin(a) * 86;
                const isOne = i === 0;
                const pul = 1 + 0.14 * Math.sin(p * 3 * TAU + i);
                return (
                  <g key={i}>
                    <line x1={240} y1={206} x2={x} y2={y} stroke={HAIR_SOFT} strokeWidth={1.1} />
                    {isOne ? (
                      <path d={diamond(x, y, 8 * pul)} fill={RED} stroke={RED} strokeWidth={1.2} />
                    ) : (
                      <circle cx={x} cy={y} r={6 * pul} fill={CREAM} stroke={INK} strokeWidth={1.8} />
                    )}
                  </g>
                );
              })}
            </g>
            <circle cx={240} cy={206} r={11} fill={CREAM} stroke={INK} strokeWidth={2} />
            <circle cx={240} cy={206} r={4} fill={INK} />
          </>
        );
      }

      // Close — a location pin over a map grid, pinging
      case "close": {
        const r1 = (p * 2) % 1;
        const r2 = (p * 2 + 0.5) % 1;
        const ring = (t: number, key: string) => (
          <circle key={key} cx={240} cy={266} r={6 + t * 44} fill="none" stroke={RED} strokeWidth={1.6} opacity={0.5 * (1 - t)} />
        );
        return (
          <>
            {/* faint map grid */}
            {[150, 240, 330].map((x) => (
              <line key={`v${x}`} x1={x} y1={150} x2={x} y2={300} stroke={HAIR_SOFT} strokeWidth={1} />
            ))}
            {[180, 230, 280].map((y) => (
              <line key={`h${y}`} x1={140} y1={y} x2={340} y2={y} stroke={HAIR_SOFT} strokeWidth={1} />
            ))}
            {ring(r1, "r1")}
            {ring(r2, "r2")}
            <P d="M240 168 C212 168 198 189 198 210 C198 238 240 266 240 266 C240 266 282 238 282 210 C282 189 268 168 240 168 Z" sw={2.2} />
            <circle cx={240} cy={207} r={12} fill={CREAM} stroke={RED} strokeWidth={2} />
            <circle cx={240} cy={207} r={5} fill={RED} />
          </>
        );
      }

      default:
        return null;
    }
  })();

  return (
    <>
      <Corners />
      {body}
    </>
  );
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
