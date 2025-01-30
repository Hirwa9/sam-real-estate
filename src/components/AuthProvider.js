import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import LoadingBubbles from './common/LoadingBubbles';
import { Building, CaretDown } from '@phosphor-icons/react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null); // User object or null
    const [loading, setLoading] = useState(true); // Loading state for auth checks
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

    const api = axios.create({
        baseURL: BASE_URL,
        withCredentials: true, // Automatically send cookies
    });

    // Check authentication
    // const checkAuthOnMount = async () => {
    //     try {
    //         const response = await api.get('/verifyToken');
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
            const response = await fetch('http://localhost:5000/verifyToken', {
                // const response = await fetch('http://localhost:3000/verifyToken', {
                method: 'GET',
                credentials: 'include',  // ✅ Ensure cookies are sent
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Raw response:", response); // Debugging step

            if (!response.ok) {
                const text = await response.text();  // Read error as text
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
            }

            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle login
    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            setUser(response.data.user);
            setIsAuthenticated(true);

            // Redirect based on user type
            if (response.data.user.type === "admin") {
                navigate("/admin");
            } else if (response.data.user.type === "user") {
                navigate(`/user/${response.data.user.id}`);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await api.post('/logout'); // Invalidate cookies on the server
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Automatically check authentication on mount
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

    // Show a loading indicator while checking authentication
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
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};