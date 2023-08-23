import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createStore } from 'redux'

// esto es un reducer y es el encargas de actualizar el estado de nuestra aplicacion
const store = createStore((state= 0, action)=>{
  switch (action.type) {
    case 'incrementar':{
      return state + 1;
    }
    case 'decrementar':{
      return state - 1;
    }
    case 'set':{
      return action.payload;
    }
    default:
    return state
  }
  // action = {type: 'tipo de accion', payload: 'any'}
  // console.log({state, action});
  // return state;
})

// el store tiene varias propiedades {getState() , dispatch()}
// el getState() : retorna lo que tiene el estado osea el state
// console.log(store.getState())

// siempre que se llama al dispatch del store , este vuelve a ejecutar el reducer que es nuestro store 
// siempre que se haga un didpatch este debe tener absolutamente siempre la propiedad de type , {type: '<nombre de la accion>'}
// para pasar data se usa la propiedad payload y este debe llamarse estrictamente de esta forma. 
// console.log(store.getState(), ' Antes de actualizar el state');
// store.dispatch({type:'accion', payload: 2});
// console.log(store.getState(), ' Despues de hacer un Dispatch y actualizar el state');

console.log(store.getState(), ' Antes de actualizar el state');
store.dispatch({type:'incrementar'});
console.log(store.getState(), ' Aqui el valor del state debe ser 1');
store.dispatch({type:'decrementar'});
console.log(store.getState(), ' Aqui el valor del state debe ser 0');
store.dispatch({type:'set', payload: 99});
console.log(store.getState(), ' Aqui el valor del state debe ser 99');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
