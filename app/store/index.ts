import { configureStore } from '@reduxjs/toolkit';
import { productsReducer, productsSaga } from './products';
import { clientsReducer, clientsSaga } from './clients';
import { invoicesReducer, invoicesSaga } from './invoices';
import { invoicesItemsReducer, invoicesItemsSaga } from './invoices-items';
import { all } from 'redux-saga/effects';

const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();

const rootReducer = {
  products: productsReducer,
  clients: clientsReducer,
  invoices: invoicesReducer,
  invoicesItems: invoicesItemsReducer,
};

function* rootSaga() {
  yield all([productsSaga()]);
  yield all([clientsSaga()]);
  yield all([invoicesSaga()]);
  yield all([invoicesItemsSaga()]);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);