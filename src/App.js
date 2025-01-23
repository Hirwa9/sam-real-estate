import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import Pages from './components/pages/Pages';
import { SettingsProvider } from './components/SettingsProvider';
import { AuthProvider } from './components/AuthProvider';

// Define and export PropertiesContext
export const PropertiesContext = createContext();

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

    // Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <PropertiesContext.Provider value={{ propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties }}>
                <SettingsProvider>
                    <AuthProvider>
                        <Pages />
                    </AuthProvider>
                </SettingsProvider>
        </PropertiesContext.Provider>
    );
}

export default App;
