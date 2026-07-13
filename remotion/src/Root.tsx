import { Composition } from "remotion";
import { CrossMarginLabs } from "./CrossMarginLabs";
import { GoaResidency } from "./GoaResidency";

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
    </>
  );
};
