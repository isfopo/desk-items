import { Vec3 } from "@jscad/modeling/src/maths/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import {
  cylinder,
  roundedCuboid,
  roundedRectangle,
} from "@jscad/modeling/src/primitives";

const stand = {
  thickness: 10,
  padding: 20,
  mount: {
    height: 50,
    width: 50,
    thickness: 30,
  },
  screws: {
    diameter: 5,
    spacing: {
      x: 150,
      y: 100,
    },
  },
};

const panelGeo = extrudeLinear(
  { height: stand.thickness },
  roundedRectangle({
    roundRadius: stand.screws.diameter / 2,
    size: [
      stand.screws.spacing.x + stand.padding,
      stand.screws.spacing.y + stand.padding,
    ],
  })
);

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

const mountGeo = roundedCuboid({
  roundRadius: stand.screws.diameter / 2,
  size: [
    stand.mount.width,
    stand.mount.height + stand.thickness,
    stand.mount.thickness,
  ],
  center: [0, 0, (stand.mount.thickness + stand.thickness) / 2],
});

export const main = () => {
  return subtract(union(panelGeo, mountGeo), screwsGeo);
};
