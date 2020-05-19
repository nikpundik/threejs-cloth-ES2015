export default {
  plane(width, height) {
    return (u, v, vector) => {
      vector.x = (u - 0.5) * width;
      vector.y = (v + 0.5) * height;
      vector.z = 0;
      return vector;
    };
  },
};
