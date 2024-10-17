import { Vec3 } from "@jscad/modeling/src/maths/types";
import { subtract } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { cylinder, roundedRectangle } from "@jscad/modeling/src/primitives";

const stand = {
  thickness: 10,
  padding: 20,
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

export const main = () => {
  return subtract(panelGeo, screwsGeo);
};
