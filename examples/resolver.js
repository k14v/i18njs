import i18njs from '..';

const locales = {
  es: {
    'esto es una prueba': 'esto es una prueba',
    'Teléfono': 'Teléfono',
    'Perro': 'Perro',
  },
  en: {
    'esto es una prueba': 'this is a test',
    'Teléfono': 'Phone',
    'Perro': 'Dog',
  },
  de: {
    'esto es una prueba': 'Das ist ein Test',
    'Teléfono': 'Telefon',
    'Perro': 'Hund',
  },
};

const i18n = i18njs({
  locales: ['es', 'en', 'de'],
  locale: 'es',
  resolver: (locale) => new Promise((resolve, reject) => setTimeout(() => resolve(locales[locale]), 2000)),
});

i18n.on('loading', ({ locale }) => {
  console.log(`loading locale: ${locale}`);
});

i18n.on('loaded', ({ locale }) => {
  console.log(`loaded locale: ${locale}`);
});

console.log(i18n.trls.__('esto es una prueba'));
console.log(i18n.trls.__('Teléfono'));

setTimeout(() => {
  i18n.setLocale('en').then(trls => {
    console.log(trls.__('esto es una prueba'));
    console.log(trls.__('Teléfono'));
  });
}, 2000);

setTimeout(() => {
  i18n.setLocale('de').then(trls => {
    console.log(i18n.trls.__('esto es una prueba'));
    console.log(i18n.trls.__('Teléfono'));
  });
}, 4000);
