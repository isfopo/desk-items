import { Geom2, Geom3, Path2 } from "@jscad/modeling/src/geometries/types";
import { angle } from "@jscad/modeling/src/maths/vec2";
import {
  expand,
  ExpandOptions,
  offset,
  OffsetOptions,
} from "@jscad/modeling/src/operations/expansions";

export const map = <T extends Geom2 | Geom3>(
  count: number,
  callback: (value: number, index: number, array: number[]) => T // Use T directly
): T[] => {
  return Array.from({ length: count }, (_, index) =>
    callback(index, index, Array.from({ length: count }))
  );
};

export const pointOnCircle = (
  radius: number,
  angle: number,
  { flipX, flipY }: { flipX?: boolean; flipY?: boolean } = {
    flipX: false,
    flipY: false,
  }
): [number, number] => [
  radius * Math.sin(angle) * (flipX ? -1 : 1),
  radius * Math.cos(angle) * (flipY ? -1 : 1),
];

export const outline = (
  options: OffsetOptions & ExpandOptions,
  geometry: Path2
) =>
  expand(
    options,
    offset(
      { ...options, delta: options.delta ? options.delta / 2 : 1 },
      geometry
    )
  );
