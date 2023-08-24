/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThunk,
  selectedStatus,
  selectedTodos,
  setComplete,
  setFilter,
  setTodoAdd,
} from "./features/todos";

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  return (
    <li
      style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      onClick={() => dispatch(setComplete(todo))}
    >
      {todo.title}
    </li>
  );
};

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
    dispatch(setTodoAdd(todo)); // despachamos a accion para agreagar el todo al state
    setValue(""); // limpiamos el values en el state
  };
  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  if (status.loading === "pending") {
    return <p>Cargando.....</p>;
  }
  if (status.loading === "rejected") {
    return <p>{status.error}</p>;
  }
  return (
    <div>
      <form onSubmit={submit}>
        <input ref={input} value={value} onChange={(e) => handleChange(e)} />
      </form>
      <button onClick={() => dispatch(setFilter("all"))}>Mostrar All</button>
      <button onClick={() => dispatch(setFilter("complete"))}>
        Completados
      </button>
      <button onClick={() => dispatch(setFilter("incomplete"))}>
        Incompletos
      </button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;
