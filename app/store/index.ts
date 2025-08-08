import { configureStore } from '@reduxjs/toolkit';
import { productsReducer, productsSaga } from './products';
import { all } from 'redux-saga/effects';

const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();

const rootReducer = {
  products: productsReducer,
};

function* rootSaga() {
  yield all([productsSaga()]);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);