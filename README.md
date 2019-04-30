# I18njs

<img align="left" width="100" height="100" src="docs/images/logo.svg" />

[i18njs](https://www.npmjs.com/package/@k14v/i18njs) it's made to intended simplify and normalize internationalization and make compatible with all kind of javascript environments.

----

# Getting started
```shell
$ npm install --save @k14v/i18njs
```

# Setup
```javascript
const i18n = i18njs({
  locales: {
    es: {
      'esto es una prueba': 'Esto es una prueba',
      'Teléfono': 'Teléfono',
      'Perro': 'Perro',
    },
    en: {
      'esto es una prueba': 'This is a test',
      'Teléfono': 'Phone',
      'Perro': 'Dog',
    },
    de: {
      'esto es una prueba': 'Das ist ein Test',
      'Teléfono': 'Telefon',
      'Perro': 'Hund',
    },
  },
});

i18n.on('loading', ({ locale }) => {
  console.log(`loading locale: ${locale}`);
  // output: loading locale:
});

i18n.on('loaded', ({ locale }) => {
  console.log(`loaded locale: ${locale}`);
});

i18n.setLocale('en').then(trls => {
  console.log(trls.__('esto es una prueba'));
  // output: this is a test
  console.log(trls.__('Teléfono'));
  // output: Phone
});

i18n.setLocale('de').then(trls => {
  console.log(i18n.trls.__('esto es una prueba'));
  // output: Das ist ein Test
  console.log(i18n.trls.__('Teléfono'));
  // output: Telefon
});
```

# Handling events


# Using translators

```javascript
trls.__('esto es una prueba')
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



i18n.trls.__('Sometimes I drink 1 beers')
// A veces me bebo una cerveza
i18n.trls.__('Sometimes I drink 10 beers')
// A veces me bebo muchas cervezas
i18n.trls.__('The cow jumped over the fence, 10 times')
// La vaca saltó por encima de la valla, 10 veces
i18n.trls.__('The rabbit jumped over the table, 1 times')
// El conejo saltó por encima de la mesa, una vez
```
