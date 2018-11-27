export const warn = (msg) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`// WARNING: ${msg}`);
  }
};

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
