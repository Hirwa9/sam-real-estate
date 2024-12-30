import { createContext, useEffect, useState } from 'react';
import './App.css';
import Pages from './components/pages/Pages';
import axios from 'axios';

// Define and export PropertiesContext and AuthenticationContext
export const PropertiesContext = createContext();
export const AuthenticationContext = createContext();

function App() {
    // Properties state and functions
    const [propertiesContext, setPropertiesContext] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [errorLoadingProperties, setErrorLoadingProperties] = useState(null);

    const fetchProperties = async () => {
        try {
            setLoadingProperties(true);
            const response = await fetch(`http://localhost:5000/properties`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // setPropertiesContext(data.filter(property => property.listed));
            setPropertiesContext(
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
            setErrorLoadingProperties(null);
        } catch (error) {
            setErrorLoadingProperties("Failed to load properties. Please refresh to try again.");
            console.error("Error fetching properties:", error);
        } finally {
            setLoadingProperties(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Authentication state and functions
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkAuthentication = async () => {
    try {
        // Retrieve token from cookies if stored
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
        // console.log(token);
        console.log(document.cookie);

        // Add Authorization header with the Bearer token
        const response = await axios.get('http://localhost:5000/verifyToken', {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);
        setIsLoggedIn(true); // If verifyToken succeeds, user is logged in
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log("Token expired, consider refreshing here if needed.");
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(false);
        }
    }
};


    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <PropertiesContext.Provider value={{ propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties }}>
            <AuthenticationContext.Provider value={{ isLoggedIn, checkAuthentication }}>
                <Pages />
            </AuthenticationContext.Provider>
        </PropertiesContext.Provider>
    );
}

export default App;
