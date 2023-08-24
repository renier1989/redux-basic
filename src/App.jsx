/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";

// los middlewares reciben estos de funciones que ejecutan otras funciones , // el store - el next - el 
export const asyncMiddleware = (store) => (next) => (action) => {
  // aqui estoy comprobando si la action que se esta ejecutando es una funcion
  if(typeof action === 'function'){
    return action(store.dispatch, store.getState)
  }
  return next(action);
}

// creo esta funcion con el dispatch inyectado , para ejecutarla y verificar que este sea capturado por el asyncMiddleware
export const fetchThunk = () => async (dispatch) => {
  dispatch({type: 'todos/pending'});
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos'); // consulto a al API
    const data = await response.json(); // convierto el resultado en formato JSON 
    const todos = data.slice(0,10);  // la API me retorna 200 registros, aqui los limito a solo 10
    dispatch({type:'todos/fulfilled', payload:todos});
    console.log("🚀 ~ file: App.jsx:23 ~ fetchThunk ~ todos:", todos)
  } catch (e) {
    dispatch({type:'todos/error', error: e.message}); // hago un dicpatch para capturar un mensaje de error
  }
}

// // si se usa combineReducers, ya no hace falta usar el initialState
// const initialState = {
//   entities: [],
//   filter: "all", // complete || incomplete   ( estos seran los estados del filtor para mostrar los todos)
// };

export const filterReducer = (state = "all", action) => {
  switch (action.type) {
    case "filter/set":
      return (state = action.payload);
    default:
      return state;
  }
};

export const todoReducer = (state = [], action) => {
  switch (action.type) {
    case "todos/fulfilled":{
      return state = action.payload;
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


// este es un reducer que se encarga de ver las acciones relacionadas al fetch de la API 
const initialFetching = {
  loading : 'idle', // pending - succeded - rejected  (se recomienda manejar mas de un estado en lugar de true - false , asi se puede hacer mejor control y debugeo de como se esta comportando alguna accion)
  error : null,
}
export const fetchingReducer = (state = initialFetching , action) =>{
  switch (action.type) {
    case 'todos/pending':{
      return {...state, loading : 'pending'}
    }
    case "todos/fulfilled":{
      return {...state, loading : 'succeded'}
    }
    case "todos/rejected":{
      return { loading : 'rejected', error:action.error}
    }
    default:{
      return state
    }
  }
}

// esta es una version mucho mas simplificada para usar los reducers separados 
// aqui podemos hacer composicion de reducers 
export const reducer = combineReducers({
  // este se encarga de todo lo relacionado con los todos y se hace una composicion entre el todoReducer y el fetchingReducer
  todos : combineReducers({
    entities : todoReducer,
    status : fetchingReducer
  }),
  filter: filterReducer,
})

// // aqui hago la separacion en reducers mas pequeños para poder separa complejidad
// export const reducer = (state = initialState, action) => {
//   return {
//     entities: todoReducer(state.entities, action),
//     filter: filterReducer(state.filter, action),
//   };
// };

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  return (
    <li
      style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      onClick={() => dispatch({ type: "todo/complete", payload: todo })}
    >
      {todo.title}
    </li>
  );
};

// esta funcion lo que evalua es los estados del filter para filtrar los todo y retornarlos con el estado completed filtrado
// aqui se hace una refactorizacion de los todos , porque en el combineReducers se cambio el nombre de la propiedad
// se puede hacer algo como [const { todos : {entities}, filter} = state] , esto garantiza de que se llama la nueva propiedad en el definida en el combinedReducers "Todos" pero haciendo el destractoring o llamando a su propiedad interna de "entities"
const selectedTodos = (state) => {
  const {todos:{entities}, filter} = state;
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
const selectedStatus = (state) =>state.todos.status

function App() {
  const input = useRef();
  // const state = useSelector((x) => x); // aqui simplemente estaba retornado los valores completos de state.

  // aqui le puedo pasar una funcion que me va retornar los todos dependiendo de los filtros
  // aqui cambio el nombre que la constante que traera los todos de "state" a "todos" para no generar confilcto con el state del reducer
  const todos = useSelector(selectedTodos);
  
  // uso el useSelector del status contenido en los todos para poder implementarlos en el codigo
  const status = useSelector(selectedStatus);

  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  // console.log(state, 'Rendering');

  useEffect(() => {
    input.current.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36); // un id unico
    const todo = { title: value, completed: false, id: id }; // Creamos la estructura que va a tener el todos
    dispatch({ type: "todo/add", payload: todo }); // despachamos a accion para agreagar el todo al state
    setValue(""); // limpiamos el values en el state
  };
  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  if(status.loading === "pending"){
    return (<p>Cargando.....</p>)
  }
  if(status.loading === "rejected"){
    return (<p>{status.error}</p>)
  }
  return (
    <div>
      <form onSubmit={submit}>
        <input ref={input} value={value} onChange={(e) => handleChange(e)} />
      </form>
      <button onClick={() => dispatch({ type: "filter/set", payload: "all" })}>
        Mostrar All
      </button>
      <button
        onClick={() => dispatch({ type: "filter/set", payload: "complete" })}
      >
        Completados
      </button>
      <button
        onClick={() => dispatch({ type: "filter/set", payload: "incomplete" })}
      >
        Incompletos
      </button>
      <button onClick={()=>dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
