import { degToRad } from "@jscad/modeling/src/utils";
import convert from "convert";
import { map } from "./helpers";
import { cylinder } from "@jscad/modeling/src/primitives";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { hull } from "@jscad/modeling/src/operations/hulls";

const TAU = Math.PI * 2;

const rack = {
  angle: degToRad(20),
  radius: convert(2, "in").to("mm"),
  thickness: convert(1 / 2, "in").to("mm"),
  height: convert(3, "in").to("mm"),
  legs: {
    count: 3,
    diameter: convert(2, "in").to("mm"),
  },
  screws: {
    count: 2,
    spread: convert(3, "in").to("mm"),
    diameter: convert(1 / 8, "in").to("mm"),
    head: convert(1 / 4, "in").to("mm"),
  },
};

export const main = () => {
  const frameGeo = hull(
    map(rack.legs.count, (i) => {
      return rotate(
        [0, 0, i * (TAU / rack.legs.count)],
        translate(
          [rack.radius, 0, 0],
          rotate(
            [rack.angle, 0, 0],
            cylinder({
              radius: rack.legs.diameter / 2 + rack.thickness,
              height: rack.height,
            })
          )
        )
      );
    })
  );

  const legGeo = map(rack.legs.count, (i) => {
    return rotate(
      [0, 0, i * (TAU / rack.legs.count)],
      translate(
        [rack.radius, 0, 0],
        rotate(
          [rack.angle, 0, 0],
          cylinder({
            radius: rack.legs.diameter / 2,
            height: rack.height * 2,
          })
        )
      )
    );
  });

  const screwGeo = map(rack.legs.count, (i) => {
    return rotate(
      [0, 0, i * (TAU / rack.legs.count)],
      translate(
        [rack.radius, 0, 0],
        rotate(
          [rack.angle, 0, 0],
          union(
            rotate(
              [0, Math.PI / 2, 0],
              map(rack.screws.count, (i) =>
                cylinder({
                  height: rack.thickness * 2,
                  radius: rack.screws.diameter / 2,
                  center: [
                    i * (rack.screws.spread / rack.screws.count) -
                      rack.screws.spread / 4,
                    0,
                    (rack.legs.diameter + rack.thickness) / 2,
                  ],
                })
              )
            )
          )
        )
      )
    );
  });

  return subtract(frameGeo, legGeo, screwGeo);
};
