import { warn, assert } from './utils';


const createCatalogChecker = (catalog) => fn => (...args) => {
  assert(catalog !== null, `Catalog not loaded yet when calling translator with arguments: ${args}`);

  assert(catalog !== undefined, `Not catalog defined when calling translator with arguments: ${args}`);

  return fn(...args);
};

const getterLiteral = catalog => literal => {
  if (catalog && catalog[literal]) {
    return catalog[literal];
  }
};

const getterLiteralPlural = catalog => (literal, count) => {
  if (catalog) {
    if (typeof catalog[literal] === 'object') {
      return count === 1 ? catalog[literal].one : catalog[literal].other;
    }
    return catalog[literal];
  }
};

const process = (literal, fallback) => {
  if (!literal) {
    warn(`Missing literal translation "${fallback}" in catalog, using it as fallback`);
    return fallback;
  }
  return postProcessLiteral(literal);
};

const postProcessLiteral = literal => {
  return typeof literal === 'object' ? literal.one : literal;
};

export default (catalog) => {
  const catalogChecker = createCatalogChecker(catalog);
  const getLiteral = getterLiteral(catalog);
  const getLiteralPlural = getterLiteralPlural(catalog);
  const translators = {
    __: (literal) => process(getLiteral(literal), literal),
    __n: (literal, count) => process(getLiteralPlural(literal, count), literal),
  };

  return Object.keys(translators).reduce((prev, trlsName) => ({
    ...prev,
    [trlsName]: catalogChecker(translators[trlsName]) }),
  {});
};
