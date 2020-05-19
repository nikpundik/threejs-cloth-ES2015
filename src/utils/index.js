export default {
  plane(width, height) {
    return (u, v, target) => {
      const x = (u - 0.5) * width;
      const y = (v + 0.5) * height;
      const z = 0;
      target.set(x, y, z);
      return target;
    };
  },
};
