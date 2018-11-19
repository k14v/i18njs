export const defaultResolver = (locale, locales, cache) => {
  console.warn(`Not resolver implemented for locale: ${locale}`);
  return Promise.resolve({});
};

export default (
  locales = [],
  resolver = defaultResolver,
  rootCache = {}) =>
  locales
    .map(locale =>
      (cache) =>
        Promise
          .resolve(resolver(locale, locales, cache))
          .then((catalog) =>
            Object.assign(cache, { [locale]: catalog })))
    .reduce((cacheChain, next) =>
      cacheChain
        .then(next),
    Promise.resolve(rootCache));
