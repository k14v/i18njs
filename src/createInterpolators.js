export default (catalog = {}) => {
  const process = (literal) => literal

  return {
    __: (literal) => {
      return process(catalog[literal] || literal)
    }
  }
}
