// src/App.jsx
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {CartContextProvider} from "./store/CartContext.jsx";
import {UserProgressContextProvider} from "./store/UserProgressContext.jsx";
import RootLayout from "./pages/Root.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Orders from "./pages/Orders.jsx";
import UserSettings from "./pages/UserSettings.jsx";

//TODO: connect Polyhedron logo/button with home, make a back button under polyhedron with an arrow also going to home when not on the main page and a home menu point in the offcanvas menu


function App() {
    return (
        <UserProgressContextProvider>
            <CartContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<RootLayout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="orders" element={<Orders/>}/>
                            <Route path="signup" element={<Signup/>}/>
                            <Route path="settings" element={<UserSettings/>}/>
                            {/*<Route path="" element={<SignupForm />} />*/}
                            {/*<Route path="about" element={<AboutPage />} />*/}
                        </Route>
                    </Routes>
                </Router>
            </CartContextProvider>
        </UserProgressContextProvider>
    );
}

export default App;
