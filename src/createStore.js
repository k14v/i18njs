export const defaultResolver = (locale, locales, cache) => {
  if (!cache[locale] && process.env.NODE_ENV !== 'production') {
    console.warn(`// WARNING: No resolver implemented for locale: ${locale}`);
  }

  return Promise.resolve(cache[locale] || {});
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
