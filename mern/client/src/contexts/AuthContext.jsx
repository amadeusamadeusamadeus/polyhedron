// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    token: null,
    user: null,
    login: (token, user) => {},
    logout: () => {},
    isAuthenticated: false,
    authLoaded: false,
});

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setAuthLoaded(true);
    }, []);

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const contextValue = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        authLoaded,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
