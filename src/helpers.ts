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
  callback: (index: number, array: number[]) => T // Use T directly
): T[] => {
  return Array.from({ length: count }, (_, index) =>
    callback(index, Array.from({ length: count }))
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

class CartesianCoord {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toPolarCoord(origin: [number, number] = [0, 0]): PolarCoord {
    const adjustedX = this.x - origin[0];
    const adjustedY = this.y - origin[1];

    return new PolarCoord(
      Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY),
      Math.atan2(adjustedY, adjustedX),
      origin
    );
  }

  toPoint(): [number, number] {
    return [this.x, this.y];
  }
}

class PolarCoord {
  r: number;
  theta: number;
  origin: [number, number];

  // r = r of circle
  // theta = angle in radians, measured from positive X axis
  // thetaDegrees = angle in degrees
  constructor(r: number, theta: number, origin: [number, number] = [0, 0]) {
    this.r = r;
    this.theta = theta;
    this.origin = origin;
  }

  set thetaDegrees(value) {
    this.theta = (value * 2 * Math.PI) / 360;
  }

  get thetaDegrees() {
    return (this.theta * 360) / (Math.PI * 2);
  }

  toCartesianCoord() {
    return new CartesianCoord(
      this.r * Math.cos(this.theta),
      this.r * Math.sin(this.theta)
    );
  }

  rotate(angle: number) {
    this.theta += angle;
    return this;
  }

  toPoint(): [number, number] {
    return [this.r, this.theta];
  }
}

export const rotatePoint = (
  point: [number, number],
  { angle, origin }: { angle: number; origin: [number, number] } = {
    angle: 0,
    origin: [0, 0],
  }
): [number, number] =>
  new CartesianCoord(...point)
    .toPolarCoord(origin)
    .rotate(angle)
    .toCartesianCoord()
    .toPoint();

export const rotatePoints = (
  points: [number, number][],
  { angle, origin }: { angle: number; origin: [number, number] } = {
    angle: 0,
    origin: [0, 0],
  }
): [number, number][] => points.map((p) => rotatePoint(p, { angle, origin }));
