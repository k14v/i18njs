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
  resolver: (locale) => locales[locale],
});

console.log(i18n.trls.__('esto es una prueba'));

i18n.onReady(() => {
  console.log(i18n.trls.__('esto es una prueba'));
  console.log(i18n.trls.__('Teléfono'));

  i18n.setLocale('en');

  console.log(i18n.trls.__('Teléfono'));

  i18n.setLocale('de');

  console.log(i18n.trls.__('Perro'));
});
