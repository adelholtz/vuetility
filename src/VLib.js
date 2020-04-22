export default class VLib {
  get(value, path, defaultValue) {
    return String(path)
      .split(".")
      .reduce((acc, v) => {
        try {
          acc = acc[v];
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
