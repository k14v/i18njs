import test from 'ava';
import i18njs from './i18n';


test('should be a function', (t) => {
  t.is(typeof i18njs, 'function');
});

test('should call setLocale internally when locale is selected', (t) => {
  t.plan(1);
  i18njs({
    locale: 'en',
    resolver: (locale) => {
      t.is(locale, 'en');
      return {};
    },
  });
});
