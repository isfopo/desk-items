import { expand } from "@jscad/modeling/src/operations/expansions";
import { cube, square } from "@jscad/modeling/src/primitives";

enum Part {
  Panel,
  Beam,
}

const part: Part = Part.Panel;

const panel = () => {};

const beam = () => {};

// A function declaration that returns geometry
export const main = () => {
  switch (part as Part) {
    case Part.Panel:
      return panel();
    case Part.Beam:
      return beam();
  }
};
