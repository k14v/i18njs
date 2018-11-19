import test from 'ava';
import createStore from '../src/createStore';



test('It should exists', (t) => {
    const locales = ['es', 'en'];
    t.plan(1);
    return createStore(locales).then((store) => {
        t.truthy(store, 'message');
    })
})
