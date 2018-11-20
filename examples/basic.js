import i18njs from '..';

const i18n = i18njs({
  locales: {
    en: {
      'esto es una prueba': 'this is a test'
    },
    de: {
      'esto es una prueba': 'Das ist ein Test'
    }
  }
});

console.log(i18n.trls.__('esto es una prueba'));

i18n.onReady(() => {
  console.log(i18n.trls.__('esto es una prueba'));

  i18n.setLocale('en');

  console.log(i18n.trls.__('esto es una prueba'));

  i18n.setLocale('de');

  console.log(i18n.trls.__('esto es una prueba'));
});
