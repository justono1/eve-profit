import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import immutableCheckMiddleWare from 'redux-immutable-state-invariant';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import debounce from 'redux-storage-decorator-debounce';
import filter from 'redux-storage-decorator-filter';

// Setup
const middleWare = [];

// Immutability Check
if (process.env.NODE_ENV === 'development') {
  middleWare.push(immutableCheckMiddleWare());
}

// Redux Store
const wrappedReducer = storage.reducer(rootReducer);

let engine = createEngine('my-save-key');
engine = debounce(engine, 1000);
engine = filter(engine, ['auth']);

const reduxStorageMiddleware = storage.createMiddleware(engine);
middleWare.push(reduxStorageMiddleware);
const loadStore = storage.createLoader(engine);

// Logger Middleware. This always has to be last
const loggerMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
});
middleWare.push(loggerMiddleware);

const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);
export default function makeStore(callback) {
 const store = createStoreWithMiddleware(wrappedReducer);
 loadStore(store)
  .then((newState) => console.log('Loaded state:', newState))
  .catch(() => console.log('Failed to load previous state'));
  return store;
}