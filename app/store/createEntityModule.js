import { call, put, takeLatest } from 'redux-saga/effects';

export function createEntityModule(entityName, service) {
  const FETCH = `${entityName}/FETCH`;
  const SET = `${entityName}/SET`;
  const CREATE = `${entityName}/CREATE`;
  const REMOVE = `${entityName}/REMOVE`;
  const LOADING = `${entityName}/LOADING`;

  const fetchAction = () => ({ type: FETCH });
  const setAction = (data) => ({ type: SET, payload: data });
  const createAction = (payload) => ({ type: CREATE, payload });
  const removeAction = (id) => ({ type: REMOVE, payload: id });
  const setLoading = (loading) => ({ type: LOADING, payload: loading });

  const initialState = {
    items: [],
    loading: false,
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case SET:
        return { ...state, items: action.payload };
      case LOADING:
        return { ...state, loading: action.payload };
      default:
        return state;
    }
  }

  function* fetchSaga() {
    try {
      yield put(setLoading(true));
      const res = yield call([service, 'find']);
      yield put(setAction(res.data));
    } finally {
      yield put(setLoading(false));
    }
  }

  function* createSaga(action) {
    try {
      yield call([service, 'create'], action.payload);
      yield put(fetchAction());
    } catch (err) {
      console.log('Create error', err);
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
    yield takeLatest(REMOVE, removeSaga);
  }

  return {
    actions: { fetchAction, createAction, removeAction },
    reducer,
    saga,
  };
}