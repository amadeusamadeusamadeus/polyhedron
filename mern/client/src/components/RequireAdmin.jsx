// src/components/RequireAdmin.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

export default function RequireAdmin({ children }) {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated || user.role !== "admin") {
        // Redirect non-admins to home or a not-authorized page.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}
