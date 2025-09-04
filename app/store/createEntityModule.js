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

  const createAction = (payload, meta) => ({ type: CREATE, payload, meta });
  const updateAction = (payload, meta) => ({ type: UPDATE, payload, meta });
  const removeAction = (id, meta) => ({ type: REMOVE, payload: id, meta });

  const setLoading = (loading) => ({ type: LOADING, payload: loading });
  const setError = (error) => ({ type: ERROR, error });

  const ERROR_REPEATED = 'RECORD_REPEATED';

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
      action.meta?.resolve?.(data);
    } catch (err) {
      const serialized = serializeError(err);
      yield put(setError(serialized));
      action.meta?.reject?.(serialized);
    } finally {
      yield put(setLoading(false));
    }
  }

  function* createSaga(action) {
    try {
      const response = yield call([service, 'create'], action.payload);
      yield put(fetchAction());
      action.meta?.resolve?.(response);
    } catch (err) {
      const serialized = serializeError(err);
      if (serialized.code === 409) {
        yield put(setError(ERROR_REPEATED));
      }
      yield put(setError(serialized));
      action.meta?.reject?.(serialized);
    }
  }

  function* updateSaga(action) {
    try {
      const { id, ...fields } = action.payload;
      const response = yield call([service, 'patch'], id, fields);
      yield put(fetchAction());
      action.meta?.resolve?.(response);
    } catch (err) {
      const serialized = serializeError(err);
      yield put(setError(serialized));
      action.meta?.reject?.(serialized);
    }
  }

  function* removeSaga(action) {
    try {
      const response = yield call([service, 'remove'], action.payload);
      yield put(fetchAction());
      action.meta?.resolve?.(response);
    } catch (err) {
      const serialized = serializeError(err);
      yield put(setError(serialized));
      action.meta?.reject?.(serialized);
    }
  }

  function* saga() {
    yield takeLatest(FETCH, fetchSaga);
    yield takeLatest(CREATE, createSaga);
    yield takeLatest(UPDATE, updateSaga);
    yield takeLatest(REMOVE, removeSaga);
  }

  function serializeError(err) {
    return {
      code: err.code || null,
      message: err.message || 'Unknown error',
      data: err.data || null,
      className: err.className || null,
    };
  }

  return {
    actions: { fetchAction, createAction, updateAction, removeAction },
    reducer,
    saga,
    ERROR_REPEATED,
  };
}

const placeHolder = () => {};
export default placeHolder;