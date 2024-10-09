import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cylinder, sphere } from "@jscad/modeling/src/primitives";

const PHI = 1.618033988749895;
const baseHeight = 20;

const part: "bowl" | "base" = "bowl" as "bowl" | "base";

const roundRadius = 0;
const segments = 50;

const candleHolder = {
  height: baseHeight * PHI,
  depth: baseHeight - roundRadius,
  diameter: 40 + roundRadius * 2,
  thickness: 20 / PHI,
};

const bowl = {
  diameter: 100,
  depth: 50,
  thickness: 10,
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

  const bowlGeo = () => {
    return subtract(
      sphere({
        radius: bowl.diameter / 2 + bowl.thickness,
        center: [0, 0, bowl.diameter / 2],
        segments,
      }),
      sphere({
        radius: bowl.diameter / 2,
        center: [0, 0, bowl.diameter / 2],
        segments,
      }),
      cylinder({
        radius: bowl.diameter / 2 + bowl.thickness,
        height: bowl.diameter + bowl.thickness,
        center: [0, 0, (bowl.diameter + bowl.thickness) / 2 + bowl.depth],
        segments,
      })
    );
  };

  switch (part) {
    case "base":
      return union(candleHolderGeo());
    case "bowl":
      return bowlGeo();
  }
};
