import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, sphere, square } from "@jscad/modeling/src/primitives";

const isEven = (n: number) => n % 2 === 0;

const panel = {
  width: 100,
  height: 100,
  thickness: 10,
};

const spheres = {
  radius: 20,
  phase: 0.5,
  spacing: 20,
};

const segments = 10;

// A function declaration that returns geometry
export const main = () => {
  const phaseSpacing = spheres.spacing * spheres.phase;
  const spheresGeo = [
    ...[...Array(panel.width / spheres.spacing + 1).keys()],
  ].map((i) => [
    translate(
      [
        panel.width / 2 - i * spheres.spacing,
        isEven(i) ? phaseSpacing / 2 : -phaseSpacing / 2,
        0,
      ],
      ...[...Array(panel.height / spheres.spacing + 1).keys()].map((j) =>
        translate(
          [0, panel.height / 2 - j * spheres.spacing, 0],
          sphere({ radius: spheres.radius, segments })
        )
      )
    ),
  ]);

  return subtract(
    cuboid({
      size: [panel.width, panel.height, panel.thickness * 2],
    }),
    translate([0, 0, spheres.radius], ...spheresGeo.flat())
  );
};
