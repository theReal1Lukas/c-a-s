import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthenticationContextProvider } from "./context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <App />
    </AuthenticationContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
