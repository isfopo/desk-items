import { subtract } from "@jscad/modeling/src/operations/booleans";
import { expand } from "@jscad/modeling/src/operations/expansions";
import { cube, cuboid, square } from "@jscad/modeling/src/primitives";

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
  width: number;
  thickness: number;
}

const part: Part = Part.Panel;

const panel = ({ width, beamThickness }: PanelProps) => {
  return subtract(
    cuboid({
      size: [width, width, beamThickness],
    }),
    cuboid({
      size: [
        width - beamThickness / 4,
        width - beamThickness / 4,
        beamThickness,
      ],
      center: [beamThickness / 8, beamThickness / 8, beamThickness / 4],
    })
  );
};

const beam = ({}: BeamProps) => {
  return cube({ size: 10 });
};

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
        width: 20,
        thickness: 10,
      });
  }
};
