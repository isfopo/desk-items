import { fromPoints } from "@jscad/modeling/src/geometries/path2";
import { union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { arc } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";

const TAU = 2 * Math.PI;

const mount = {
  height: 50,
  diameter: 47,
  lip: {
    radius: 5,
    angle: degToRad(90),
  },
  opening: degToRad(90),
  thickness: 3,
  holder: {
    length: 20,
    width: 50,
  },
};

export const main = () => {
  const arcPoints = arc({
    radius: mount.diameter / 2,
    startAngle: mount.opening / 2,
    endAngle: TAU - mount.opening / 2,
  });

  const holderPoints = fromPoints({ closed: true }, [
    [-mount.diameter / 2, -mount.holder.width / 2],
    [-mount.diameter / 2 - mount.holder.length, -mount.holder.width / 2],
    [-mount.diameter / 2 - mount.holder.length, mount.holder.width / 2],
    [-mount.diameter / 2, mount.holder.width / 2],
  ]);

  return extrudeLinear(
    { height: mount.height },
    union(
      expand({ delta: mount.thickness, corners: "round" }, arcPoints),
      expand({ delta: mount.thickness, corners: "round" }, holderPoints)
    )
  );
};
