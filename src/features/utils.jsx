// este es un reducer que se encarga de ver las acciones relacionadas al fetch de la API
const initialFetching = {
  loading: "idle", // pending - succeded - rejected  (se recomienda manejar mas de un estado en lugar de true - false , asi se puede hacer mejor control y debugeo de como se esta comportando alguna accion)
  error: null,
};
export const makeFetchingReducer =
  (actions) =>
  (state = initialFetching, action) => {
    switch (action.type) {
      case actions[0]: {
        return { ...state, loading: "pending" };
      }
      case actions[1]: {
        return { ...state, loading: "succeded" };
      }
      case actions[2]: {
        return { loading: "rejected", error: action.error };
      }
      default: {
        return state;
      }
    }
  };

export const makeSetReducer =
  (actions) =>
  (state = "all", action) => {
    switch (action.type) {
      case actions[0]:
        return (state = action.payload);
      default:
        return state;
    }
  };
