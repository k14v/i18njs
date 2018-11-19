const createCatalogChecker = (catalog) => fn => (...args) => {
  if (!catalog && process.env.NODE_ENV !== 'production') {
    console.warn(`// WARNING: Not catalog defined yet when calling interpolator with arguments: ${args}`);
  }

  return fn(...args);
};

const getterLiteral = catalog => literal => {
  if (catalog && catalog[literal]) {
    return catalog[literal];
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`// WARNING: Missing literal translation "${literal}" in catalog, using it as fallback`);
  }

  return literal;
};

export default (catalog) => {
  const process = (literal) => literal;
  const catalogChecker = createCatalogChecker(catalog);
  const getLiteral = getterLiteral(catalog);
  const interpolators = {
    __: (literal) => process(getLiteral(literal))
  };

  return Object.keys(interpolators).reduce((prev, inName) => ({
    ...prev,
    [inName]: catalogChecker(interpolators[inName]) }),
  {});
};
