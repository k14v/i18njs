import createStore from './createStore'
import createInterpolators from './createInterpolators'

export default (options) => {
  options = { ...options }
  const locales = options.locales
  const cache = {}
  const store = createStore(locales, options.resolver, cache)
  let currentLocale = options.locale

  const self = {
    in: createInterpolators(cache[currentLocale]),
    onReady: store.then.bind(store),
    onFail: store.catch.bind(store),
    setLocale (locale) {
      self.in = createInterpolators(cache[currentLocale = locale])
      return self.getCatalog(locale)
    },
    getLocales () {
      return Object.keys(locales)
    },
    get getLocale () {
      return currentLocale
    },
    getCatalog (locale = currentLocale) {
      return cache[locale]
    },
    getCatalogs () {
      return locales
    }
  }

  return self
}
