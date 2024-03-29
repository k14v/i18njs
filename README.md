# I18njs

<img align="left" width="100" height="100" src="docs/images/logo.svg" />

[i18njs](https://www.npmjs.com/package/@k14v/i18njs) it's made to intended simplify and normalize internationalization and make compatible with all kind of javascript environments.

----

## Motivation

In general, many logics that has an exposed API to end users should have the accessibility to handle literals that the user can understand in their language. Many libraries try to solve this by using static translation catalogs, but typically when the catalog is heavily loaded with data, the scalability is actually seen to be well below performance. To handle this with a dynamic way, the store has the capability to load fragments of catalogs using remotes sources of data using a sourcemap to track the needed snippets, this becomes a logic asynchronous with smaller pieces of load that also can handle changes without impacting performance.

Using this system the library includes a feedback system to manage the current state and decide if its logic needs to be frozen to wait until the process is finished. This library offers many ways to manage it (subscriptions, events or promises).

## Getting started

```shell
$ npm install --save @k14v/i18njs
```

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## i18n

[src/i18n.js:21-133][1]

Provides a instance of i18njs to handle multiple locales asynchronously

### Parameters

-   `options` **[options][2]** 

### Examples

```javascript
const i18n = i18njs({
 locale: 'es',
 locales: ['de', 'es', 'en'],
 resolver: (locale) => ({ foo: 'bar' }),
});
```

Returns **[object][3]** i18n instance

## options

[src/i18n.js:29-29][4]

Option struct.

Type: [object][3]

### Properties

-   `locale` **[string][5]?** predefined default locale, if setted it will execute setLocale internally to load the locale resource, keep it undefined to handle this behaviour outside the logic.
-   `locales` **([Array][6]&lt;[string][5]> | [object][3])?** Array of strings of available locales using the standard [ISO_639-1][7]
-   `resolver` **[function][8]** used to resolve asyncronous locale resources

## i18n.translate

[src/i18n.js:53-53][9]

Translation function

Type: [object][3]

## i18n.setLocale

[src/i18n.js:60-71][10]

Updates the current locale and refresh translate

### Parameters

-   `locale` **[string][5]** [description]

Returns **[promise][11]** 

## i18n.getLocales

[src/i18n.js:77-79][12]

Obtain and array of string in ISO_639 format with all loaded locales

Returns **[Array][6]** Array of string [ISO_639-1][7]

## i18n.getLocale

[src/i18n.js:85-87][13]

Obtain current locale ISO_639

Returns **[string][5]** [ISO_639-1][7]

## i18n.getCatalog

[src/i18n.js:93-95][14]

Get current catalog of literal translations from cache

Returns **[object][3]** 

## i18n.getCatalogs

[src/i18n.js:101-103][15]

Get all catalogs of literal translations

Returns **[object][3]** 

## i18n.subscribe

[src/i18n.js:124-124][16]

Subcribe to the changes of loading state flow

### Examples

```javascript
const unsubscribe = i18n.subscribe(({ type, locale }) => {
  switch(type) {
    case 'loading':
      // dispatch function to handle loading state
      break;
    case 'loaded':
      // dispatch function to handle loading state
      break;
    case 'error':
      // dispatch function to handle error state
      break;
  }
});
```

Returns **[object][3]** 

## i18njs.fetch

[src/i18n.js:150-150][17]

Fetch i18n instance with preloaded locale resource

### Examples

```javascript
i18njs
  .fetch({
    locale: 'es',
    resolver: () => Promise.resolve({ 'foo': 'bar' })
    ...options
   })
  .then((i18n) => {
    i18n.translate('foo') // bar
  });
```

[1]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L21-L133 "Source code on GitHub"

[2]: #options

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[4]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L22-L28 "Source code on GitHub"

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[7]: https://es.wikipedia.org/wiki/ISO_639-1

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[9]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L53-L53 "Source code on GitHub"

[10]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L60-L71 "Source code on GitHub"

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[12]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L77-L79 "Source code on GitHub"

[13]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L85-L87 "Source code on GitHub"

[14]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L93-L95 "Source code on GitHub"

[15]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L101-L103 "Source code on GitHub"

[16]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L124-L124 "Source code on GitHub"

[17]: https://github.com/k14v/i18njs/blob/cf257593b6df60ce958c4c8793809e06c52458bf/src/i18n.js#L150-L150 "Source code on GitHub"


# Using translators

```javascript
translate('esto es una prueba')
```


# Dynamic translations


```javascript
const i18n = i18njs({
  locales: {
    en: {
      'Group': 'Grupo',
      'The cow': 'La vaca',
      'the fence': 'la valla',
      'The rabbit': 'El conejo',
      'the table': 'la mesa',
      'Sometimes I drink %d beers': {
        one: 'A veces me bebo una cerveza',
        other: 'A veces me bebo muchas cervezas',
      },
      '%s jumped over %s, %d times': {
        one: '%s saltó por encima de %s, una vez',
        other: '%s saltó por encima de %s, %d veces'
      }
    }
  },
});


i18n.translate('Sometimes I drink 1 beers')
// A veces me bebo una cerveza
i18n.translate('Sometimes I drink 10 beers')
// A veces me bebo muchas cervezas
i18n.translate('The cow jumped over the fence, 10 times')
// La vaca saltó por encima de la valla, 10 veces
i18n.translate('The rabbit jumped over the table, 1 times')
// El conejo saltó por encima de la mesa, una vez
```


## Integrations

- react https://github.com/k14v/react-i18njs

## Peding changes

- Implement source map  
