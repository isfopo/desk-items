import { Geom2, Geom3 } from "@jscad/modeling/src/geometries/types";

export const map = <T extends Geom2 | Geom3>(
  count: number,
  callback: (value: number, index: number, array: number[]) => T // Use T directly
): T[] => {
  return Array.from({ length: count }, (_, index) =>
    callback(index, index, Array.from({ length: count }))
  );
};
