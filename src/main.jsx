

import React from "react";
import ReactDOM from "react-dom/client";
import { Nav } from "./Components/Nav";
import NavUser from "./Components/NavUser";

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
        <NavUser></NavUser>
        <Nav></Nav>


    </React.StrictMode>
)