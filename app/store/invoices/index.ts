import client from '../../feathersClient';
import { createEntityModule } from '../createEntityModule';

const {
  actions,
  reducer,
  saga,
} = createEntityModule('invoices', client.service('invoices'));

export { actions as invoicesActions, reducer as invoicesReducer, saga as invoicesSaga };