import { Vector3 } from 'three';

export default {
  plane(width, height) {
    return (u, v) => {
      const x = (u - 0.5) * width;
      const y = (v + 0.5) * height;
      const z = 0;

      return new Vector3(x, y, z);
    };
  },
};
