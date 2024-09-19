import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, sphere, square } from "@jscad/modeling/src/primitives";
import { count } from "console";

const isEven = (n: number) => n % 2 === 0;

const panel = {
  width: 180,
  height: 180,
  thickness: 20,
};

const spheres = {
  radius: 40,
  phase: 0.5,
  spacing: 60,
  raise: {
    x: 10,
    y: 10,
  },
};

const segments = 100;

// A function declaration that returns geometry
export const main = () => {
  const phaseSpacing = spheres.spacing * spheres.phase;
  const widthCount = panel.width / spheres.spacing;
  const heightCount = panel.height / spheres.spacing;

  const spheresGeo = [...[...Array(widthCount + 1).keys()]].map((i) => [
    translate(
      [
        panel.width / 2 - i * spheres.spacing,
        isEven(i) ? phaseSpacing / 2 : -phaseSpacing / 2,
        spheres.raise.x * -Math.abs(widthCount / 2 - i) + widthCount + 1 / 2,
      ],
      ...[...Array(heightCount + 1).keys()].map((j) =>
        translate(
          [
            0,
            panel.height / 2 - j * spheres.spacing,
            spheres.raise.y * -Math.abs(heightCount / 2 - j) +
              heightCount +
              1 / 2,
          ],
          sphere({ radius: spheres.radius, segments })
        )
      )
    ),
  ]);

  return subtract(
    union(
      cuboid({
        size: [panel.width, panel.height, panel.thickness],
        center: [0, 0, -panel.thickness / 2],
      }),
      cuboid({
        size: [
          panel.width,
          panel.height,
          spheres.radius + Math.max(spheres.raise.x, spheres.raise.y),
        ],
        center: [
          0,
          0,
          (spheres.radius + Math.max(spheres.raise.x, spheres.raise.y)) / 2,
        ],
      })
    ),
    translate(
      [0, 0, spheres.radius + 2 * Math.max(spheres.raise.x, spheres.raise.y)],
      ...spheresGeo.flat()
    )
  );
};
