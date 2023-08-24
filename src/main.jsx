import React from "react";
import ReactDOM from "react-dom/client";
import App, { asyncMiddleware, reducer } from "./App.jsx"; // OJO : nunca llamar el reducer asi , esto se hizo para efetos de aprendizaje
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux"; // esto va a contener nuestro store

// el applyMiddleware se le pasa al createStore para poder usarlo en la aplicacion completa
const store = createStore(reducer, applyMiddleware(asyncMiddleware));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
