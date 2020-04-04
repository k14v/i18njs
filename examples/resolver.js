import i18njs from '../src/i18n';


const locales = {
  es: {
    'esto es una prueba': 'esto es una prueba',
    'Teléfono': 'Teléfono',
    'Perro': 'Perro',
    'El %s le dije a mi mujer que nos casasemos': 'El %s le dije a mi mujer que nos casasemos',
    'Tengo %d gato': {
      'one': 'Tengo un gato',
      'other': 'Tengo algunos gatos',
    },
  },
  en: {
    'esto es una prueba': 'this is a test',
    'Teléfono': 'Phone',
    'Perro': 'Dog',
    'El %s le dije a mi mujer que nos casasemos': 'On %s I told my wife that we got married',
    'Tengo %d gato': {
      'one': 'I have a cat',
      'other': 'I have some cats',
    },
  },
  de: {
    'esto es una prueba': 'Das ist ein Test',
    'Teléfono': 'Telefon',
    'Perro': 'Hund',
    'El %s le dije a mi mujer que nos casasemos': 'Am %s habe ich meiner Frau erzählt, dass wir geheiratet haben',
    'Tengo %d gato': {
      'one': 'Ich habe eine katze',
      'other': 'Ich habe mehrere Katzen',
    },
  },
};

const i18n = i18njs({
  locales: ['es', 'en', 'de'],
  locale: 'es',
  resolver: (locale) => new Promise((resolve) => setTimeout(() => resolve(locales[locale]), 2000)),
});

i18n.on('loading', ({ locale }) => {
  console.log(`loading locale: ${locale}`);
});

i18n.on('loaded', ({ locale }) => {
  console.log(`loaded locale: ${locale}`);
});

const unsubscribe = i18n.subscribe(({ type, locale }) => {
  console.log(`Sub ${type} locale: ${locale}`);
});

console.log(unsubscribe);

console.log(i18n.translate('esto es una prueba'));
console.log(i18n.translate('Teléfono'));

setTimeout(() => {
  i18n.setLocale('en').then(({ translate }) => {
    console.log(translate('esto es una prueba'));
    console.log(translate('Teléfono'));
    console.log(translate('Tengo 1 gato'));
    console.log(translate('Tengo 5 gato'));
    console.log(translate('El 12/09/1987 le dije a mi mujer que nos casasemos'));
  });
});

// setTimeout(() => {
//   i18n.setLocale('de').then(translate => {
//     console.log(i18n.translate('esto es una prueba'));
//     console.log(i18n.translate('Teléfono'));
//   });
// }, 4000);
