import { assert } from './utils';
import createStore from './createStore';
import createTranslators from './createTranslators';

export default (options = {}) => {
  options = { ...options };
  // options.locales has to be an array of string with the supported locales,
  // otherwise if object is provided only the keys will be used
  let locales = options.locales;
  let cache = {};
  if (!Array.isArray(options.locales)) {
    locales = Object.keys(options.locales || {});
    cache = { ...options.locales };
  }
  // if options.locales has own properties defined will extend the cache as sync catalog
  const fallbacks = options.fallbacks || {};
  const store = createStore(locales, options.resolver, cache);
  const defaultLocale = options.locale;
  let currentLocale = defaultLocale;

  assert(defaultLocale, 'No default locale configured in options');

  const self = {
    // To preserve the translator functions we pass a null catalog
    // to force the checker raise a warning when the translators being called
    trls: createTranslators(null),
    onReady: store.then.bind(store),
    onFail: store.catch.bind(store),
    setLocale (locale) {
      let targetLocale = !cache[locale] && fallbacks[locale] ? fallbacks[locale] : locale;
      targetLocale = locales.includes(targetLocale) ? targetLocale : defaultLocale;
      self.trls = createTranslators(cache[currentLocale = targetLocale]);
      return self.getCatalog();
    },
    getLocales () {
      return Object.keys(locales);
    },
    getLocale () {
      return currentLocale;
    },
    getCatalog (locale = currentLocale) {
      return cache[locale];
    },
    getCatalogs () {
      return locales;
    },
  };

  return self;
};
