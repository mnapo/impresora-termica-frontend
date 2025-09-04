import { useDispatch } from "react-redux";

export function useEntityActions(entityModule) {
  const dispatch = useDispatch();

  function promisify(actionCreator) {
    return (payload) =>
      new Promise((resolve, reject) => {
        dispatch(actionCreator(payload, { resolve, reject }));
      });
  }

  return {
    fetchAsync: promisify(entityModule.actions.fetchAction),
    createAsync: promisify(entityModule.actions.createAction),
    updateAsync: promisify(entityModule.actions.updateAction),
    removeAsync: promisify(entityModule.actions.removeAction),
  };
}
