import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import {
  circle,
  cylinder,
  roundedCuboid,
} from "@jscad/modeling/src/primitives";

const roundRadius = 4;
const segments = 10;

const candleHolder = {
  height: 50,
  depth: 30,
  thickness: 20,
  diameter: 50 + roundRadius,
};

const woodHolder = {
  thickness: 5,
  diameter: 20 + roundRadius,
  tray: {
    height: 20,
    diameter: 100,
  },
};

export const main = () => {
  const candleHolderGeo = () => {
    return expand(
      { delta: roundRadius, corners: "round", segments },
      subtract(
        cylinder({
          radius: candleHolder.diameter / 2 + candleHolder.thickness,
          height: candleHolder.height,
          segments,
        }),
        cylinder({
          radius: candleHolder.diameter / 2,
          height: candleHolder.depth,
          center: [0, 0, (candleHolder.height - candleHolder.depth) / 2],
          segments,
        })
      )
    );
  };

  const woodHolderGeo = () => {
    return expand(
      { delta: roundRadius, corners: "round", segments },
      subtract(
        cylinder({
          radius: woodHolder.tray.diameter / 2 + woodHolder.thickness,
          height: woodHolder.tray.height,
          segments,
        }),
        cylinder({
          radius: woodHolder.tray.diameter / 2,
          height: woodHolder.tray.height - woodHolder.thickness,
          center: [0, 0, woodHolder.thickness / 2],
          segments,
        })
      )
    );
  };

  return woodHolderGeo();
};
