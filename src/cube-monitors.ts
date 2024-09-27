import { subtract } from "@jscad/modeling/src/operations/booleans";
import { cuboid, roundedCuboid } from "@jscad/modeling/src/primitives";

const shell = {
  width: 180,
  thickness: 20,
  radius: 10,
};

export const main = () => {
  return subtract(
    roundedCuboid({
      size: [shell.width, shell.width, shell.width],
      roundRadius: shell.radius,
    }),
    cuboid({
      size: [
        shell.width - shell.thickness * 2,
        shell.width - shell.thickness * 2,
        shell.width - shell.thickness,
      ],
      center: [0, 0, shell.thickness],
    })
  );
};
