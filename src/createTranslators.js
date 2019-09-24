// Utils
import tokenize from '@k14v/printf-tokenize';
import rexpmat from '@k14v/rexpmat';
import printf from 'printf';
import { warn, assert } from './utils';


const parseLiteralScheme = (scheme, opts) =>  ({
  indexPlural: 0,
  ...(typeof scheme === 'string' ? {
    one: scheme,
    other: scheme,
  } : scheme),
  ...opts,
});

const getParsedValues = (tokens) => tokens.map(({parsedValue}) => parsedValue);

const createCatalogChecker = (catalog) => fn => (...args) => {
  assert(catalog !== null, `Catalog not loaded yet when calling translator with arguments: ${args}`);

  assert(catalog !== undefined, `Not catalog defined when calling translator with arguments: ${args}`);

  return fn(...args);
};

const createTranslators = (catalog) => {
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

  const processLiteral = (literal, opts = {}) => {
    if (!catalog || literal === '') {
      return literal;
    }

    if (typeof catalog[literal] === 'string') {
      return catalog[literal];
    }

    const match = matchPattern(literal, regexpMap);

    if (!match) {
      return literal;
    }
    const regexp = match[0];
    const literalScheme = parseLiteralScheme(catalog[match[1]], opts);

    // TODO rexpmat must return a string not a regexp because
    // exec and test consume the regexp when it been called for the first time
    const params = (new RegExp(regexp).exec(literal) || []).slice(1);

    let paramTokensDigitLength = 0;

    const paramTokens = tokenize(match[1]).filter(token => token.type === 'Parameter')
      .map((token, idx) => {
        let parsedValue = params[idx];
        switch (token.kind) {
          case 'Number':
            paramTokensDigitLength ++;
            parsedValue = parseInt(params[idx]);
            break;
          case 'String':
            parsedValue = processLiteral(params[idx]);
            break;
        }
        return {
          ...token,
          parsedValue,
        };
      });

    const { indexPlural, one, other } = literalScheme;

    if (params.length) {
      const paramTokenPlural = paramTokens
          .filter(token => token.kind === 'Number')[(
            // Sum length to indexPlural to handle negative values
            paramTokensDigitLength + indexPlural
          ) % paramTokensDigitLength];
      if (paramTokenPlural) {
        return printf(
          paramTokenPlural.parsedValue === 1
          ? one : other,
          ...getParsedValues(paramTokens)
        );
      }
    }

    if (!match[1]) {
      warn(`Missing literal translation "${match[1]}" in catalog, using it as fallback`);
      return literal;
    }

    return printf(one, ...getParsedValues(paramTokens));
  };

  const translators = {
    __: processLiteral,
  };

  return Object.keys(translators).reduce((prev, trlsName) => ({
    ...prev,
    [trlsName]: catalogChecker(translators[trlsName]) }),
  {});
};

export default createTranslators;
