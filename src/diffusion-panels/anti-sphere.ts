import { expand } from "@jscad/modeling/src/operations/expansions";
import { cuboid, square } from "@jscad/modeling/src/primitives";

const panel = {
  width: 100,
  height: 100,
  thickness: 10,
};

// A function declaration that returns geometry
export const main = () => {
  return cuboid({
    size: [panel.width, panel.height, panel.thickness],
    center: [0, 0, 0],
  });
};
