import { Composition } from "remotion";
import { CrossMarginLabs } from "./CrossMarginLabs";
import { GoaResidency } from "./GoaResidency";
import { Motif, MotifSheet } from "./DeckMotifs";

const MOTIFS = [
  "cover",
  "origin",
  "goal",
  "who",
  "included",
  "weeks",
  "sponsors",
  "close",
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CrossMarginLabs"
        component={CrossMarginLabs}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="GoaResidency"
        component={GoaResidency}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="motif-sheet"
        component={MotifSheet}
        durationInFrames={96}
        fps={24}
        width={1920}
        height={840}
      />
      {MOTIFS.map((m) => (
        <Composition
          key={m}
          id={`motif-${m}`}
          component={Motif}
          defaultProps={{ which: m }}
          durationInFrames={96}
          fps={24}
          width={480}
          height={420}
        />
      ))}
    </>
  );
};
