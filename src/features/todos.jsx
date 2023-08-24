import { combineReducers } from "redux";
import { makeCrudReducer, makeFetchingReducer, makeSetReducer, reduceReducers } from "./utils";

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

// ACTION CREATORS
export const setPending = mac('todos/pending');
export const setFulfilled = mac('todos/fulfilled', 'payload');
export const setError = mac('todos/error', 'error');
export const  setComplete = mac('todo/complete', 'payload');
export const setTodoAdd = mac('todo/add', 'payload');
export const setFilter = mac('filter/set', 'payload');

// export const setPending = () => ({ type: "todos/pending" });
// export const setFulfilled = (payload) => ({ type: "todos/fulfilled", payload });
// export const setError = (e) => ({ type: "todos/error", payload: e.message });
// export const setComplete = (payload) => ({ type: "todo/complete", payload });
// export const setTodoAdd = (payload) => ({ type: "todo/add", payload });
// export const setFilter = (payload) => ({ type: "filter/set", payload });

// creo esta funcion con el dispatch inyectado , para ejecutarla y verificar que este sea capturado por el asyncMiddleware
export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos"); // consulto a al API
    const data = await response.json(); // convierto el resultado en formato JSON
    const todos = data.slice(0, 10); // la API me retorna 200 registros, aqui los limito a solo 10
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError(e.message)); // hago un dicpatch para capturar un mensaje de error
  }
};

export const filterReducer = makeSetReducer(["filter/set"]);

// se separo la logica del reducer para crear y modificar los todos
const crudReducer = makeCrudReducer([
    'todo/add',
    'todo/complete'
]) 

// este fullfilledReducer tomara como base una logica del makeSetReducer , la cual lo unico que hace es asignar el valor que recibe del payload a su state
const fulfilledReducer = makeSetReducer(["todos/fulfilled"]); 

// ahora tenermos que componer la ejecucion de los reducer con la funcion de reduceReducers y pasarle los reducer segund el orden de ejecucion que queremos
const todoReducer = reduceReducers(crudReducer, fulfilledReducer);

export const fetchingReducer = makeFetchingReducer([
  "todos/pending",
  "todos/fulfilled",
  "todos/error",
]);

// esta es una version mucho mas simplificada para usar los reducers separados
// aqui podemos hacer composicion de reducers
export const reducer = combineReducers({
  // este se encarga de todo lo relacionado con los todos y se hace una composicion entre el todoReducer y el fetchingReducer
  todos: combineReducers({
    entities: todoReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});

// // aqui hago la separacion en reducers mas pequeños para poder separa complejidad
// export const reducer = (state = initialState, action) => {
//   return {
//     entities: todoReducer(state.entities, action),
//     filter: filterReducer(state.filter, action),
//   };
// };

// esta funcion lo que evalua es los estados del filter para filtrar los todo y retornarlos con el estado completed filtrado
// aqui se hace una refactorizacion de los todos , porque en el combineReducers se cambio el nombre de la propiedad
// se puede hacer algo como [const { todos : {entities}, filter} = state] , esto garantiza de que se llama la nueva propiedad en el definida en el combinedReducers "Todos" pero haciendo el destractoring o llamando a su propiedad interna de "entities"
export const selectedTodos = (state) => {
  const {
    todos: { entities },
    filter,
  } = state;
  // const { entities, filter } = state;

  if (filter === "complete") {
    return entities.filter((todo) => todo.completed);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.completed);
  }
  return entities;
};

// aqui accedo al state y traigo de los todos el status
export const selectedStatus = (state) => state.todos.status;
