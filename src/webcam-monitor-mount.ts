import { concat, fromPoints } from "@jscad/modeling/src/geometries/path2";
import { union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { arc, circle, rectangle } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
const TAU = 2 * Math.PI;

const mount = {
  height: 50,
  diameter: 47,
  lip: {
    radius: 5,
  },
  opening: degToRad(90),
  thickness: 3,
  holder: {
    length: 20,
    width: 50,
  },
};

export const main = () => {
  // Create the arc as an array of points
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

  // Now you can pass it to the union function!
  return extrudeLinear(
    { height: mount.height },
    union(
      expand({ delta: mount.thickness }, arcPoints),
      expand({ delta: mount.thickness }, holderPoints)
    )
  );
};
