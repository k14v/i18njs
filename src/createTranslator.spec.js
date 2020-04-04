// Core
import createTranslator from './createTranslator';
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
    'El %d%% de los moviles son moviles inteligentes': 'El %d%% de los moviles son moviles inteligentes',
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
    'El %d%% de los moviles son moviles inteligentes': '%d%% der Handys sind Smartphones',
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
    'El %d%% de los moviles son moviles inteligentes': '%d%% der Handys sind Smartphones',
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
  t.is(typeof createTranslator, 'function');
});

test('it should have __ function', (t) => {
  const translate = createTranslator(locales.en);
  t.is(typeof translate, 'function');
});

test('it should return translation', (t) => {
  const translate = createTranslator(locales.en);
  t.is(translate('Perro'), locales.en.Perro);
});

test('it should return literal as fallback', (t) => {
  const translate = createTranslator(locales.en);
  const literalNonExists = 'abcdeABCDEzzzz0198';
  t.is(translate(literalNonExists), literalNonExists);
});

test('it should return singular translation', (t) => {
  const trls = createTranslator(locales.en);
  t.is(trls('Tengo 1 gato'), locales.en['Tengo %d gato'].one);
});

test('it should return plural translation', (t) => {
  const trls = createTranslator(locales.en);
  t.is(trls('Tengo 5 gato'), locales.en['Tengo %d gato'].other);
});

test('it should return same literal as fallback when catalog is null', (t) => {
  const trls = createTranslator(null);
  t.is(trls('Tengo 5 gato'), 'Tengo 5 gato');
});

test('it should return empty string and don\'t throw a warning when given a empty string to translate', (t) => {
  const trls = createTranslator(locales.en);
  const spy = sinon.spy(console, 'warn');
  t.is(trls(''), '');
  t.true(spy.callCount === 0);
  spy.restore();
});

test('it should not throw a warning when trying to translate a correct plural literal', (t) => {
  const trls = createTranslator(locales.en);
  const spy = sinon.spy(console, 'warn');
  trls('Tengo 3 gato');
  t.true(spy.callCount === 0);
  spy.restore();
});

test('it should translate using the dynamic parameter', (t) => {
  const trls = createTranslator(locales.en);
  const date = '27/07/1998';
  const literalKey = 'El %s le dije a mi mujer que nos casasemos';
  t.is(trls(util.format(literalKey, date)), util.format(locales.en[literalKey], date));
});

test('it should translate using the dynamic parameter counter', (t) => {
  const trls = createTranslator(locales.en);
  const counter = 2;
  const literalKey = 'Por un beso de tu boca %d caricias te daría';
  t.is(trls(util.format(literalKey, counter)), util.format(locales.en[literalKey], counter));
});

test('it should translate using the dynamic and escaping the percent', (t) => {
  const trls = createTranslator(locales.de);
  const percent = 95;
  const literalKey = 'El %d%% de los moviles son moviles inteligentes';
  t.is(trls(util.format(literalKey, percent)), util.format(locales.de[literalKey], percent));
});

test('it should increase at least 10 times the perfomance when try to translate the same literal in large catalog', (t) => {
  const catalog = [
    ...new Array(5000).fill().map(() => 'foo %s bar %d ' + (~~(Math.random() * 0xFFFFFF)).toString(16))]
  .reduce((prev, value) => ({[value]: value, ...prev}), {
    'test %s': 'tust %s',
  });

  const trls = createTranslator(catalog);
  const start = new Date().getTime();
  t.is(trls('test foo'), 'tust foo');
  const mid = new Date().getTime();
  t.is(trls('test bar'), 'tust bar');
  const end = new Date().getTime();
  t.true((end - mid) / (mid - start) < 0.1);
});

