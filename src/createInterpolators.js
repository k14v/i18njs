const notYetImplemented = (catalog) => fn => (...args) => {
  if (!catalog) {
    console.warn('No tieneee catalogoooo');
  }
  return fn(...args);
};

export default (catalog) => {
  const process = (literal) => literal;

  return {
    __: notYetImplemented(catalog)(literal => {
      return process((catalog && catalog[literal]) || literal);
    })
  };
};
