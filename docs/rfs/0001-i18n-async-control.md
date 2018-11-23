* Start Date: 2018-11-23
* RFC PR: https://github.com/rubeniskov/i18njs/pull/2
* i18n Issue: https://github.com/rubeniskov/i18njs/pull/1

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

const unsubscribeLoading = i18n.on('loading', (locale) => {
  // dispatch function to handle loading state
});

const unsubscribeLoaded = i18n.on('loaded', (locale) => {
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
the application needs a feedback to the handle the current status of that logic and decide if user interactions
should be frozen in order to wait until the process finished.

## Why not use the `resolver` options

One posible solution would be put the control state logic inside resolver function.

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
be posible because the declaration would be placed in other file.

With events you can ***subscribe*** or ***unsubscribe*** in

Another requirement would be use a subscribe function as obserbable to handle the unsubscribe automatically and avoid the use of `on` and `off` in order to handle this behaviour in one step.
