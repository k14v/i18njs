import test from 'ava';
import createStore, { ERR_MSGS } from './createStore';

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

test.todo('should return a catalog using locales map');
test.todo('should return a catalog using resolver async');

test.todo('should return a unsubscribe event when calling on method');
test.todo('should raise event error when try resolve an undefined locale');
test.todo('should raise event error when try resolve a locale that doesn\'t exists');
