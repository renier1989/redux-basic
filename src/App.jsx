import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  entities: [],
};
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "todo/add": {
      // console.log('aqui agrego un todo/');
      // state.entities = [{}]
      return {
        ...state,
        entities: state.entities.concat({ ...action.payload }),
      }; // esto es para poder obtener y actualizar la lista de los TODOS con el formato correcto , xe: si tiene un id, un estado, contenido en forma de JSON por eso se usa en concat para concatenar con lo que ya estaba en el state de entities
    }
  }
  return state;
};


const TodoItem = ({todo}) => {
  return(
    <li>{todo.title}</li>
  )
}

function App() {
  const state = useSelector((x) => x);
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  // console.log(state, 'Rendering');

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36); // un id unico
    const todo = { title: value, completed: false, id: id }; // Creamos la estructura que va a tener el todos
    dispatch({ type: "todo/add", payload: todo }); // despachamos a accion para agreagar el todo al state
    setValue(''); // limpiamos el values en el state
  };
  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  console.log(state);
  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={(e) => handleChange(e)} />
      </form>
      <button>Mostrar All</button>
      <button>Completados</button>
      <button>Incompletos</button>
      <ul>
        {state.entities.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      </ul>
    </div>
  );
}

export default App;
