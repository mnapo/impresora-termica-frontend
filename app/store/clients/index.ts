import client from '../../feathersClient';
import { createEntityModule } from '../createEntityModule';

const {
  actions,
  reducer,
  saga,
} = createEntityModule('clients', client.service('clients'));

export { actions as clientsActions, reducer as clientsReducer, saga as clientsSaga };

const placeHolder = () => {};
export default placeHolder;