* Start Date: 2018-11-23
* RFC PR: https://github.com/k14v/i18njs/pull/2
* i18n Issue: https://github.com/k14v/i18njs/pull/1

# Summary

Async state control when resolve locales.

# Basic example

```js
import i18njs from 'i18njs'

const i18n = i18njs({
  resolve: (locale) => new Promise(resolve => setTimeout(() => resolve({
    'this is a test': 'Das ist ein Test',
    'Phone': 'Telefon',
    'Dog': 'Hund',
  })))
})

i18n
.on('loading', (locale) => {
  // dispatch function to handle loading state
})
.on('loaded', (locale) => {
  // dispatch function to handle loaded state
});

const unsubscribe = i18n.subscribe(({type, locale}) => {
  switch(type){
    case 'loading':
    // dispatch function to handle loading state
    case 'loaded':
    // dispatch function to handle loading state
    case 'error':
    // dispatch function to handle error state
  }
});
```

# Motivation

Typically, when an application wants to handle the load of locales when the logic is asynchronous,
the application needs a feedback to the handle the current status and decide if your program needs
be frozen order to wait until the process finished. One posible solution would be use `resolver` option when the locales is loading and use a the `then` method of a `promise` to raise the loaded state. But this way has some restrictions and limitations.

## Why not use the `resolver` options

```js
import i18njs from 'i18njs'

const i18n = i18njs({
  resolve: (locale) => {
      // dispatch function to handle loading state
      return asyncResolver(locale)
          .then((catalog) => {
              // dispatch function to handle loaded state
              return catalog
          })
  }
})
```

This solve one casuistic, but this logic might be controlled in different points it wouldn't
be possible because the `handler` logic would be placed in other file.

The solution to solve this casuistic starts from use events `loading`, `loaded` and `error` it can be used to handle the state flow.

Another requirement would be use a subscribe function as observable to handle the unsubscribe automatically and avoid the use of `on` and `off` in order to handle this behaviour in one step.
