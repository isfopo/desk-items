import { transforms, booleans } from "@jscad/modeling";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { rotate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, cylinder } from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import convert from "convert";

const { translate } = transforms;
const { subtract } = booleans;

const base = {
  width: 25,
  height: 40,
  length: 150,
  delta: 2,
};

const slot = {
  thickness: 20,
  offset: -30,
  raise: 10,
  angle: degToRad(20),
};

const posts = {
  diameter: convert(3 / 8, "in").to("mm"),
  points: [
    [65, 10],
    [-65, -10],
    [65, -10],
  ],
};

// A function declaration that returns geometry
export const main = () => {
  const postGeo = () => {
    return rotate(
      [0, Math.PI / 2, 0],
      cylinder({
        height: base.width + base.delta,
        radius: posts.diameter / 2,
      })
    );
  };

  return subtract(
    expand(
      { delta: base.delta, corners: "round" },
      cuboid({
        size: [
          base.width - base.delta,
          base.length - base.delta,
          base.height - base.delta,
        ],
      })
    ),
    translate(
      [0, slot.offset, slot.raise],
      rotate(
        [-slot.angle, 0, 0],
        cuboid({
          size: [base.width + base.delta, slot.thickness, base.height],
        })
      )
    ),
    ...posts.points.map(([y, z]) => translate([0, y, z], postGeo()))
  );
};
