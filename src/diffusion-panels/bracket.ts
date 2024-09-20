import { expand } from "@jscad/modeling/src/operations/expansions";
import { cube, square } from "@jscad/modeling/src/primitives";

enum Part {
  Panel,
  Beam,
}

interface PanelProps {
  width: number;
  beamThickness: number;
}

interface BeamProps {
  length: number;
  thickness: number;
}

const part: Part = Part.Panel;

const panel = ({}: PanelProps) => {};

const beam = ({}: BeamProps) => {};

// A function declaration that returns geometry
export const main = () => {
  switch (part as Part) {
    case Part.Panel:
      return panel({
        width: 40,
        beamThickness: 10,
      });
    case Part.Beam:
      return beam({
        length: 180,
        thickness: 10,
      });
  }
};
