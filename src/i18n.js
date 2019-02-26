import { assert, createSubscriber } from './utils';
import createStore, { STORE_EVENTS } from './createStore';
import createTranslators from './createTranslators';

// Events ENUM
export const I18N_EVENTS = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

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
  // if options.locales has own properties defined it will be used to extend
  // the cache as sync catalog
  const fallbacks = options.fallbacks || {};
  const resolver = options.resolver;
  const store = createStore({ cache, resolver, locales });
  const defaultLocale = options.locale;
  let currentLocale = defaultLocale;

  assert(defaultLocale, 'No default locale configured in options');

  const self = {
    ...store,
    // To preserve the translator functions we pass a null catalog
    // to force the checker raise a warning when the translators being called
    /**
     * Translation singleton with all interpolation utilities
     * corresponding to the current locale
     * @type {Object}
     */
    trls: createTranslators(null),
    /**
     * Updates the current locale and refresh trls singleton
     * @param {[type]} locale [description]
     */
    setLocale (locale) {
      let targetLocale = !cache[locale] && fallbacks[locale] ? fallbacks[locale] : locale;
      targetLocale = currentLocale = locales.includes(targetLocale) ? targetLocale : defaultLocale;
      self.emit(I18N_EVENTS.LOADING, { locale });
      return store.resolve(targetLocale).then((catalog) => {
        const trls = self.trls = createTranslators(catalog);
        self.emit(I18N_EVENTS.LOADED, { locale, trls, catalog });
        return trls;
      });
    },
    /**
     * Obtain and array of string ISO_639 with all loaded locales
     * @return {Array} Array of string [ISO_639-1](https://es.wikipedia.org/wiki/ISO_639-1)
     */
    getLocales () {
      return Object.keys(locales);
    },
    /**
     * Obtain current locale ISO_639
     * @return {string} [ISO_639-1](https://es.wikipedia.org/wiki/ISO_639-1)
     */
    getLocale () {
      return currentLocale;
    },
    /**
     * Get current catalog of literal translations from cache
     * @return {Object}
     */
    getCatalog (locale = currentLocale) {
      return cache[locale];
    },
    /**
     * Get all catalogs of literal translations
     * @return {Object}
     */
    getCatalogs () {
      return cache;
    },
  };

  // If currentLocale is setted then force to remap trls with the selected locale
  if (currentLocale) {
    self.setLocale(currentLocale);
  }

  // Extends self factory appending a subscriber method with all posible events
  return Object.assign(self, {
    subscribe: createSubscriber(self, [...Object.values(I18N_EVENTS), ...Object.values(STORE_EVENTS)]),
  });
};
