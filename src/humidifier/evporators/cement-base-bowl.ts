import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { rotate } from "@jscad/modeling/src/operations/transforms";
import { cylinder, ellipsoid } from "@jscad/modeling/src/primitives";
import { map } from "../../helpers";

const PHI = 1.618033988749895;
const baseHeight = 20;

const part: "bowl" | "base" = "base" as "bowl" | "base";

const roundRadius = 0;
const segments = 50;

const candleHolder = {
  height: baseHeight * PHI,
  depth: baseHeight - roundRadius,
  diameter: 40 + roundRadius * 2,
  thickness: 30 / PHI,
  supports: {
    count: 4,
    diameter: (baseHeight / 2) * PHI,
    height: 3 * baseHeight * PHI,
  },
};

const bowl = {
  diameter: baseHeight * 5,
  depth: (baseHeight * 5) / PHI,
  thickness: baseHeight / PHI,
};

export const main = () => {
  const supportGeo = ({
    count,
    diameter,
    height,
  }: typeof candleHolder.supports) => {
    return map(count, (i) =>
      rotate(
        [0, 0, (i * (Math.PI * 2)) / count],
        cylinder({
          height: height,
          radius: diameter / 2,
          center: [
            candleHolder.diameter / 2 + candleHolder.thickness,
            0,
            height / 2,
          ],
          segments,
        })
      )
    );
  };

  const candleHolderGeo = () => {
    return union(
      subtract(
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
      ),
      supportGeo(candleHolder.supports)
    );
  };

  const bowlGeo = () => {
    return subtract(
      ellipsoid({
        radius: [
          bowl.diameter / 2 + bowl.thickness,
          bowl.diameter / 2 + bowl.thickness,
          bowl.depth + bowl.thickness,
        ],
        center: [0, 0, bowl.depth],
        segments,
      }),
      ellipsoid({
        radius: [bowl.diameter / 2, bowl.diameter / 2, bowl.depth / PHI],
        center: [0, 0, bowl.depth / PHI],
        segments,
      }),
      cylinder({
        radius: bowl.diameter / 2 + bowl.thickness,
        height: bowl.diameter + bowl.thickness,
        center: [0, 0, (bowl.diameter + bowl.thickness) / 2 + bowl.depth / PHI],
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
