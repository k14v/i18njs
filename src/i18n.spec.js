// Core
import i18njs, { fetch } from './i18n';
// Test
import test from 'ava';

test('should be a function', (t) => {
  t.is(typeof i18njs, 'function');
});

test.cb('should call setLocale internally when locale is selected', (t) => {
  t.plan(1);
  i18njs({
    locale: 'en',
    resolver: (locale) => {
      t.is(locale, 'en');
      t.end();
      return {};
    },
  });
});

test.cb('should change trls before event loaded is raised', (t) => {
  t.plan(2);
  const locales = {
    en: { foo: 'bar' },
    es: { foo: 'bur' },
  };
  const i18n = i18njs({
    locales,
  });

  i18n.on('loaded', ({ locale }) => {
    t.is(i18n.translate('foo'), locales[locale]['foo']);
    if (locale === 'en') t.end();
  });

  i18n.setLocale('es');
  i18n.setLocale('en');
});

test('should return a promise resolved with the locale loaded', async (t) => {
  const i18n = await fetch({
    locale: 'es',
    resolver: () => Promise.resolve({ foo: 'bar' }),
  });

  t.is(i18n.translate('foo'), 'bar');
});
