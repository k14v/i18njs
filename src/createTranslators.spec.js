// Core
import createTranslators from './createTranslators';
// Test
import test from 'ava';
import sinon from 'sinon';
import util from 'util';


const locales = {
  es: {
    'esto es una prueba': 'esto es una prueba',
    'Teléfono': 'Teléfono',
    'Perro': 'Perro',
    'Por un beso de tu boca %d caricias te daría': 'Por un beso de tu boca %d caricias te daría',
    'El %s le dije a mi mujer que nos casasemos': 'El %s le dije a mi mujer que nos casasemos',
    'Tengo %d gato': {
      'one': 'Tengo un gato',
      'other': 'Tengo algunos gatos',
    },
    'Tengo %s manzana': {
      'one': 'Tengo una manzana',
      'other': 'Tengo varias manzana',
    },
  },
  en: {
    'esto es una prueba': 'this is a test',
    'Teléfono': 'Phone',
    'Perro': 'Dog',
    'Por un beso de tu boca %d caricias te daría': 'For a kiss from your mouth %d caresses would give you',
    'El %s le dije a mi mujer que nos casasemos': 'On %s I told my wife that we got married',
    'Tengo %d gato': {
      'one': 'I have a cat',
      'other': 'I have some cats',
    },
    'Tengo %s manzana': {
      'one': 'I have an apple',
      'other': 'I have some apples',
    },
  },
  de: {
    'esto es una prueba': 'Das ist ein Test',
    'Teléfono': 'Telefon',
    'Perro': 'Hund',
    'Por un beso de tu boca %d caricias te daría': 'Für einen Kuss aus dem Mund würden dir mehrere Liebkosungen geben',
    'El %s le dije a mi mujer que nos casasemos': 'Am %s habe ich meiner Frau erzählt, dass wir geheiratet haben',
    'Tengo %d gato': {
      'one': 'Ich habe eine katze',
      'other': 'Ich habe mehrere Katzen',
    },
    'Tengo %s manzana': {
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

test('it should return empty string and don\'t throw a warning when given a empty string to translate', (t) => {
  const trls = createTranslators(locales.en);
  const spy = sinon.spy(console, 'warn');
  t.is(trls.__(''), '');
  t.true(spy.callCount === 0);
  spy.restore();
});

test('it should not throw a warning when trying to translate a correct plural literal', (t) => {
  const trls = createTranslators(locales.en);
  const spy = sinon.spy(console, 'warn');
  trls.__('Tengo 3 gato');
  t.true(spy.callCount === 0);
  spy.restore();
});

test('it should translate using the dynamic parameter', (t) => {
  const trls = createTranslators(locales.en);
  const date = '27/07/1998';
  const literalKey = 'El %s le dije a mi mujer que nos casasemos';
  t.is(trls.__(util.format(literalKey, date)), util.format(locales.en[literalKey], date));
});

test('it should translate using the dynamic parameter counter', (t) => {
  const trls = createTranslators(locales.en);
  const counter = 2;
  const literalKey = 'Por un beso de tu boca %d caricias te daría';
  t.is(trls.__(util.format(literalKey, counter)), util.format(locales.en[literalKey], counter));
});

