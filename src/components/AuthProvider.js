import React, { createContext, useState, useEffect } from 'react';
import { Axios, BASE_URL } from '../api/api';
import { useNavigate } from 'react-router-dom';
import LoadingBubbles from './common/LoadingBubbles';
import { Building, CaretDown } from '@phosphor-icons/react';
import useCustomDialogs from './hooks/useCustomDialogs';
import MyToast from './common/Toast';

export const AuthContext = createContext();

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

    const navigate = useNavigate();

    const [user, setUser] = useState(null); // User object or null
    const [loading, setLoading] = useState(true); // Loading state for auth checks
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

    // Check authentication
    // const checkAuthOnMount = async () => {
    //     try {
    //         const response = await Axios.get('/verifyToken');
    //         setUser(response.data.user);
    //         setIsAuthenticated(true);
    //     } catch (error) {
    //         console.error("Authentication check failed:", error);
    //         setUser(null);
    //         setIsAuthenticated(false);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const checkAuthOnMount = async () => {
        try {
            const response = await Axios.get(`/verifyToken`, {
                withCredentials: true,  // ✅ Ensure cookies are sent
                headers: { 'Content-Type': 'application/json' }
            });

            // console.log("Raw response:", response); // Debugging step

            if (response.status !== 200) {
                const text = response.data;  // Read error as text
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
            }

            const data = response.data;
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            // console.error("Authentication check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await Axios.post('/login', { email, password }, { withCredentials: true });
            setUser(response.data.user);
            setIsAuthenticated(true);

            // Redirect based on user type
            const user = response.data.user;
            if (user.type === "admin") {
                navigate("/admin");
            } else if (user.type === "user") {
                navigate(`/user/${user.id}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Login failed";
            toast({ message: errorMessage, type: 'warning' });
            // console.error("Login failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await Axios.post('/logout', {}, { withCredentials: true }); // Ensures cookies are cleared
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    // Check authentication on mount
    useEffect(() => {
        checkAuthOnMount();
    }, []);

    // Context value
    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        checkAuthOnMount,
    };

    // Loading indicator while checking authentication
    if (loading) {
        return (
            <div className="h-100vh d-flex flex-column app-loading-page">
                <LoadingBubbles
                    className="h-80 text-gray-200"
                    icon={<Building size={80} className="loading-skeleton" />}
                />
                <p
                    className="grid-center gap-3 mt-auto p-4 smaller text-gray-200 text-center fw-semibold"
                    style={{ animation: "zoomInBack .8s 1" }}
                >
                    <CaretDown className="opacity-75 me-2" /> Buy and rent properties across Kigali city
                </p>
            </div>
        );
    }

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
};