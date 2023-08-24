// los middlewares reciben estos de funciones que ejecutan otras funciones , // el store - el next - el
export const asyncMiddleware = (store) => (next) => (action) => {
    // aqui estoy comprobando si la action que se esta ejecutando es una funcion
    if (typeof action === "function") {
      return action(store.dispatch, store.getState);
    }
    return next(action);
  };