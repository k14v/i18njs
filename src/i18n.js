// Core
import createStore from './createStore';
import createTranslators from './createTranslators';
// Utils
import { createSubscriber } from './utils';
// Constants
import { I18N_EVENTS, STORE_EVENTS } from './constants';

/**
 * Provides a instance of i18njs to handle multiple locales asynchronously
 * @function i18n
 * @param {options} options
 * @returns {object} i18n instance
 * @example
 * const i18n = i18njs({
 *  locale: 'es',
 *  locales: ['de', 'es', 'en'],
 *  resolver: (locale) => ({ foo: 'bar' }),
 * });
 */
const i18n = (options = {}) => {
  /**
   * Option struct.
   * @typedef {object} options
   * @property {?string} locale predefined default locale, if setted it will execute setLocale internally to load the locale resource, keep it undefined to handle this behaviour outside the logic.
   * @property {?(string[]|object)} locales Array of strings of available locales using the standard [ISO_639-1](https://es.wikipedia.org/wiki/ISO_639-1)
   * @property {function} resolver used to resolve asyncronous locale resources
   */
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
  const store = createStore({ ...options, cache, locales });
  const defaultLocale = options.locale;
  let currentLocale = defaultLocale;

  const self = Object.assign(store, {
    // To preserve the translator functions we pass a null catalog
    // to force the checker raise a warning when the translators being called
    /**
     * Translation singleton with all interpolation utilities
     * corresponding to the current locale
     * @alias i18n.trls
     * @type {object}
     */
    trls: createTranslators(null),
    /**
     * Updates the current locale and refresh trls singleton
     * @method i18n.setLocale
     * @param {string} locale [description]
     * @return {promise}
     */
    setLocale (locale) {
      let targetLocale = !cache[locale] && fallbacks[locale] ? fallbacks[locale] : locale;
      targetLocale = currentLocale = (locales.includes(targetLocale) ? targetLocale : defaultLocale) || locale;
      store.emit(I18N_EVENTS.LOADING, { locale });
      return store
        .resolve(targetLocale)
        .then((catalog) => {
          const trls = self.trls = createTranslators(catalog);
          store.emit(I18N_EVENTS.LOADED, { locale, trls, catalog });
          return self;
        });
    },
    /**
     * Obtain and array of string in ISO_639 format with all loaded locales
     * @method i18n.getLocales
     * @return {Array} Array of string [ISO_639-1](https://es.wikipedia.org/wiki/ISO_639-1)
     */
    getLocales () {
      return Object.keys(locales);
    },
    /**
     * Obtain current locale ISO_639
     * @method i18n.getLocale
     * @return {string} [ISO_639-1](https://es.wikipedia.org/wiki/ISO_639-1)
     */
    getLocale () {
      return currentLocale;
    },
    /**
     * Get current catalog of literal translations from cache
     * @method i18n.getCatalog
     * @return {object}
     */
    getCatalog (locale = currentLocale) {
      return cache[locale];
    },
    /**
     * Get all catalogs of literal translations
     * @method i18n.getCatalogs
     * @return {object}
     */
    getCatalogs () {
      return cache;
    },
    /**
     * Subcribe to the changes of loading state flow
     * @method i18n.subscribe
     * @return {Object}
     * @example
     * const unsubscribe = i18n.subscribe(({ type, locale }) => {
     *   switch(type) {
     *     case 'loading':
     *       // dispatch function to handle loading state
     *       break;
     *     case 'loaded':
     *       // dispatch function to handle loading state
     *       break;
     *     case 'error':
     *       // dispatch function to handle error state
     *       break;
     *   }
     * });
     */
    // Create a subscriber method with all posible event
    subscribe: createSubscriber(store, [...Object.values(I18N_EVENTS), ...Object.values(STORE_EVENTS)]),
  });

  // If currentLocale is setted then force to remap trls with the selected locale
  if (currentLocale) {
    self.setLocale(currentLocale);
  }

  return self;
};

export default i18n;
