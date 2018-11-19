import createStore from './createStore';
import createInterpolators from './createInterpolators';

export default (options = {}) => {
  options = { ...options };
  // options.locales has to be an array of string with the supported locales,
  // otherwise if object is provided only the keys will be used
  const locales = Array.isArray(options.locales) ? options.locales : Object.keys(options.locales || {});
  // if options.locales has own properties defined will extend the cache as sync catalog
  const cache = { ...options.locales };
  const fallbacks = options.fallbacks || {};
  const store = createStore(locales, options.resolver, cache);
  const defaultLocale = options.locale || (locales && locales[0]);
  let currentLocale = defaultLocale;

  const self = {
    // To preserve the interpolator functions we pass a null catalog
    // to force the checker raise a warning when the interpolators being called
    in: createInterpolators(null),
    onReady: store.then.bind(store),
    onFail: store.catch.bind(store),
    setLocale (locale) {
      let targetLocale = !cache[locale] && fallbacks[locale] ? fallbacks[locale] : locale;
      targetLocale = locales.includes(targetLocale) ? targetLocale : defaultLocale;
      self.in = createInterpolators(cache[currentLocale = targetLocale]);
      return self.getCatalog();
    },
    getLocales () {
      return Object.keys(locales);
    },
    get getLocale () {
      return currentLocale;
    },
    getCatalog (locale = currentLocale) {
      return cache[locale];
    },
    getCatalogs () {
      return locales;
    }
  };

  return self;
};
