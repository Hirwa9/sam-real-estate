import React, { createContext, useState, useEffect, useContext } from 'react';
import { Axios } from '../api/api';
import { useNavigate } from 'react-router-dom';
import LoadingBubbles from './common/LoadingBubbles';
import { Building, CaretDown, SmileySticker } from '@phosphor-icons/react';
import useCustomDialogs from './hooks/useCustomDialogs';
import MyToast from './common/Toast';

// AuthContext
export const AuthContext = createContext();

// A custom hook for using AuthContext
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

    const navigate = useNavigate();

    const [user, setUser] = useState(null); // User object or null
    const [loading, setLoading] = useState(true); // Loading state for auth checks
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

    // Check authentication
    const checkAuthOnMount = async () => {
        try {
            const response = await Axios.get(`/verifyToken`, {
                withCredentials: true,  // Send cookies and auth headers
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                const text = response.data;
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
            }

            const data = response.data;
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Check authentication on mount
    useEffect(() => {
        checkAuthOnMount();
    }, []);

    // Login function
    const login = async (email, password, params) => {
        try {
            const response = await Axios.post('/login', { email, password }, { withCredentials: true });
            setUser(response.data.user);
            setIsAuthenticated(true);

            // Redirect based on user type
            const user = response.data.user;
            if (params && params.redirect) {
                if (user.type === "admin") {
                    navigate("/admin");
                } else if (user.type === "user") {
                    navigate(`/user/${user.id}`);
                }
            } else {
                toast({
                    message:
                        <>
                            <div><SmileySticker size={20} weight='fill' className='me-1' /> Welcome back {user.name}. You're signed in.</div>
                        </>,
                    type: 'dark'
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Login failed";
            toast({ message: errorMessage, type: 'warning' });
            setUser(null);
            setIsAuthenticated(false);
            console.error("Login failed:", error);
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

    // Context value
    const value = {
        loading,
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