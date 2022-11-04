export const paramToInt = (param: string | undefined): number | null => {
  if (param === undefined) return null;
  if (!param.match(/^\d+$/)) return null;

  return parseInt(param);
};

export const isObject = (value: unknown) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return true;
  }
  return false;
};
