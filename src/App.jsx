/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";

const initialState = {
  entities: [],
  filter: "all", // complete || incomplete   ( estos seran los estados del filtor para mostrar los todos)
};

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

// esta es una version mucho mas simplificada para usar los reducers separados 
export const reducer = combineReducers({
  entities: todoReducer,
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
const selectedTodos = (state) => {
  const { entities, filter } = state;

  if (filter === "complete") {
    return entities.filter((todo) => todo.completed);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.completed);
  }
  return entities;
};

function App() {
  const input = useRef();
  // const state = useSelector((x) => x); // aqui simplemente estaba retornado los valores completos de state.

  // aqui le puedo pasar una funcion que me va retornar los todos dependiendo de los filtros
  // aqui cambio el nombre que la constante que traera los todos de "state" a "todos" para no generar confilcto con el state del reducer
  const todos = useSelector(selectedTodos);

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

  // console.log(state);
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
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
