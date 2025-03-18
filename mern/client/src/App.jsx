// src/App.jsx
import React from "react";
import "./index.css"
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {CartContextProvider} from "./store/CartContext.jsx";
import {UserProgressContextProvider} from "./store/UserProgressContext.jsx";
import {AuthContextProvider} from "./store/AuthContext.jsx";
import RootLayout from "./pages/Root.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Orders from "./pages/Orders.jsx";
import UserSettings from "./pages/UserSettings.jsx";
import AdminSignupForm from "./components/AdminSignupForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import {action as LogoutAction} from "./pages/Logout.js";
import RequireAdmin from "./components/RequireAdmin.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";




const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {index: true, element:

                    <Home/>

            },
            {path: "orders", element: <Orders/>},
            {path: "signup", element: <Signup/>},
            {path: "settings", element: <UserSettings/>},
            {path: "adminSignup", element: <AdminSignupForm/>},
            { path: "cart", element: <CartPage /> },
            { path: "checkout", element: <CheckoutPage /> },
            {
                path: "admin-dashboard", element:
                    <RequireAdmin>
                        <AdminDashboard/>
                    </RequireAdmin>
            },
            {path: "logout", action: LogoutAction},
        ],
    },
]);

function App() {
    return (
        <AuthContextProvider>
            <UserProgressContextProvider>
                <CartContextProvider>
                    <RouterProvider router={router}/>
                </CartContextProvider>
            </UserProgressContextProvider>
        </AuthContextProvider>
    );
}

export default App;
