import tokenize from '@k14v/printf-tokenize';
import rexpmat from '@k14v/rexpmat';
import printf from 'printf';
import { warn, assert } from './utils';


const createCatalogChecker = (catalog) => fn => (...args) => {
  assert(catalog !== null, `Catalog not loaded yet when calling translator with arguments: ${args}`);

  assert(catalog !== undefined, `Not catalog defined when calling translator with arguments: ${args}`);

  return fn(...args);
};

export default (catalog) => {
  // Reset warning store to show assertion messages of this catalog
  warn.clear();
  const catalogChecker = createCatalogChecker(catalog);

  const regexpMap = Object
    .entries(catalog || {})
    .filter(literal => /%./.test(literal[0]))
    .map((literal) => [rexpmat(literal[0]), literal[0]]);

  const matchPattern = (str, regexpMap) => {
    return regexpMap.find(pattern => new RegExp(pattern[0]).test(str));
  };

  const processLiteral = (literal) => {
    if (!catalog) {
      return literal;
    }

    if (typeof catalog[literal] === 'string') {
      return catalog[literal];
    }

    const match = matchPattern(literal, regexpMap);
    if (!match) {
      return literal;
    };
    const regexp = match[0];
    const literalScheme = catalog[match[1]];
    // TODO rexpmat must return a string not a regexp because
    // exec and test consume the regexp when it been called for the first time
    const params = (new RegExp(regexp).exec(literal) || []).slice(1);

    const paramTokens = tokenize(match[1]).filter(token => token.type === 'Parameter');

    const parsedParams = paramTokens.map((token, idx) => {
      switch (token.kind) {
        case 'Number':
          return parseInt(params[idx]);
        case 'String':
          return processLiteral(params[idx]);
      }
      return params[idx];
    });

    if (typeof literalScheme === 'object') {
      const countIndexParam = paramTokens.findIndex(token => token.kind === 'Number');
      if (countIndexParam !== -1) {
        const countParamValue = parsedParams[countIndexParam];
        if (countParamValue === 1 && literalScheme.one) {
          return printf(literalScheme.one, ...parsedParams);
        }

        if (countParamValue > 1 && literalScheme.other) {
          return printf(literalScheme.other, ...parsedParams);
        }
      } else {
        console.warn('Number not found to handle plural');
      };
    }

    if (!match[1]) {
      warn(`Missing literal translation "${match[1]}" in catalog, using it as fallback`);
      return literal;
    }

    return printf(match[1], ...parsedParams);
  };

  const translators = {
    __: processLiteral,
  };

  return Object.keys(translators).reduce((prev, trlsName) => ({
    ...prev,
    [trlsName]: catalogChecker(translators[trlsName]) }),
  {});
};

