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
