import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cylinder } from "@jscad/modeling/src/primitives";

const PHI = 1.618033988749895;
const baseHeight = 20;

const roundRadius = 0;
const segments = 100;

const candleHolder = {
  height: baseHeight * PHI,
  depth: baseHeight - roundRadius,
  diameter: 40 + roundRadius * 2,
  thickness: 20 / PHI,
};

const woodHolder = {
  diameter: 25 + roundRadius * 2,
  thickness: 25 / (4 * PHI) - roundRadius * 2,
  height: candleHolder.height * PHI,
  depth: 40,
  tray: {
    height: baseHeight / PHI - roundRadius,
    diameter: 2 * ((candleHolder.diameter / 2 + candleHolder.thickness) * PHI),
  },
};

export const main = () => {
  const candleHolderGeo = () => {
    return subtract(
      cylinder({
        radius: candleHolder.diameter / 2 + candleHolder.thickness,
        height: candleHolder.height,
        center: [0, 0, candleHolder.height / 2],
        segments,
      }),
      cylinder({
        radius: candleHolder.diameter / 2,
        height: candleHolder.depth,
        center: [0, 0, candleHolder.height - candleHolder.depth / 2],
        segments,
      })
    );
  };

  const woodHolderGeo = () => {
    const stand = subtract(
      cylinder({
        radius: woodHolder.diameter / 2 + woodHolder.thickness,
        height: woodHolder.height,
        center: [0, 0, woodHolder.height / 2],
        segments,
      }),
      cylinder({
        radius: (woodHolder.diameter - woodHolder.thickness / 2) / 2,
        height: woodHolder.depth,
        center: [0, 0, woodHolder.height - woodHolder.depth / 2],
        segments,
      })
    );
    const tray = subtract(
      cylinder({
        radius: woodHolder.tray.diameter / 2 + woodHolder.thickness,
        height: woodHolder.tray.height,
        center: [0, 0, woodHolder.tray.height / 2],
        segments,
      }),
      cylinder({
        radius: woodHolder.tray.diameter / 2,
        height: woodHolder.tray.height - woodHolder.thickness,
        center: [0, 0, (woodHolder.tray.height + woodHolder.thickness) / 2],
        segments,
      })
    );

    if (roundRadius === 0) {
      return union(stand, tray);
    }

    return expand({ delta: roundRadius, segments }, union(stand, tray));
  };

  const offset =
    (woodHolder.tray.diameter + woodHolder.diameter - candleHolder.diameter) /
    2;

  return union(translate([0, offset, 0], candleHolderGeo()), woodHolderGeo());
};
