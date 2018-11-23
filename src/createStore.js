// Core
import EventEmitter from 'events';
import { assert } from './utils';

// Errors ENUM
export const ERR_MSGS = {
  LOCALE_UNDEFINED: 'Undefined locale',
  LOCALE_NOT_FOUND: 'Locale not found',
};

// Events ENUM
export const STORE_EVENTS = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
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
      typeof eventName === 'function'
        ? store.removeAllListeners(eventName)
        : store.removeListener(eventName, listener),
    subscribe: (eventName, listener) => {
      if (typeof eventName === 'function') {
        listener = eventName;
        // Subscribe all events
        return Object
          .values(STORE_EVENTS)
          .reduce((prev, type) => {
            const unsubscribe = store.subscribe(type, (evt) => listener({ ...evt, type }));
            // Recursive unsubscribe binding
            return () => prev(unsubscribe);
          }, off => off());
      }
      // Single event subscribe
      store.on(eventName, listener);
      return () => {
        store.off(eventName, listener);
      };
    },
    resolve: (locale) => {
      store.emit(STORE_EVENTS.LOADING, { locale, locales, cache: rootCache });
      return (!locale
        ? Promise
          .reject(new Error(ERR_MSGS.LOCALE_UNDEFINED))
        : Promise
          .resolve(resolver(locale, locales, rootCache))
      ).then((catalog) => {
        if (catalog) {
          store.emit(STORE_EVENTS.LOADED, { locale, locales, cache: rootCache, catalog });
          Object.assign(rootCache, { [locale]: catalog });
          return catalog;
        } else {
          return Promise.reject(new Error(ERR_MSGS.LOCALE_NOT_FOUND));
        }
      }, (err) => {
        store.emit(STORE_EVENTS.ERROR, err);
      });
    },
  };

  EventEmitter.call(store);

  return store;
};
