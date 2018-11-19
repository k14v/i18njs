import i18njs from '..';

const i18n = i18njs({
  locales: ['en', 'de'],
  resolver: (locale) => ({
    'esto es una prueba': locale === 'en' ? 'this is a test' : 'Das ist ein Test'
  })
});

console.log(i18n.in.__('esto es una prueba'));

i18n.onReady(() => {
  console.log(i18n.in.__('esto es una prueba'));

  i18n.setLocale('en');

  console.log(i18n.in.__('esto es una prueba'));

  i18n.setLocale('de');

  console.log(i18n.in.__('esto es una prueba'));
});
