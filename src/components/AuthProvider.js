import React, { createContext, useState, useEffect, useContext } from "react";
import { Building, CaretDown, WarningCircle } from "@phosphor-icons/react";
import LoadingBubbles from "./common/LoadingBubbles";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import useCustomDialogs from "./hooks/useCustomDialogs";
import MyToast from "./common/Toast";

// Create the AuthContext
export const AuthContext = createContext();

// Custom hook for consuming the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,
    } = useCustomDialogs();
    const BASE_URL = 'http://localhost:5000';
    const navigate = useNavigate();


    const [user, setUser] = useState(null); // User object or null
    const [loading, setLoading] = useState(true); // Loading state for auth checks
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Loading state for auth checks

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);



    // Mock a login function
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            const data = response.data;
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);
            setIsAuthenticated(true);

            // Redirects
            if (data.user.type === 'admin') {
                // <Navigate to={`/admin`} />
                navigate('/admin');
            } else if (data.user.type === 'user') {
                // <Navigate to={`/user/${data.user.id}`} />
                navigate(`/user/${data.user.id}`);
            }
        } catch (error) {
            setUser(null);
            console.error("Login failed:", error);
            toast({
                message: <><WarningCircle size={22} weight='fill' className='me-1 opacity-50' /> {error.response.data.message}.</>,
                type: 'warning'
            });
        }
    };

    console.log(isAuthenticated);

    const checkAuthentication = async () => {
        if (!accessToken) return;

        try {
            const response = await axios.get(`${BASE_URL}/verifyToken`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsAuthenticated(true);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log("Access token expired, refreshing...");
                await refreshAccessToken();
            } else {
                setIsAuthenticated(false);
            }
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/refreshToken`, {
                refreshToken,
            });
            setAccessToken(response.data.accessToken);
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            setIsAuthenticated(false);
        }
    };

    // Mock a logout function
    const logout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, { refreshToken });
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Check authentication on mout
    useEffect(() => {
        const timeout = setTimeout(() => {
            checkAuthentication();
            setLoading(false);
        }, 400);

        return () => clearTimeout(timeout);
    }, []);

    // Context value to provide to children
    const value = {
        user,
        login,
        logout,
        accessToken,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthentication,
    };

    // Show a loading indicator until the auth check is complete
    if (loading) {
        return (
            <div className="h-100vh d-flex flex-column app-loading-page">
                <LoadingBubbles className="h-80 text-gray-200" icon={<Building size={80} className='loading-skeleton' />} />

                <p className="grid-center gap-3 mt-auto p-4 smaller text-gray-200 text-center fw-semibold" style={{ animation: 'zoomInBack .8s 1' }}>
                    <CaretDown className="opacity-75 me-2" /> Buy and rent properties across Kigali city
                </p>
            </div>
        )
    }

    // // Define routes for authenticated and public access
    // const AuthenticatedRoute = ({ children }) => {
    //     return value.isAuthenticated ? children : <Navigate to="/login" />;
    // };

    // const PublicRoute = ({ children }) => {
    //     return !value.isAuthenticated ? children : <Navigate to="/profile" />;
    // };

    // Render the AuthContext.Provider with routing logic
    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
};
