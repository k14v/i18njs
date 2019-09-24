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

console.log(i18n.trls.__('esto es una prueba'));
console.log(i18n.trls.__('Teléfono'));

i18n.setLocale('en').then(trls => {
  console.log(trls.__('esto es una prueba'));
  console.log(trls.__('Teléfono'));
});

i18n.setLocale('de').then(trls => {
  console.log(trls.__('esto es una prueba'));
  console.log(trls.__('Teléfono'));
});
