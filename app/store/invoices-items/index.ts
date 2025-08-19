import client from '../../feathersClient';
import { createEntityModule } from '../createEntityModule';

const {
  actions,
  reducer,
  saga,
} = createEntityModule('invoicesItems', client.service('invoices-items'));

export { actions as invoicesItemsActions, reducer as invoicesItemsReducer, saga as invoicesItemsSaga };

const placeHolder = () => {};
export default placeHolder;