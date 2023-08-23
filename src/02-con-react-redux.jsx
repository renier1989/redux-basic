import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const reducer = (state= 0, action) => {
  console.log(state,action);
  switch (action.type) {
    case 'incrementar':
      return state + 1;
    case 'decrementar':
      return state - 1;
    case 'set':
      return action.payload;
      
    default:
    return state
  }
}

function App() {
  const [valor, setValor] = useState('');
  const dispatch = useDispatch();  // esto es un metodo que viene con la libreria de react-redux
  const state = useSelector(state => state)
  const set = () => {
    dispatch({type:'set', payload:valor});
    setValor('');
  }
  return (
    <div>
      <p>Contador : {state}</p>
      <button onClick={()=>dispatch({type:'decrementar'})} >Decrementar</button>
      <button onClick={()=>dispatch({type:'incrementar'})}>Incrementar</button>
      <button onClick={set}>Set</button>
      <input value={valor} onChange={(e)=> setValor(e.target.value)} />
      </div>
  )
}

export default App