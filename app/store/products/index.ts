import client from '../../feathersClient';
import { createEntityModule } from '../createEntityModule';

const {
  actions,
  reducer,
  saga,
} = createEntityModule('products', client.service('products'));

export { actions as productsActions, reducer as productsReducer, saga as productsSaga };