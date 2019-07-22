// Test
import test from 'ava';
import sinon from 'sinon';
// Utils
import { warn } from './utils';


test('should call warning twice with the same message and print two unique messages', (t) => {
  const warnSpy = sinon.spy(console, 'warn');
  warn('foo');
  warn('foo');
  warn('bar');

  t.true(warnSpy.called);
  t.is(warnSpy.callCount, 2);
  console.warn.restore();
});

test('should reset warning store when call clear', (t) => {
  const warnSpy = sinon.spy(console, 'warn');
  warn('alice');
  warn('alice');
  warn('bob');
  warn('bob');
  warn.clear();
  warn('alice');
  warn('bob');

  t.true(warnSpy.called);
  t.is(warnSpy.callCount, 4);
  console.warn.restore();
});
