import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuthOnMount } = useAuth();

    if (!isAuthenticated) {
        checkAuthOnMount();
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;