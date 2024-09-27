import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  cuboid,
  cylinder,
  roundedCuboid,
} from "@jscad/modeling/src/primitives";
import convert from "convert";

const shell = {
  width: 180,
  thickness: 20,
  radius: 10,
};

const speaker = {
  diameter: convert(4, "in").to("mm"),
};

export const main = () => {
  const shellGeo = ({ width, radius, thickness }: typeof shell) => {
    return subtract(
      roundedCuboid({
        size: [width, width, width],
        roundRadius: radius,
      }),
      cuboid({
        size: [width - thickness * 2, width - thickness * 2, width],
        center: [0, 0, thickness],
      })
    );
  };

  const speakerGeo = ({ diameter }: typeof speaker) => {
    return cylinder({
      radius: diameter / 2,
      height: shell.thickness,
      center: [0, 0, -(shell.width - shell.thickness) / 2],
    });
  };

  return subtract(shellGeo(shell), speakerGeo(speaker));
};
