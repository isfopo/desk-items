import { fromPoints } from "@jscad/modeling/src/geometries/path2";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { arc } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import { outline, rotatePoints } from "./helpers";
import { union } from "@jscad/modeling/src/operations/booleans";
import { rotate } from "@jscad/modeling/src/operations/transforms";
import {} from "@jscad/modeling/src/maths/utils";

const TAU = 2 * Math.PI;

const mount = {
  height: 48,
  diameter: 48,
  opening: degToRad(120),
  thickness: 3,
  holder: {
    reach: 64,
    angle: degToRad(0),
    length: 14,
    width: 42,
  },
};

const arcPoints = arc({
  radius: mount.diameter / 2,
  startAngle: mount.opening / 2,
  endAngle: TAU - mount.opening / 2,
});

const holderPoints = fromPoints(
  { closed: true },
  rotatePoints(
    [
      [-mount.holder.reach, -mount.holder.width / 2],
      [-mount.holder.reach + -mount.holder.length, -mount.holder.width / 2],
      [-mount.holder.reach + -mount.holder.length, mount.holder.width / 2],
      [-mount.holder.reach, mount.holder.width / 2],
    ],
    {
      angle: -mount.holder.angle,
      origin: [0, 0],
    }
  )
);

const bracePoints = {
  left: fromPoints({ closed: false }, [
    [
      holderPoints.points[2][0] + mount.thickness / 2,
      holderPoints.points[2][1] + mount.thickness / 2,
    ],
    [0, mount.diameter / 2 + mount.thickness / 2],
  ]),
  right: fromPoints({ closed: false }, [
    [
      holderPoints.points[0][0] + mount.thickness / 2,
      holderPoints.points[0][1] - mount.thickness / 2,
    ],
    [
      -(Math.PI * mount.holder.angle),
      -mount.diameter / 2 + -mount.thickness / 2,
    ],
  ]),
  middle: fromPoints({ closed: false }, [
    [
      holderPoints.points[3][0] + mount.thickness / 2,
      holderPoints.points[3][1] - mount.thickness / 2,
    ],
    [-mount.diameter / 2 + -mount.thickness / 2, 0],
  ]),
  otherMiddle: fromPoints({ closed: false }, [
    [
      holderPoints.points[0][0] + mount.thickness / 2,
      holderPoints.points[0][1] - mount.thickness / 2,
    ],
    [-mount.diameter / 2 + -mount.thickness / 2, 0],
  ]),
};

export const main = () => {
  return union(
    extrudeLinear(
      { height: mount.height },
      outline({ delta: mount.thickness, corners: "round" }, arcPoints)
    ),
    rotate(
      [0, 0, mount.holder.angle],
      extrudeLinear(
        { height: mount.height },
        outline({ delta: mount.thickness, corners: "round" }, holderPoints),
        expand({ delta: mount.thickness, corners: "round" }, bracePoints.left),
        expand({ delta: mount.thickness, corners: "round" }, bracePoints.right),
        expand(
          { delta: mount.thickness, corners: "round" },
          bracePoints.middle
        ),
        expand(
          { delta: mount.thickness, corners: "round" },
          bracePoints.otherMiddle
        )
      )
    )
  );
};
