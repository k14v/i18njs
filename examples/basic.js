import i18njs from '../src/i18n';


const i18n = i18njs({
  locales: {
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
  },
});

i18n.on('loading', ({ locale }) => {
  console.log(`loading locale: ${locale}`);
});

i18n.on('loaded', ({ locale }) => {
  console.log(`loaded locale: ${locale}`);
});

console.log(i18n.translate('esto es una prueba'));
console.log(i18n.translate('Teléfono'));

i18n.setLocale('en').then(({ translate }) => {
  console.log(translate('esto es una prueba'));
  console.log(translate('Teléfono'));
});

i18n.setLocale('de').then(({ translate }) => {
  console.log(translate('esto es una prueba'));
  console.log(translate('Teléfono'));
});
