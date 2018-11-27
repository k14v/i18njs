// Core
import EventEmitter from 'events';
import { assert, createSubscriber } from './utils';

// Errors ENUM
export const ERR_MSGS = {
  LOCALE_UNDEFINED: 'Undefined locale',
  LOCALE_NOT_FOUND: 'Locale not found',
};

// Events ENUM
export const STORE_EVENTS = {
  RESOLVING: 'resolving',
  RESOLVED: 'resolved',
  ERROR: 'error',
};

export const defaultResolver = (locale, cache, options) => {
  assert(cache[locale], `No locale implemented for: ${locale}`);
  return Promise.resolve(cache[locale]);
};

export default ({ cache = {}, resolver = defaultResolver, ...restOptions } = {}) => {
  const store = {
    ...EventEmitter.prototype,
    off: (eventName, listener) =>
      typeof eventName === 'function'
        ? store.removeAllListeners(eventName)
        : store.removeListener(eventName, listener),
    resolve: (locale) => {
      store.emit(STORE_EVENTS.RESOLVING, { locale, cache });
      return (!locale
        ? Promise
          .reject(new Error(ERR_MSGS.LOCALE_UNDEFINED))
        : Promise
          .resolve(resolver(locale, cache, restOptions))
      )
        .then((catalog) => {
          if (catalog) {
            Object.assign(cache, { [locale]: catalog });
            store.emit(STORE_EVENTS.RESOLVED, { locale, cache, catalog });
            return catalog;
          } else {
            return Promise.reject(new Error(ERR_MSGS.LOCALE_NOT_FOUND));
          }
        })
        .catch(err => {
          store.emit(STORE_EVENTS.ERROR, err);
          return Promise.reject(err);
        });
    },
  };

  EventEmitter.call(store);

  return Object.assign(store, {
    subscribe: createSubscriber(store, Object.values(STORE_EVENTS)),
  });
};
