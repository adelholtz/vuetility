class VLib {
  get(value, path, defaultValue) {
    return String(path)
      .split(".")
      .reduce((acc, v) => {
        try {
          acc = acc[v];
          if (acc === undefined || acc === null) {
            return defaultValue;
          }
        } catch (e) {
          return defaultValue;
        }
        return acc;
      }, value);
  }

  isEmpty(obj) {
    return (
      [Object, Array].includes((obj || {}).constructor) &&
      !Object.entries(obj || {}).length
    );
  }
}

const vlib = new VLib();

export default vlib;
