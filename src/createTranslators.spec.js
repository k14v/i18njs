import test from 'ava';
import createTranslators from './createTranslators';


const locales = {
  es: {
    'esto es una prueba': 'esto es una prueba',
    'Teléfono': 'Teléfono',
    'Perro': 'Perro',
    'Tengo %d gato': {
      'one': 'Tengo un gato',
      'other': 'Tengo algunos gatos',
    },
  },
  en: {
    'esto es una prueba': 'this is a test',
    'Teléfono': 'Phone',
    'Perro': 'Dog',
    'Tengo %d gato': {
      'one': 'I have a cat',
      'other': 'I have some cats',
    },
  },
  de: {
    'esto es una prueba': 'Das ist ein Test',
    'Teléfono': 'Telefon',
    'Perro': 'Hund',
    'Tengo %d gato': {
      'one': 'Ich habe eine katze',
      'other': 'Ich habe mehrere Katzen',
    },
  },
};

test('it should be a function', (t) => {
  t.is(typeof createTranslators, 'function');
});

test('it should return an object', (t) => {
  const trls = createTranslators(locales.en);
  t.is(typeof trls, 'object');
});

test('it should have __ function', (t) => {
  const trls = createTranslators(locales.en);
  t.is(typeof trls.__, 'function');
});

test('it should return translation', (t) => {
  const trls = createTranslators(locales.en);
  t.is(trls.__('Perro'), locales.en.Perro);
});

test('it should return literal as fallback', (t) => {
  const trls = createTranslators(locales.en);
  const literalNonExists = 'abcdeABCDEzzzz0198';
  t.is(trls.__(literalNonExists), literalNonExists);
});

test('it should return singular translation', (t) => {
  const trls = createTranslators(locales.en);
  t.is(trls.__('Tengo 1 gato'), locales.en['Tengo %d gato'].one);
});

test('it should return plural translation', (t) => {
  const trls = createTranslators(locales.en);
  t.is(trls.__('Tengo 5 gato'), locales.en['Tengo %d gato'].other);
});


test('it should return same literal as fallback when catalog is null', (t) => {
  const trls = createTranslators(null);
  t.is(trls.__('Tengo 5 gato'), 'Tengo 5 gato');
});
