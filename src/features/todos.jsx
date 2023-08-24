import { combineReducers } from "redux";
import { makeFetchingReducer, makeSetReducer } from "./utils";

// ACTION CREATORS
export const setPending = () => ({ type: "todos/pending" });
export const setFulfilled = (payload) => ({ type: "todos/fulfilled", payload });
export const setError = (e) => ({ type: "todos/error", payload: e.message });
export const setComplete = (payload) => ({ type: "todo/complete", payload });
export const setTodoAdd = (payload) => ({ type: "todo/add", payload });
export const setFilter = (payload) => ({ type: "filter/set", payload });

// creo esta funcion con el dispatch inyectado , para ejecutarla y verificar que este sea capturado por el asyncMiddleware
export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos"); // consulto a al API
    const data = await response.json(); // convierto el resultado en formato JSON
    const todos = data.slice(0, 10); // la API me retorna 200 registros, aqui los limito a solo 10
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError(e)); // hago un dicpatch para capturar un mensaje de error
  }
};

export const filterReducer = makeSetReducer(['filter/set']);


export const todoReducer = (state = [], action) => {
  switch (action.type) {
    case "todos/fulfilled": {
      return (state = action.payload);
    }
    case "todo/add": {
      return state.concat({ ...action.payload });
    }
    case "todo/complete": {
      const newTodo = state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return newTodo;
    }
    default:
      return state;
  }
};

export const fetchingReducer = makeFetchingReducer([
    'todos/pending',
    'todos/fulfilled',
    'todos/error'
])


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
