import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuthOnMount } = useContext(AuthContext);
    if (!isAuthenticated) {
        checkAuthOnMount();
    }
    console.log(isAuthenticated);
    // Redirect to login if not authenticated
    // return isAuthenticated ? children : <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;