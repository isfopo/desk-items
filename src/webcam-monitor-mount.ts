import { fromPoints } from "@jscad/modeling/src/geometries/path2";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { mirrorY, translate } from "@jscad/modeling/src/operations/transforms";
import { arc } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import { outline } from "./helpers";
//@ts-ignore
import { honeycomb as honeycombGeo } from "jscad-honeycomb";

const TAU = 2 * Math.PI;

const mount = {
  height: 50,
  diameter: 47,
  opening: degToRad(90),
  thickness: 3,
  holder: {
    reach: 20,
    length: 10,
    width: 36,
  },
};

export const main = () => {
  const arcPoints = arc({
    radius: mount.diameter / 2,
    startAngle: mount.opening / 2,
    endAngle: TAU - mount.opening / 2,
  });

  const holderPoints = translate(
    [-mount.diameter / 2 - mount.thickness - mount.holder.reach],
    fromPoints({ closed: true }, [
      [0, -mount.holder.width / 2],
      [0 - mount.holder.length, -mount.holder.width / 2],
      [0 - mount.holder.length, mount.holder.width / 2],
      [0, mount.holder.width / 2],
    ])
  );
  const bracePoints = fromPoints({ closed: false }, [
    [
      -mount.diameter / 2 -
        mount.holder.length -
        mount.thickness -
        mount.holder.reach,
      mount.holder.width / 2 + mount.thickness / 2,
    ],
    [0, mount.diameter / 2 + mount.thickness / 2],
  ]);

  return extrudeLinear(
    { height: mount.height },
    outline({ delta: mount.thickness, corners: "round" }, arcPoints),
    outline({ delta: mount.thickness, corners: "round" }, holderPoints),
    expand({ delta: mount.thickness, corners: "round" }, bracePoints),
    mirrorY(expand({ delta: mount.thickness, corners: "round" }, bracePoints))
  );
};
