import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { call, put, takeLatest } from 'redux-saga/effects';

export function createEntityModule(entityName, service) {
  const FETCH = `${entityName}/FETCH`;
  const SET = `${entityName}/SET`;
  const CREATE = `${entityName}/CREATE`;
  const UPDATE = `${entityName}/UPDATE`;
  const REMOVE = `${entityName}/REMOVE`;
  const LOADING = `${entityName}/LOADING`;
  const ERROR = `${entityName}/ERROR`;

  const fetchAction = (params) => ({ type: FETCH, payload: params });
  const setAction = (data) => ({ type: SET, payload: data });
  const createAction = (payload) => ({ type: CREATE, payload });
  const updateAction = (payload) => ({ type: UPDATE, payload });
  const removeAction = (id) => ({ type: REMOVE, payload: id });
  const setLoading = (loading) => ({ type: LOADING, payload: loading });
  const setError = (error) => ({ type: ERROR, error });

  const initialState = {
    items: [],
    error: null,
    loading: false,
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case SET:
        return { ...state, items: action.payload };
      case LOADING:
        return { ...state, loading: action.payload };
      case ERROR:
        return { ...state, loading: false, error: action.error };
      default:
        return state;
    }
  }

  function* fetchSaga(action) {
    try {
      yield put(setLoading(true));

      const params = action.payload || {};
      const res = yield call([service, 'find'], params);

      const data = Array.isArray(res) ? res : res.data;
      yield put(setAction(data));
    } finally {
      yield put(setLoading(false));
    }
  }

  function* createSaga(action) {
    try {
      yield call([service, 'create'], action.payload);
      yield put(fetchAction());
    } catch (err) {
      console.log(err);
      yield put(setError(err));
    }
  }

  function* updateSaga(action) {
    try {
      const { id, ...fields } = action.payload;
      yield call([service, 'patch'], id, fields); 
      yield put(fetchAction());
    } catch (err) {
      console.log('Update error', err);
    }
  }

  function* removeSaga(action) {
    try {
      yield call([service, 'remove'], action.payload);
      yield put(fetchAction());
    } catch (err) {
      console.log('Remove error', err);
    }
  }

  function* saga() {
    yield takeLatest(FETCH, fetchSaga);
    yield takeLatest(CREATE, createSaga);
    yield takeLatest(UPDATE, updateSaga);
    yield takeLatest(REMOVE, removeSaga);
  }

  return {
    actions: { fetchAction, createAction, updateAction, removeAction },
    reducer,
    saga,
  };
}

const placeHolder = () => {};
export default placeHolder;