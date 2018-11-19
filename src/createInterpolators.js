export default (catalog = {}) => {
  const process = (literal) => literal;

  return {
    __(literal) {
      return catalog[literal] || literal;
    }
  }
}
