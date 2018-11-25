import test from 'ava';
import createTranslators from './createTranslators';


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

test('should be a function', (t) => {
  t.true(typeof createTranslators === 'function');
});

test('should return an object', (t) => {
  const trls = createTranslators(locales.en);
  t.true(typeof trls === 'object');
});

test('trls should have __ function', (t) => {
  const trls = createTranslators(locales.en);
  t.true(typeof trls.__ === 'function');
});

test('__ function should return translation', (t) => {
  const trls = createTranslators(locales.en);
  t.true(trls.__('Perro') === locales.en.Perro);
});

test('__ function should return literal as fallback', (t) => {
  const trls = createTranslators(locales.en);
  const literalNonExists = 'abcdeABCDEzzzz0198';
  t.true(trls.__(literalNonExists) === literalNonExists);
});

test('__ function should return singular translation when encountered object as translation', (t) => {
  const trls = createTranslators(locales.en);
  t.true(trls.__('Tengo %s gato') === locales.en['Tengo %s gato'].one);
});

test('trls should have __n function', (t) => {
  const trls = createTranslators(locales.en);
  t.true(typeof trls.__n === 'function');
});

test('__n function should return singular translation', (t) => {
  const trls = createTranslators(locales.en);
  t.true(trls.__n('Tengo %s gato', 1) === 'I have a cat');
});

test('__n function should return plural translation', (t) => {
  const trls = createTranslators(locales.en);
  t.true(trls.__n('Tengo %s gato', 5) === 'I have some cats');
});
