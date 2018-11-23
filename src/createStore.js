import EventEmitter from 'events';
import { assert } from './utils';

export const ERR_MSGS = {
  LOCALE_UNDEFINED: 'Undefined locale',
  LOCALE_NOT_FOUND: 'Locale not found',
};

export const defaultResolver = (locale, locales, cache) => {
  assert(cache[locale], `No locale implemented for: ${locale}`);
  return Promise.resolve(cache[locale]);
};

export default (
  locales = [],
  resolver = defaultResolver,
  rootCache = {}) => {
  const store = {
    ...EventEmitter.prototype,
    off: (eventName, listener) =>
      listener != null
        ? store.removeListener(eventName, listener)
        : store.removeAllListeners(eventName),
    resolve: (locale) => {
      store.emit('loading', { locale, locales, cache: rootCache });
      return (!locale
        ? Promise
          .reject(new Error(ERR_MSGS.LOCALE_UNDEFINED))
        : Promise
          .resolve(resolver(locale, locales, rootCache))
      ).then((catalog) => {
        if (catalog) {
          store.emit('loaded', { locale, locales, cache: rootCache, catalog });
          Object.assign(rootCache, { [locale]: catalog });
          return catalog;
        } else {
          return Promise.reject(new Error(ERR_MSGS.LOCALE_NOT_FOUND));
        }
      }, (err) => {
        store.emit('error', err);
      });
    },
  };

  EventEmitter.call(store);

  return store;
};
