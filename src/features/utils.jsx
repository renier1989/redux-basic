export const mat = entity => ([`${entity}/pending`, `${entity}/fulfilled`, `${entity}/rejected`]);

// Make action creator = mac
export const mac = (type , ...argNames) => (...args) => {
    // console.log(type, argNames);
    const action = {type};
    // console.log(action);
    argNames.forEach((arg, index)=>{
        // console.log(arg, index);
        // console.log(action[argNames[index]], args[index]);
        action[argNames[index]] = args[index]
    })
    return action;
}

export const asyncMac = asyncTypes => ([
    mac(asyncTypes[0]),
    mac(asyncTypes[1], 'payload'),
    mac(asyncTypes[2], 'error'), 
])

// esta es una funcion que consume reducers
// los arguemntos que recibe son los reducers y estos se ejecutan sengun el order como se le vayan asignando a la funcion de reduceReducers
// estos a su vez tambien recibiran el state y el action
export const reduceReducers =
  (...reducers) =>
  (state, action) => {
    // aqui aplicamos el metodo reduce a los reducers que vamos recibiendo
    // el accumulador "acc" sera el state y el "el" sera el reducer en si, su valor por defento sera el state
    return reducers.reduce((acc, el) => el(acc, action), state);
  };

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

export const makeCrudReducer =
  (actions) =>
  (state = [], action) => {
    switch (action.type) {
      case actions[0]: {
        return state.concat({ ...action.payload });
      }
      case actions[1]: {
        const newEntities = state.map((entity) => {
          if (entity.id === action.payload.id) {
            return { ...entity, completed: !entity.completed };
          }
          return entity;
        });
        return newEntities;
      }
      default:
        return state;
    }
  };
