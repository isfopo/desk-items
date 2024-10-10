import { Geom2, Geom3 } from "@jscad/modeling/src/geometries/types";

export const map = <T extends Geom2 | Geom3>(
  count: number,
  callback: (value: number, index: number, array: number[]) => T
): Array<T> => {
  return [...Array(count).keys()].map(callback) as Array<T>;
};
