import { expand } from "@jscad/modeling/src/operations/expansions";
import { cube, square } from "@jscad/modeling/src/primitives";

// A function declaration that returns geometry
export const main = () => {
  return expand({ delta: 5, corners: "chamfer" }, square({ size: 30 }));
};
