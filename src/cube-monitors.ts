import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { rotate } from "@jscad/modeling/src/operations/transforms";
import {
  cuboid,
  cylinder,
  roundedCuboid,
} from "@jscad/modeling/src/primitives";
import { degToRad } from "@jscad/modeling/src/utils";
import convert from "convert";

const TAU = Math.PI * 2;

enum Part {
  Body = "body",
  Panel = "panel",
}

const part = Part.Panel as Part;

const shell = {
  width: convert(13 / 2, "in").to("mm"),
  thickness: convert(3 / 4, "in").to("mm"),
  radius: convert(1 / 4, "in").to("mm"),
};

const panel = {
  width: convert(6, "in").to("mm"),
  thickness: convert(1 / 8, "in").to("mm"),
  screws: {
    countPerSide: 2,
    diameter: convert(1 / 8, "in").to("mm"),
    length: convert(1 / 2, "in").to("mm"),
    inset: convert(1 / 2, "in").to("mm"),
  },
  jack: {
    center: {
      x: 0,
      y: 0,
    },
    diameter: convert(1 / 2, "in").to("mm"),
  },
  pcbMount: {
    center: {
      x: 0,
      y: 0,
    },
    width: convert(1 / 2, "in").to("mm"),
    height: convert(1 / 2, "in").to("mm"),
  },
  power: {
    center: {
      x: 0,
      y: 0,
    },
    width: convert(1 / 2, "in").to("mm"),
    height: convert(1 / 2, "in").to("mm"),
  },
};

const speaker = {
  diameter: convert(4, "in").to("mm"),
  screws: {
    count: 4,
    diameter: convert(1 / 8, "in").to("mm"),
    length: convert(1 / 2, "in").to("mm"),
    offset: convert(3 / 8, "in").to("mm"),
    spin: degToRad(45),
  },
};

const panelGeo = () => {
  return cuboid({
    size: [panel.width, panel.width, panel.thickness],
  });
};

const bodyGeo = () => {
  const shellGeo = ({ width, radius, thickness }: typeof shell) => {
    return subtract(
      roundedCuboid({
        size: [width, width, width],
        roundRadius: radius,
      }),
      cuboid({
        size: [width - thickness * 2, width - thickness * 2, width],
        center: [0, 0, thickness],
      })
    );
  };

  const speakerGeo = ({ diameter }: typeof speaker) => {
    const screwsGeo = ({
      count,
      diameter,
      offset,
      spin,
    }: typeof speaker.screws) => {
      const screwGeo = cylinder({
        radius: diameter / 2,
        height: shell.thickness,
        center: [
          0,
          speaker.diameter / 2 + offset,
          -(shell.width - shell.thickness) / 2,
        ],
      });

      return [...Array(count).keys()].map((i) =>
        rotate([0, 0, i * (TAU / count) + spin], screwGeo)
      );
    };

    return union(
      cylinder({
        radius: diameter / 2,
        height: shell.thickness,
        center: [0, 0, -(shell.width - shell.thickness) / 2],
      }),
      screwsGeo(speaker.screws)
    );
  };

  return subtract(shellGeo(shell), speakerGeo(speaker));
};

export const main = () => {
  switch (part) {
    case Part.Body:
      return bodyGeo();
    case Part.Panel:
      return panelGeo();
  }
};
