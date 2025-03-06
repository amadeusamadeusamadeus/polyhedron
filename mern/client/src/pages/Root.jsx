// src/pages/RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function RootLayout() {
    return (
        <>
            <Header/>
            {/*<div className="mt-0 my-1">*/}
            {/*    <hr className="line"/>*/}
            {/*</div>*/}
            <div className="main-content">
                <Outlet/>
            </div>
        </>
    );
}
