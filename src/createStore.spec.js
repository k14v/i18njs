import test from 'ava';
import createStore, { ERR_MSGS, STORE_EVENTS } from './createStore';


test('should return a store', (t) => {
  const store = createStore();
  t.truthy(store);
});

test('should return a instance of EventEmitter', (t) => {
  const store = createStore();
  t.is(typeof store.on, 'function');
  t.is(typeof store.off, 'function');
});

test('should return a instance with a resolve function', (t) => {
  const store = createStore();
  t.is(typeof store.resolve, 'function');
});

test('should raise reject when try resolve an undefined locale', async t => {
  const store = createStore();
  const error = await t.throwsAsync(store.resolve());
  t.is(error.message, ERR_MSGS.LOCALE_UNDEFINED);
});

test('should raise reject when try resolve a locale that doesn\'t exists', async t => {
  const store = createStore();
  const error = await t.throwsAsync(store.resolve('de'));
  t.is(error.message, ERR_MSGS.LOCALE_NOT_FOUND);
});

test('should return a catalog using locales map', async t => {
  const localeEN = {};
  const store = createStore({
    cache: {
      'en': localeEN,
    },
  });

  const catalog = await store.resolve('en');

  t.true(localeEN === catalog);
});

test('should call the resolver with the options passed by arguments', async t => {
  t.plan(2);
  const localeES = 'es';
  const testArg = 'foo';
  const store = createStore({
    testArg,
    resolver: (locale, cache, { testArg: rTestArg }) => {
      t.is(locale, localeES);
      t.is(rTestArg, testArg);
      return {};
    },
  });

  await store.resolve(localeES);
});

test('should return a catalog using resolver async', async t => {
  const localeEN = {};
  const store = createStore({
    resolver: locale => new Promise(resolve => setTimeout(() => resolve(localeEN), 600)),
  });

  const catalog = await store.resolve('en');

  t.true(localeEN === catalog);
});

Object.values(STORE_EVENTS).map(eventName => {
  test(`should subscribe to ${eventName} event`, async t => {
    const store = createStore({
      cache: { en: {} },
    });

    const listener = (mixed) => {
      if (eventName === 'error') {
        t.is(mixed.message, ERR_MSGS.LOCALE_NOT_FOUND);
      } else {
        t.is(mixed.locale, 'en');
        t.truthy(mixed.cache);
      }
    };

    t.plan(eventName === 'error' ? 3 : 4);

    store.subscribe(eventName, listener);

    store.on(eventName, listener);

    if (eventName === 'error') {
      t.plan(3);
      await t.throwsAsync(store.resolve('es'));
    } else {
      t.plan(4);
      await store.resolve('en');
    }
  });

  test(`should unsubscribe of event ${eventName}`, async t => {
    const store = createStore({
      cache: { en: {} },
    });

    const unsubscribe = store.subscribe(eventName, () => {
      t.fail();
    });

    unsubscribe();
    if (eventName === 'error') {
      await t.throwsAsync(store.resolve('es'));
    } else {
      await store.resolve('en');
    }
    t.pass();
  });
});

test('should subscribe all events', async t => {
  const store = createStore({
    cache: { en: {} },
  });

  const sequence = [
    STORE_EVENTS.RESOLVING,
    STORE_EVENTS.RESOLVED,
    STORE_EVENTS.RESOLVING,
    STORE_EVENTS.ERROR,
  ];
  let index = 0;

  t.plan(5);
  store.subscribe(({ type }) => {
    console.log(type);
    t.is(type, sequence[index++]);
  });

  await store.resolve('en');
  await t.throwsAsync(store.resolve('es'));
});

test('should unsubscribe of any events', async t => {
  const store = createStore({
    cache: { en: {} },
  });

  const unsubscribe = store.subscribe((eventName) => {
    t.fail();
  });

  t.is(typeof unsubscribe, 'function');

  unsubscribe();
  await store.resolve('en');
});

// test.todo('should return a catalog using resolver async');

// test.todo('should return a unsubscribe event when calling on method');
// test.todo('should raise event error when try resolve an undefined locale');
// test.todo('should raise event error when try resolve a locale that doesn\'t exists');
