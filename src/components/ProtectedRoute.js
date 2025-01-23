import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuthentication } = useContext(AuthContext);
    useEffect(() => {
        !isAuthenticated && checkAuthentication();
    }, [isAuthenticated, checkAuthentication]);

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;