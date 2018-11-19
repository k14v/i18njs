import createStore from './createStore';
import createInterpolators from './createInterpolators';

export default (options) => {
  options = { ...options };
  const locales = options.locales;
  const cache = {};
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
