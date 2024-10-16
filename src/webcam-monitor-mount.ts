import { fromPoints } from "@jscad/modeling/src/geometries/path2";
import { union } from "@jscad/modeling/src/operations/booleans";
import { expand, offset } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { arc } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import { outline } from "./helpers";

const TAU = 2 * Math.PI;

const mount = {
  height: 50,
  diameter: 47,
  opening: degToRad(90),
  thickness: 3,
  holder: {
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
    [-mount.diameter / 2 - mount.thickness],
    fromPoints({ closed: true }, [
      [0, -mount.holder.width / 2],
      [0 - mount.holder.length, -mount.holder.width / 2],
      [0 - mount.holder.length, mount.holder.width / 2],
      [0, mount.holder.width / 2],
    ])
  );

  return extrudeLinear(
    { height: mount.height },
    outline({ delta: mount.thickness, corners: "round" }, arcPoints),
    outline({ delta: mount.thickness, corners: "round" }, holderPoints)
  );
};
