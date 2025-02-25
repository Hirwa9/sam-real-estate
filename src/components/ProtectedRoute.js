import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuthOnMount } = useContext(AuthContext);
    if (!isAuthenticated) {
        checkAuthOnMount();
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;