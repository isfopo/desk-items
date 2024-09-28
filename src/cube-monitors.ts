import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
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

const segments = 32 * Math.PI;

const shell = {
  width: convert(5 + 3 / 4, "in").to("mm"),
  thickness: convert(5 / 8, "in").to("mm"),
  radius: convert(1 / 4, "in").to("mm"),
};

const panel = {
  width: convert(5 + 1 / 8, "in").to("mm"),
  thickness: convert(1 / 8, "in").to("mm"),
  screws: {
    countPerSide: 2,
    diameter: {
      inner: convert(1 / 8, "in").to("mm") - 1,
      outer: convert(1 / 8, "in").to("mm"),
    },
    length: convert(1 / 2, "in").to("mm"),
    inset: convert(1, "in").to("mm"),
  },
  jack: {
    center: {
      x: -20,
      y: 0,
    },
    diameter: convert(1 / 2, "in").to("mm"),
  },
  volumePot: {
    center: {
      x: 20,
      y: 0,
    },
    diameter: convert(1 / 4, "in").to("mm"),
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

const panelScrewGeo = (type: "inner" | "outer") => {
  const screwGeo = (side: "port" | "starboard") => {
    return cylinder({
      height: panel.screws.length,
      radius: panel.screws.diameter[type] / 2,
      center: [
        (panel.width / 2 - panel.screws.inset) * (side === "port" ? 1 : -1),
        (panel.width - shell.thickness / 2) / 2,
        0,
      ],
    });
  };

  return [...[...Array(4).keys()]].map((i) =>
    rotate(
      [0, 0, (i * TAU) / 4],
      union(screwGeo("port"), screwGeo("starboard"))
    )
  );
};

const panelGeo = () => {
  const volumePotGeo = () => {
    return cylinder({
      height: panel.thickness,
      radius: panel.volumePot.diameter / 2,
      center: [panel.volumePot.center.x, panel.volumePot.center.y, 0],
    });
  };
  return subtract(
    cuboid({
      size: [panel.width, panel.width, panel.thickness],
    }),
    ...panelScrewGeo("outer"),
    volumePotGeo()
  );
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
        segments,
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
        segments,
      }),
      screwsGeo(speaker.screws)
    );
  };

  return subtract(
    shellGeo(shell),
    speakerGeo(speaker),
    translate(
      [0, 0, (shell.width - panel.thickness) / 2],
      cuboid({
        size: [panel.width, panel.width, panel.thickness],
      })
    ),
    translate(
      [0, 0, shell.width / 2 - panel.thickness],
      ...panelScrewGeo("inner")
    )
  );
};

const part = Part.Panel as Part;

export const main = () => {
  switch (part) {
    case Part.Body:
      return bodyGeo();
    case Part.Panel:
      return panelGeo();
  }
};
