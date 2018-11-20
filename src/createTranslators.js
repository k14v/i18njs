import { warn, assert } from './utils';

const createCatalogChecker = (catalog) => fn => (...args) => {
  assert(catalog !== null, `Catalog not loaded yet when calling interpolator with arguments: ${args}`);

  assert(catalog !== undefined, `Not catalog defined when calling interpolator with arguments: ${args}`);

  return fn(...args);
};

const getterLiteral = catalog => literal => {
  if (catalog && catalog[literal]) {
    return catalog[literal];
  }

  warn(`Missing literal translation "${literal}" in catalog, using it as fallback`);

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
