import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { cylinder, sphere } from "@jscad/modeling/src/primitives";

const diffusor = {
  radius: 100,
  base: 30,
};

const h = Math.sqrt((diffusor.radius ^ 2) - (diffusor.base ^ 2));
console.log(h);
const segments = 20;

export const main = () => {
  // R^2 = r^2 − h^2
  console.log(h);

  return union(
    sphere({
      radius: diffusor.radius,
      center: [0, 0, diffusor.radius - h],
      segments,
    }),
    cylinder({
      height: h,
      radius: diffusor.base,
      center: [0, 0, -h / 2],
      segments,
    })
  );
};
