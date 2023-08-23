import React from "react";
import ReactDOM from "react-dom/client";
import App, { reducer } from "./App.jsx"; // OJO : nunca llamar el reducer asi , esto se hizo para efetos de aprendizaje
import { createStore } from "redux";
import { Provider } from "react-redux"; // esto va a contener nuestro store

const store = createStore(reducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
