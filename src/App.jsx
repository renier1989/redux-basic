import { useDispatch, useSelector } from "react-redux";

const initialState = {
  entities : [],
}
export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'todo/add':{
      console.log('aqui agrego un todo/');
      // state.entities = [{}]
      return ({...state, entities: [{}]})
    }
  
  }
  return state
}

function App() {
  const state = useSelector(x=>x);
  const dispatch = useDispatch();
  console.log(state, 'Rendering');
  return (
    <div>
      <form >
        <input type="text" />
      </form>
      <button onClick={()=>dispatch({type:'todo/add'})}>Mostrar All</button>
      <button>Completados</button>
      <button>Incompletos</button>
      <ul>
        <li>todo 1 </li>
        <li>todo 2 </li>
      </ul>
    </div>
  )
}

export default App