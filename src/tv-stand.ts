import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec3 } from "@jscad/modeling/src/maths/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import {
  cylinder,
  roundedCuboid,
  roundedRectangle,
} from "@jscad/modeling/src/primitives";
// @ts-ignore
import { bolt } from "jscad-threadlib";

const stand = {
  thickness: 10,
  padding: 20,
  mount: {
    height: 50,
    width: 50,
    thickness: 30,
    thread: {
      thread: "28-UN-5/8-ext",
      turns: 20,
    },
  },
  screws: {
    diameter: 5,
    spacing: {
      x: 150,
      y: 100,
    },
  },
};

const screwGeo = (center: Vec3) =>
  cylinder({
    radius: stand.screws.diameter / 2,
    height: stand.thickness,
    center,
  });

const screwsGeo = [
  screwGeo([
    stand.screws.spacing.x / 2,
    stand.screws.spacing.y / 2,
    stand.thickness / 2,
  ]),
  screwGeo([
    stand.screws.spacing.x / 2,
    -stand.screws.spacing.y / 2,
    stand.thickness / 2,
  ]),
  screwGeo([
    -stand.screws.spacing.x / 2,
    -stand.screws.spacing.y / 2,
    stand.thickness / 2,
  ]),
  screwGeo([
    -stand.screws.spacing.x / 2,
    stand.screws.spacing.y / 2,
    stand.thickness / 2,
  ]),
];

const panelGeo = subtract(
  extrudeLinear(
    { height: stand.thickness },
    roundedRectangle({
      roundRadius: stand.screws.diameter / 2,
      size: [
        stand.screws.spacing.x + stand.padding,
        stand.screws.spacing.y + stand.padding,
      ],
    })
  ),
  screwsGeo
);

const standThread = translate(
  [0, -stand.mount.height / 2, stand.mount.thickness / 2 + stand.thickness],
  rotate([Math.PI / 2, 0, 0], bolt(stand.mount.thread))
);

const mountGeo = subtract(
  roundedCuboid({
    roundRadius: stand.screws.diameter / 2,
    size: [
      stand.mount.width,
      stand.mount.height,
      stand.mount.thickness + stand.thickness,
    ],
    center: [0, 0, stand.mount.thickness / 2 + stand.thickness],
  }),
  standThread as Geom3
);

export const main = () => {
  // return standThread as Geom3;
  return union(panelGeo, mountGeo);
};
