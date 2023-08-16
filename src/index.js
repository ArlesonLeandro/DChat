import * as React from "react";
import ReactDOM from "react-dom/client";
import './App.css'
import './Interface.css'
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.hydrateRoot(document.getElementById("root"),
    <React.StrictMode>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </React.StrictMode>
);