// src/pages/RootLayout.jsx
import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../components/Header.jsx";
import "../index.css"


export default function RootLayout() {

    return (
        <>
            <Header/>
            <div className="main-content">
                <Outlet/>
            </div>
        </>
    );
}
