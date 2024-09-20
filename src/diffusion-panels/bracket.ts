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
  beamWidth: number;
}

interface BeamProps {
  length: number;
  width: number;
  thickness: number;
}

const part: Part = Part.Beam;

const panel = ({ width, beamThickness, beamWidth }: PanelProps) => {
  return subtract(
    cuboid({
      size: [width, width, beamWidth],
    }),
    cuboid({
      size: [width - beamThickness / 2, width - beamThickness / 2, beamWidth],
      center: [beamThickness / 4, beamThickness / 4, beamWidth / 4],
    })
  );
};

const beam = ({ width, length, thickness }: BeamProps) => {
  return cuboid({ size: [length, width, thickness] });
};

// A function declaration that returns geometry
export const main = () => {
  switch (part as Part) {
    case Part.Panel:
      return panel({
        width: 60,
        beamThickness: 5,
        beamWidth: 15,
      });
    case Part.Beam:
      return beam({
        length: 180,
        width: 16,
        thickness: 5,
      });
  }
};
