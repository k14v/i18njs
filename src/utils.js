// Utils
import memoize from 'fast-memoize';


const warnStore = new Map();

export const warn = Object.assign(memoize((msg) => {
  // Ignore warning when production enviroment
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`// WARNING: ${msg}`);
  }
  // Must return non undefined value, if not memoize doesn't work
  return 1;
}, {
  // Implement own cache system in order to manage clear method
  cache: {
    create: () => ({
      has: key => warnStore.has(key),
      get: key => warnStore.get(key),
      set: (key, value) => {
        warnStore.set(key, value);
      },
    }),
  },
}), { clear: warnStore.clear.bind(warnStore) });

export const assert = (assertion, msg) => {
  if (!assertion) {
    warn(msg);
  }
};

export const createSubscriber = (em, events = []) => (eventName, listener) => {
  if (typeof eventName === 'function') {
    listener = eventName;
    // Subscribe all events
    return events
      .reduce((prev, type) => {
        const unsubscribe = em.subscribe(type, (evt) => listener({ ...evt, type }));
        // Recursive unsubscribe binding
        return () => {
          if (prev) {
            prev();
          }
          unsubscribe();
        };
      }, null);
  }
  // Single event subscribe
  em.on(eventName, listener);
  return () => {
    em.off(eventName, listener);
  };
};
