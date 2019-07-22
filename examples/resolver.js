import i18njs from '..';


const locales = {
  es: {
    'esto es una prueba': 'esto es una prueba',
    'Teléfono': 'Teléfono',
    'Perro': 'Perro',
    'Tengo %s gato': {
      'one': 'Tengo un gato',
      'other': 'Tengo algunos gatos',
    },
  },
  en: {
    'esto es una prueba': 'this is a test',
    'Teléfono': 'Phone',
    'Perro': 'Dog',
    'Tengo %s gato': {
      'one': 'I have a cat',
      'other': 'I have some cats',
    },
  },
  de: {
    'esto es una prueba': 'Das ist ein Test',
    'Teléfono': 'Telefon',
    'Perro': 'Hund',
    'Tengo %s gato': {
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

console.log(i18n.trls.__('esto es una prueba'));
console.log(i18n.trls.__('Teléfono'));

setTimeout(() => {
  i18n.setLocale('en').then(trls => {
    console.log(trls.__('esto es una prueba'));
    console.log(trls.__('Teléfono'));
    console.log(trls.__n('Tengo %s gato', 1));
    console.log(trls.__n('Tengo %s gato', 5));
  });
});

// setTimeout(() => {
//   i18n.setLocale('de').then(trls => {
//     console.log(i18n.trls.__('esto es una prueba'));
//     console.log(i18n.trls.__('Teléfono'));
//   });
// }, 4000);
