import React, { createContext, useState, useEffect, useContext } from "react";
import { Building, CaretDown, } from "@phosphor-icons/react";
import { cError } from "../scripts/myScripts";
import FetchError from "./common/FetchError";
import LoadingBubbles from "./common/LoadingBubbles";

// Create the SettingsContext
const SettingsContext = createContext();

// Custom hook to use the SettingsContext
export const useSettings = () => useContext(SettingsContext);

// Fetch reusable function
const fetchSettings = async (url, setData, setError, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
        setError(null);
    } catch (error) {
        setError("Failed to load settings. Please try again.");
        cError(`Error fetching settings from ${url}:`, error);
    } finally {
        setLoading(false);
    }
};

// SettingsProvider Component
export const SettingsProvider = ({ children }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [businessProfileSettings, setBusinessProfileSettings] = useState([]);
    const [loadingBusinessProfileSettings, setLoadingBusinessProfileSettings] = useState(false);
    const [errorLoadingBusinessProfileSettings, setErrorLoadingBusinessProfileSettings] = useState(false);

    const [propertySettings, setPropertySettings] = useState([]);
    const [loadingPropertySettings, setLoadingPropertySettings] = useState(false);
    const [errorLoadingPropertySettings, setErrorLoadingPropertySettings] = useState(false);

    const fetchBusinessProfileSettings = () =>
        fetchSettings(
            `${BASE_URL}/businessProfile/settings`,
            setBusinessProfileSettings,
            setErrorLoadingBusinessProfileSettings,
            setLoadingBusinessProfileSettings
        );

    const fetchPropertySettings = () =>
        fetchSettings(
            `${BASE_URL}/propertySettings/settings`,
            setPropertySettings,
            setErrorLoadingPropertySettings,
            setLoadingPropertySettings
        );

    useEffect(() => {
        fetchBusinessProfileSettings();
        fetchPropertySettings();
    }, []);

    const value = {
        businessProfileSettings,
        loadingBusinessProfileSettings,
        errorLoadingBusinessProfileSettings,
        fetchBusinessProfileSettings,
        propertySettings,
        loadingPropertySettings,
        errorLoadingPropertySettings,
        fetchPropertySettings,
    };

    if (loadingBusinessProfileSettings || loadingPropertySettings) {
        return (
            <div className="h-100vh d-flex flex-column app-loading-page">
                <LoadingBubbles className="h-80 text-gray-200" icon={<Building size={80} className='loading-skeleton' />} />

                <p className="grid-center gap-3 mt-auto p-4 smaller text-gray-200 text-center fw-semibold" style={{ animation: 'zoomInBack .8s 1' }}>
                    <CaretDown className="opacity-75 me-2" /> Buy and rent properties across Kigali city
                </p>
            </div>
        )
    }

    if (
        (!loadingBusinessProfileSettings && !loadingPropertySettings) &&
        (errorLoadingBusinessProfileSettings || errorLoadingPropertySettings)
    ) {
        return (
            <div className="h-100vh flex-center app-loading-page">
                <FetchError
                    errorMessage="Something went wrong, please try again"
                    refreshFunction={() => { fetchBusinessProfileSettings(); fetchPropertySettings() }}
                />
            </div>
        );
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};