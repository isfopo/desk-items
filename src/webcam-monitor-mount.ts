import { fromPoints } from "@jscad/modeling/src/geometries/path2";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { arc } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import { outline, rotatePoints } from "./helpers";
import { union } from "@jscad/modeling/src/operations/booleans";
import { rotate } from "@jscad/modeling/src/operations/transforms";

const TAU = 2 * Math.PI;

const mount = {
  height: 50,
  diameter: 47,
  opening: degToRad(90),
  thickness: 3,
  holder: {
    reach: 30,
    angle: Math.PI / 4,
    length: 10,
    width: 38,
  },
};

export const main = () => {
  const arcPoints = arc({
    radius: mount.diameter / 2,
    startAngle: mount.opening / 2,
    endAngle: TAU - mount.opening / 2,
  });

  const mountOffset =
    -mount.diameter / 2 - mount.thickness - mount.holder.reach;

  const holderPoints = fromPoints(
    { closed: true },
    rotatePoints(
      [
        [mountOffset, -mount.holder.width / 2],
        [mountOffset + -mount.holder.length, -mount.holder.width / 2],
        [mountOffset + -mount.holder.length, mount.holder.width / 2],
        [mountOffset, mount.holder.width / 2],
      ],
      {
        angle: -mount.holder.angle,
        origin: [0, -(mountOffset + mount.holder.length / 2)],
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
      [0, -mount.diameter / 2 + -mount.thickness / 2],
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
