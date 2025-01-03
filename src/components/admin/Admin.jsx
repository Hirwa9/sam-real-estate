import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import './admin.css';
import logo from "../../components/images/logo.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { PropertiesContext } from '../../App';
import { ArrowClockwise, ArrowLeft, Bed, BellRinging, BellSimpleSlash, Bookmark, Building, BuildingApartment, BuildingOffice, Calendar, CalendarCheck, Car, CaretDoubleRight, CaretDown, CaretRight, ChartBar, ChartPieSlice, ChatDots, Check, CheckCircle, CheckSquare, CircleWavyCheck, CreditCard, Dot, Envelope, EnvelopeSimple, Eraser, Eye, EyeSlash, FloppyDisk, Gear, HandCoins, Heart, HouseLine, IdentificationBadge, Image, Info, List, ListDashes, MagnifyingGlass, MapPinArea, MapTrifold, Money, MoneyWavy, Mountains, PaperPlaneRight, Pen, Phone, Plus, PushPinSimple, PushPinSimpleSlash, RowsPlusBottom, SealCheck, ShareFat, ShoppingCart, Shower, SignOut, SortAscending, SortDescending, Storefront, Swap, Table, TextAlignLeft, TextAUnderline, Trash, User, UserCheck, Video, Warning, WhatsappLogo, X } from '@phosphor-icons/react';
import { cError, cLog, deepEqual, formatBigCountNumbers, formatDate, getDateHoursMinutes, isValidEmail, shareProperty } from '../../scripts/myScripts';
import MyToast from '../common/Toast';
import BottomFixedCard from '../common/bottomFixedCard/BottomFixedCard';
import DividerText from '../common/DividerText';
import ActionPrompt from '../common/actionPrompt/ActionPrompt';
import ConfirmDialog from '../common/confirmDialog/ConfirmDialog';
import { aboutProperties, companyAddress, companyEmail, companyMotto, companyName, companyPhoneNumber1, companyPhoneNumber2 } from '../data/Data';
import LoadingBubbles from '../common/LoadingBubbles';
import FetchError from '../common/FetchError';
import { useSettings } from '../SettingsProvider';

const Admin = () => {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,

        // Confirm Dialog
        showConfirmDialog,
        confirmDialogMessage,
        confirmDialogAction,
        confirmDialogActionText,
        confirmDialogCloseText,
        confirmDialogCloseCallback,
        confirmDialogType,
        confirmDialogActionWaiting,
        setConfirmDialogActionWaiting,
        customConfirmDialog,
        resetConfirmDialog,

        // Prompt
        showPrompt,
        promptMessage,
        promptType,
        promptInputType,
        promptSelectInputOptions,
        promptInputValue,
        promptInputPlaceholder,
        promptAction,
        promptActionWaiting,
        setPromptActionWaiting,
        customPrompt,
        resetPrompt,
    } = useCustomDialogs();

    const BASE_URL = 'http://localhost:5000';

    /**
     * Sidebar
     */

    const sideNavbarRef = useRef();
    const sideNavbarTogglerRef = useRef();
    const [sideNavbarIsFloated, setSideNavbarIsFloated] = useState(false);

    // Hide navbar
    const hideSideNavbar = useCallback(() => {
        if (sideNavbarIsFloated) {
            sideNavbarRef.current.classList.add('slideOutL');
            setTimeout(() => {
                setSideNavbarIsFloated(false); // Close navbar
                sideNavbarRef.current.classList.remove('slideOutL');
            }, 400);
        }
    }, [sideNavbarIsFloated]);

    // Handle clicks outside the navbar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sideNavbarRef.current && sideNavbarTogglerRef.current) {
                if (
                    !sideNavbarRef.current.contains(e.target) &&
                    !sideNavbarTogglerRef.current.contains(e.target)
                ) {
                    hideSideNavbar(); // Attempt to hide navbar
                }
            }
        };

        // Attach "click outside" event listener
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside); // Clean up
        };
    }, [hideSideNavbar]);

    /**
     * Data
    */

    // const [activeSection, setActiveSection] = useState("dashboard");
    // const [activeSection, setActiveSection] = useState("properties");
    // const [activeSection, setActiveSection] = useState("orders");
    const [activeSection, setActiveSection] = useState("reports");
    // const [activeSection, setActiveSection] = useState("messages");
    // const [activeSection, setActiveSection] = useState("usersList");
    // const [activeSection, setActiveSection] = useState("settings");

    // __Properties
    const { propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties } = useContext(PropertiesContext);

    const allProperties = useMemo(() => (
        propertiesContext
    ), [propertiesContext]);
    const totalProperties = allProperties.length;

    // Filtered properties
    const listedProperties = useMemo(() => {
        return allProperties.filter(property => property.listed);
    }, [allProperties]);
    const listedPropertiesNum = listedProperties.length;

    const unlistedProperties = useMemo(() => {
        return allProperties.filter(property => !property.listed);
    }, [allProperties]);
    const unlistedPropertiesNum = unlistedProperties.length;

    const featuredProperties = useMemo(() => {
        return allProperties.filter(property => property.featured);
    }, [allProperties]);
    const featuredPropertiesNum = featuredProperties.length;

    const bookedProperties = useMemo(() => {
        return allProperties.filter(property => (property.booked && !property.closed));
    }, [allProperties]);
    const bookedPropertiesNum = bookedProperties.length;

    const liveProperties = useMemo(() => {
        return allProperties.filter(property => (property.listed && !property.closed));
    }, [allProperties]);
    const livePropertiesNum = liveProperties.length;

    const closedProperties = useMemo(() => {
        return allProperties.filter(property => property.closed);
    }, [allProperties]);
    const closedPropertiesNum = closedProperties.length;

    const forSaleProperties = useMemo(() => {
        return allProperties.filter(property => property.category === 'For Sale');
    }, [allProperties]);
    const forSalePropertiesNum = forSaleProperties.length;

    const forRentProperties = useMemo(() => {
        return allProperties.filter(property => property.category === 'For Rent');
    }, [allProperties]);
    const forRentPropertiesNum = forRentProperties.length;

    // Count open deals
    const openDealsNum = bookedProperties.reduce((sum, item) => {
        let bookedByArray = [];
        if (item.bookedBy) {
            try {
                bookedByArray = JSON.parse(item.bookedBy);
            } catch (parseError) {
                cError("Error parsing bookedBy array:", parseError);
            }
        }
        return sum + (Array.isArray(bookedByArray) ? bookedByArray.length : 0);
    }, 0);

    // States for filtering and displaying properties
    const [propertiesToShow, setPropertiesToShow] = useState(allProperties);

    const [showOnlyListedProperties, setShowOnlyListedProperties] = useState(false);
    const [showOnlyUnlistedProperties, setShowOnlyUnlistedProperties] = useState(false);
    const [showOnlyReservedProperties, setShowOnlyReservedProperties] = useState(false);
    const [showOnlyFeaturedProperties, setShowOnlyFeaturedProperties] = useState(false);
    const [showOnlyLiveProperties, setShowOnlyLiveProperties] = useState(false);
    const [showOnlyClosedProperties, setShowOnlyClosedProperties] = useState(false);
    const [showOnlyForSaleProperties, setShowOnlyForSaleProperties] = useState(false);
    const [showOnlyForRentProperties, setShowOnlyForRentProperties] = useState(false);
    const [showAllAvailableProperties, setShowAllAvailableProperties] = useState(true);

    // const allFilters = [
    //     { name: showOnlyListedProperties, disabler: () => setShowOnlyListedProperties(false) },
    //     { name: showOnlyReservedProperties, disabler: () => setShowOnlyReservedProperties(false) },
    //     { name: showOnlyFeaturedProperties, disabler: () => setShowOnlyFeaturedProperties(false) },
    //     { name: showOnlyClosedProperties, disabler: () => setShowOnlyClosedProperties(false) },
    //     { name: showOnlyForSaleProperties, disabler: () => setShowOnlyForSaleProperties(false) },
    //     { name: showOnlyForRentProperties, disabler: () => setShowOnlyForRentProperties(false) },
    //     { name: showAllAvailableProperties, disabler: () => setShowAllAvailableProperties(false) },
    // ];

    // Helpers to set filter states
    const showOnlyListed = () => {
        setShowOnlyListedProperties(true);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyUnlisted = () => {
        setShowOnlyUnlistedProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyFeatured = () => {
        setShowOnlyFeaturedProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyReserved = () => {
        setShowOnlyReservedProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyLiveDeals = () => {
        setShowOnlyLiveProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyClosedDeals = () => {
        setShowOnlyClosedProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    const showOnlyForSale = () => {
        setShowOnlyForSaleProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForRentProperties(false);

    };

    const showOnlyForRent = () => {
        setShowOnlyForRentProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
    };

    const showAllProperties = () => {
        setShowAllAvailableProperties(true);
        setShowOnlyListedProperties(false);
        setShowOnlyUnlistedProperties(false);
        setShowOnlyFeaturedProperties(false);
        setShowOnlyReservedProperties(false);
        setShowOnlyLiveProperties(false);
        setShowOnlyClosedProperties(false);
        setShowOnlyForSaleProperties(false);
        setShowOnlyForRentProperties(false);
    };

    // Toggling properties to show
    useEffect(() => {
        let shownProps;

        if (showOnlyListedProperties) {
            shownProps = listedProperties;
        } else if (showOnlyUnlistedProperties) {
            shownProps = unlistedProperties;
        } else if (showOnlyFeaturedProperties) {
            shownProps = featuredProperties;
        } else if (showOnlyReservedProperties) {
            shownProps = bookedProperties;
        } else if (showOnlyLiveProperties) {
            shownProps = liveProperties;
        } else if (showOnlyClosedProperties) {
            shownProps = closedProperties;
        } else if (showOnlyForSaleProperties) {
            shownProps = forSaleProperties;
        } else if (showOnlyForRentProperties) {
            shownProps = forRentProperties;
        } else {
            shownProps = allProperties;
        }

        // Detect toggled states
        if (
            showOnlyListedProperties ||
            showOnlyUnlistedProperties ||
            showOnlyFeaturedProperties ||
            showOnlyReservedProperties ||
            showOnlyLiveProperties ||
            showOnlyClosedProperties ||
            showOnlyForSaleProperties ||
            showOnlyForRentProperties
        ) {
            setShowAllAvailableProperties(false);
        }

        setPropertiesToShow(shownProps);
    }, [
        showOnlyListedProperties,
        showOnlyUnlistedProperties,
        showOnlyFeaturedProperties,
        showOnlyReservedProperties,
        showOnlyLiveProperties,
        showOnlyClosedProperties,
        showOnlyForSaleProperties,
        showOnlyForRentProperties,
        listedProperties,       // memoized
        unlistedProperties,     // memoized
        featuredProperties,     // memoized
        bookedProperties,       // memoized
        liveProperties,         // memoized
        closedProperties,       // memoized
        forSaleProperties,      // memoized
        forRentProperties,      // memoized
        allProperties           // Raw context
    ]);

    const [propertyListingFormat, setPropertyListingFormat] = useState('list');

    // Filter Properties by search bar
    const propSearcherRef = useRef();
    const [propSearchValue, setPropSearchValue] = useState('');

    const filterPropertiesBySearch = useCallback(() => {
        let searchString = propSearcherRef.current.value.toLowerCase().trim();
        if (searchString !== null && searchString !== undefined && searchString !== '') {
            showAllProperties();
            setPropSearchValue(searchString);
            setTimeout(() => {
                const filteredProps = allProperties.filter(val => (
                    val.name.toLowerCase().includes(searchString) ||
                    val.type.toLowerCase().includes(searchString) ||
                    val.location.toLowerCase().includes(searchString) ||
                    val.about.toLowerCase().includes(searchString)
                ));
                setPropertiesToShow(filteredProps);
            });
        }
    }, [allProperties]);

    const filterPropertiesByType = useCallback(() => {
        let searchString = propSearcherRef.current.value;
        if (searchString !== null && searchString !== undefined && searchString !== '') {
            showAllProperties();
            setPropSearchValue(searchString);
            setTimeout(() => {
                const filteredProps = allProperties.filter(val => (
                    val.type === searchString
                ));
                setPropertiesToShow(filteredProps);
            });
        }
    }, [allProperties]);

    // Showing and edditing selected property;
    const navigate = useNavigate();

    // Navigate to a property
    const goToProperty = (id) => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (id) {
            navigate(`/property/${id}`); // Navigate to the corresponding type
        }
    };

    const [showSelectedPropertyInfo, setShowSelectedPropertyInfo] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState([]);
    const [editSelectedProperty, setEditSelectedProperty] = useState(false);
    const [showSelectedPropertyDangerZone, setShowSelectedPropertyDangerZone] = useState(false);
    const [sortPropertyAscending, setSortPropertyAscending] = useState(false);

    /**
     * Edit properties info
    */
    const [isWaitingAdminEditAction, setIsWaitingAdminEditAction] = useState(false);
    const [dontCloseCard, setDontCloseCard] = useState([]);
    const [refreshProperties, setRefreshProperties] = useState(false);

    // Create new property
    const [showCreatePropertyForm, setShowCreatePropertyForm] = useState(false);
    const [newPropertyType, setNewPropertyType] = useState('House');

    // Handle create property
    const handleCreateProperty = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const propertyData = Object.fromEntries(formData.entries());
        propertyData.type = newPropertyType; // Include selected property type

        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/properties/createProperty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propertyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding the property');
            }

            const data = await response.json();
            toast({ message: data.message, type: 'dark' });
            setShowCreatePropertyForm(false);
            fetchProperties();
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: error.message, type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Handle create property
    const handleDeleteProperty = async (e) => {
        if (e) e.preventDefault();

        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting the property');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    // Feature prop
    const showProperty = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/show`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error showing property');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    // Feature prop
    const hideProperty = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/hide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error hidding property');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    // Feature prop
    const featureProperty = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/feature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error pinning property');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    // Unfeature prop
    const unfeatureProperty = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/unfeature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error unpining property');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    // Change prop's name
    const changePropertyName = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changeName`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing name');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's about
    const changePropertyAbout = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changeAbout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ about: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing about');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's location
    const changePropertyLocation = async () => {

        // Check if embed link is provided
        // if (!promptInputValue.current === '') {
        //     setTimeout(() => {
        //         setPromptActionWaiting(false);
        //     });
        //     return toast({ message: 'Only embed link supported', type: 'gray-200' }); // Return if not
        // }

        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changeLocation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing location');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's price
    const changePropertyPrice = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changePrice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing price');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's payment
    const changePropertyPayment = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changePayment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing payment');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's type
    const changePropertyType = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changeType`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing type');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Change prop's category
    const changePropertyCategory = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/changeCategory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: promptInputValue.current }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error changing category');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Media uploader (Images & videos)
    const uploadMedia = async (propertyId, file, type) => {
        const formData = new FormData();
        formData.append(type, file);

        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${propertyId}/add-${type}`, {
                method: "POST",
                body: formData,
                headers: {
                    // No need for "Content-Type" as FormData sets it automatically
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upload media.");
            }

            const responseData = await response.json();
            cLog("Upload successful:", responseData);

            toast({
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`,
                type: "success",
            });

            fetchProperties();
        } catch (error) {
            cError("Error uploading file:", error.message);
            toast({
                message: `Failed to upload ${type}. Please try again.`,
                type: "danger",
            });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Edit prop's media
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [showAddImageForm, setShowAddImageForm] = useState(false);
    const [showAddVideoForm, setShowAddVideoForm] = useState(false);
    const [imageFileName, setImageFileName] = useState(null);
    const [videoFileName, setVideoFileName] = useState(null);

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith("image/")) {
            toast({
                message: "Please upload a valid image file.",
                type: "danger",
            });
            return;
        }
        setImageFile(file);
        setImageFileName(file?.name || ""); // Set the file name
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith("video/")) {
            toast({
                message: "Please upload a valid video file.",
                type: "danger",
            });
            return;
        }
        setVideoFile(file);
        setVideoFileName(file?.name || ""); // Set the file name
    };

    const addPropertyImage = async () => {
        if (!imageFile) {
            toast({
                message: "Please select an image file before submitting.",
                type: "gray-700",
            });
            return;
        }

        const propertyId = selectedProperty.id;
        await uploadMedia(propertyId, imageFile, "image");
        setImageFile(null); // Clear the input after upload
        // setSelectedProperty(propertiesToShow.filter(p => p.id === propertyId));
        setShowSelectedPropertyInfo(false);
    };

    const addPropertyVideo = async () => {
        if (!videoFile) {
            toast({
                message: "Please select a video file before submitting.",
                type: "gray-700",
            });
            return;
        }

        const propertyId = selectedProperty.id;
        await uploadMedia(propertyId, videoFile, "video");
        setVideoFile(null); // Clear the input after upload
        // setSelectedProperty(propertiesToShow.filter(p => p.id === propertyId));
        setShowSelectedPropertyInfo(false);
    };

    // Remove prop's image
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const removePropertyImage = async () => {
        if (selectedImageUrl === '') {
            return toast({ message: 'Select an image to remove', type: 'gray-700' }); // Return if no image seleted
        }
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/removeImage`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: selectedImageUrl })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error removing image');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Set prop's cover image
    const setPropertyImageCover = async () => {
        if (selectedImageUrl === '') {
            return toast({ message: 'Select an image to use as cover', type: 'gray-700' }); // Return if no image seleted
        }
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/setCoverImage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: selectedImageUrl })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error setting cover image');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Remove prop's video
    const removePropertyVideo = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/removeVideo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error removing video');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Add prop's map
    const addPropertyMap = async () => {
        // Check if embed link is provided
        if (!promptInputValue.current.startsWith('<iframe ')
            || (promptInputValue.current.startsWith('<iframe ') && !promptInputValue.current.endsWith('</iframe>'))
        ) {
            setTimeout(() => {
                setPromptActionWaiting(false);
            });
            return toast({ message: 'Only embed link supported', type: 'gray-200' }); // Return if not
        }

        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/addMap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mapUrl: promptInputValue.current })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding the map');
            }
            const data = await response.json();
            resetPrompt();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setPromptActionWaiting(false);
        }
    };

    // Remove prop's map
    const removePropertyMap = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/removeMap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error removing the map');
            }
            const data = await response.json();
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Close property

    const [showClosePropertyForm, setShowClosePropertyForm] = useState(false);
    const [closeBookedProperty, setCloseBookedProperty] = useState(false);
    const [closePropertyEmail, setClosePropertyEmail] = useState('');

    const closeProperty = async (closePropertyEmail) => {
        if (!isValidEmail(closePropertyEmail)) {
            return toast({ message: '📨 Enter a valid email address to close the property', type: 'info' });
        }
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/property/${selectedProperty.id}/closeProperty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: closePropertyEmail }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error closing the property');
            }
            const data = await response.json();
            setShowClosePropertyForm(false);
            resetConfirmDialog();
            fetchProperties();
            toast({ message: data.message, type: 'dark' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
        }
    };

    // Close property options
    useEffect(() => {
        if (selectedProperty.length > 0) {
            if (selectedProperty.bookedBy !== null) {
                setCloseBookedProperty(true);
            } else { setCloseBookedProperty(false) };
        } else {
            setCloseBookedProperty(false);
        };
    }, [selectedProperty]);

    // Trigger refreshments
    useEffect(() => {
        if (refreshProperties) {
            fetchProperties();
        }
        if (!showSelectedPropertyInfo) {
            setSelectedImageUrl('');
            setShowAddImageForm(false);
            setShowAddVideoForm(false);
            setEditSelectedProperty(false);
            setShowSelectedPropertyDangerZone(false);
        }
    }, [showSelectedPropertyInfo, refreshProperties, fetchProperties]);

    // Prevent closing the card/form
    useEffect(() => {
        const reasonsToTrack = [
            { name: 'isWaitingAdminEditAction', state: isWaitingAdminEditAction },
        ];

        setDontCloseCard(prev => {
            // Add component reasons and then remove false ones
            const activeReasons = [...prev, ...reasonsToTrack]
                .filter((reason) => reason.state)
                .map((reason) => ({ name: reason.name, value: true }));
            return [...activeReasons];
        });

    }, [isWaitingAdminEditAction]);

    // Property preview
    const PropertyPreview = ({ setDontCloseCard, setRefreshProperties }) => {
        const { id, listed, cover, category, type, name, location, about, price, payment,
            bedrooms, bathrooms, garages, videoUrl, mapUrl, booked, bookedBy, closed,
            media, likes, featured } = selectedProperty;


        const mainColor = category === "For Sale" ? "#25b579" : "#ff9800";
        const mainLightColor = category === "For Sale" ? "#25b5791a" : "#ff98001a"
        const bookedByLen = booked ? JSON.parse(bookedBy).length : null;
        let propImages = null;
        let isEligible = false;
        // if (media && JSON.parse(JSON.parse(media))) {
        if (media) {
            propImages = JSON.parse(JSON.parse(media)).images;
            if (propImages.length > 4) {
                isEligible = true;
            }
        }

        return (
            <>
                <div className="mb-4 mb-md-0" id="propertyCard">
                    {/* Property previrew card */}
                    <div className={`position-relative d-xl-flex h-100 ${!closed ? 'mb-4 mb-lg-5' : ''} box`}
                        style={{ "--_mainColor": mainColor, "--_mainLightColor": mainLightColor, }}
                    >
                        <div className="position-relative col-xl-5 img">
                            {/* Closed mark */}
                            {closed &&
                                <div className="flex-align-center bg-success text-light fw-normal small ribbon">
                                    {category === 'For Rent' ? <>Rent <CircleWavyCheck weight="bold" className="ms-1" /></> : category === 'For Sale' ? <>Sold <CircleWavyCheck weight="bold" className="ms-1" /></> : "Closed"}
                                </div>
                            }
                            {/* Reserved mark */}
                            {!closed && booked &&
                                <div className="fw-normal fs-65 flex-align-center ribbon"
                                    title={bookedByLen + ` potential client${bookedByLen > 1 ? 's' : ''}`}>
                                    <Bookmark size={15} weight="fill" /> {bookedByLen}
                                </div>
                            }
                            <img src={cover ? cover : '/images/image_placeholder.png'} alt="Property" className={`dim-100 object-fit-cover ${!cover ? 'bg-gray-500' : ''}`} />
                            {/* CAT buttons */}
                            {listed &&
                                <div className="position-absolute top-0 mt-3 me-3 property-actions">
                                    <button className="btn d-flex align-items-center mb-2 border-0 bg-light text-black2 fst-italic small rounded-pill clickDown"
                                        onClick={() => goToProperty(id)} title="View property">
                                        View property <CaretDoubleRight size={16} className="ms-1" />
                                    </button>
                                    {!closed &&
                                        <button className="btn d-flex align-items-center mb-2 border-0 bg-light text-black2 fst-italic small rounded-pill clickDown" title="Share property"
                                            onClick={() => shareProperty(id, name, category)} >
                                            Share <ShareFat size={16} className="ms-1" />
                                        </button>
                                    }
                                </div>
                            }
                            {/* Iconic details */}
                            <div className="position-absolute bottom-0 gap-3 mb-2 mx-0 px-2 property-iconic-details">
                                {bedrooms &&
                                    <div className='flex-align-center fw-light text-muted'>
                                        <Bed size={20} weight='fill' className='me-1 text-light' />
                                        <span className="text-light fs-70">{bedrooms}</span>
                                    </div>
                                }
                                {bathrooms &&
                                    <div className='flex-align-center fw-light text-muted'>
                                        <Shower size={20} weight='fill' className='me-1 text-light' />
                                        <span className="text-light fs-70">{bathrooms}</span>
                                    </div>
                                }
                                {garages &&
                                    <div className='flex-align-center fw-light text-muted'>
                                        <Car size={20} weight='fill' className='me-1 text-light' />
                                        <span className="text-light fs-70">{garages}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='col-xl-7 d-lg-flex flex-column px-2 pb-3 pb-xl-2 info'>
                            <div className="text px-0 px-md-2 small">
                                <div className="d-flex align-items-center justify-content-between gap-3 my-2 category">
                                    <span className="catgType" style={{ background: mainLightColor, color: mainColor }}>
                                        {category}
                                    </span>
                                    <span className="flex-align-center">
                                        <span className="fs-70 fw-bold text-black2">
                                            {likes !== null && formatBigCountNumbers(Array(likes).length)}
                                        </span>
                                        <Heart className="text ms-1 fs-4 ptr me-1" />
                                    </span>
                                </div>
                                <h4 className="m-0 fs-6 text-gray-700">{name}</h4>
                                <p className="mb-2"><MapPinArea size={20} weight="fill" /> {location}</p>
                                <p className="small text-muted">{about}</p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap column-gap-3 row-gap-1 mt-lg-auto px-0 px-md-2">
                                <div className="d-flex align-items-center gap-2">
                                    <button className={`btn btn-sm flex-align-center px-3 py-1 border-2 bg-warning bg-opacity-25 text-success clickDown rounded-pill small ${closed ? 'text-decoration-line-through' : ''}`}
                                        title="View property" onClick={() => goToProperty(id)} >
                                        {/* <CurrencyDollar weight="bold" className="me-1" /> {price.toLocaleString()} */}
                                        RWF {price.toLocaleString()}
                                        {payment === 'annually' && <span className="opacity-50 fw-normal ms-1 fs-75">/year</span>}
                                        {payment === 'monthly' && <span className="opacity-50 fw-normal ms-1 fs-75">/month</span>}
                                        {payment === 'weekly' && <span className="opacity-50 fw-normal ms-1 fs-75">/week</span>}
                                        {payment === 'daily' && <span className="opacity-50 fw-normal ms-1 fs-75">/day</span>}
                                        {payment === 'hourly' && <span className="opacity-50 fw-normal ms-1 fs-75">/hour</span>}
                                        <CaretDoubleRight size={16} weight="bold" className="ms-2" /></button>
                                </div>
                                <span className="d-flex align-items-center ms-auto fw-bold small text-muted opacity-50">
                                    {type === "Apartment" && <BuildingApartment size={20} weight="duotone" className="me-1" />}
                                    {type === "House" && <HouseLine size={20} weight="duotone" className="me-1" />}
                                    {type === "Commercial" && <Storefront size={20} weight="duotone" className="me-1" />}
                                    {type === "Office" && <BuildingOffice size={20} weight="duotone" className="me-1" />}
                                    {type === "Land Plot" && <Mountains size={20} weight="duotone" className="me-1" />}
                                    {type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='badge text-gray-700 flex-center d-flex fw-normal ptr'>
                            <span>{media !== null ? propImages.length : 0} images {!isEligible ? ' (Not eligible)' : ''}</span> {videoUrl ? <span><Dot size={20} /> 1 video</span> : ''} {mapUrl ? <span><Dot size={20} /> Map</span> : ''}
                        </div>
                        {media !== null && (
                            <>
                                <div className='d-flex gap-1 mb-3 pb-2 overflow-auto'>
                                    {propImages
                                        .map((image, index) => (
                                            <img key={index} src={image.url} alt={`Image_${index + 1}`} className={`col-5 col-md-3 ${selectedImageUrl === image.url ? 'border border-warning border-3 rounded-4' : ''} trans-p3s`}
                                                onClick={() => {
                                                    if (selectedImageUrl === '') {
                                                        setSelectedImageUrl(image.url)
                                                    } else if (selectedImageUrl !== '' && selectedImageUrl !== image.url) {
                                                        setSelectedImageUrl(image.url)
                                                    } else {
                                                        setSelectedImageUrl('');
                                                    }
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                                {selectedImageUrl !== '' && (
                                    <ul className="list-unstyled flex-center flex-wrap gap-3">
                                        <li className='col-5 btn btn-sm btn-outline-secondary rounded-pill clickDown'
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customConfirmDialog({
                                                        message: (
                                                            <>
                                                                <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">Set cover image</h5>
                                                                <p>
                                                                    Set the selected image as the <b>cover image</b> for this property. <br /><br />
                                                                    A cover image is the primary image displayed for a property in listings, ensuring it stands out to potential viewers.
                                                                </p>
                                                            </>
                                                        ),
                                                        type: 'gray-700',
                                                        action: setPropertyImageCover,
                                                        closeCallback: () => setShowSelectedPropertyInfo(true),
                                                    });
                                                }
                                            }
                                        ><Image /> Set as cover</li>
                                        <li className='col-5 btn btn-sm btn-outline-danger rounded-pill clickDown'
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customConfirmDialog({
                                                        message: (
                                                            <>
                                                                <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">Delete image</h5>
                                                                <p>
                                                                    Remove/Delete selected image from this property's media
                                                                </p>
                                                            </>
                                                        ),
                                                        type: 'gray-700',
                                                        action: removePropertyImage,
                                                        closeCallback: () => setShowSelectedPropertyInfo(true),
                                                    });
                                                }
                                            }
                                        ><Trash /> Delete image</li>
                                    </ul>
                                )}
                            </>
                        )}
                    </div>

                    {/* Property editor */}
                    {!closed &&
                        <>
                            <DividerText text={!editSelectedProperty ? <><Pen className='me-1' /> EDIT DETAILS</> : <><X className='me-1' /> CLOSE EDITOR</>} type="gray-700" className="my-4 ptr" clickable onClick={() => setEditSelectedProperty(!editSelectedProperty)} />

                            <div className={`collapsible-grid-y ${editSelectedProperty ? 'working' : ''}`}>
                                <div className="collapsing-content dim-100">
                                    <div className='d-flex flex-wrap gap-2 mb-4 pb-2'>
                                        {isEligible ?
                                            <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                                onClick={
                                                    () => {
                                                        setShowSelectedPropertyInfo(false);
                                                        customConfirmDialog({
                                                            message: (
                                                                <>
                                                                    <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">{name}</h5>
                                                                    <p>
                                                                        {!listed ?
                                                                            <>Show this property in your listing</>
                                                                            :
                                                                            <>
                                                                                Hide/unlist this property from your listing. {booked ?
                                                                                    <>
                                                                                        <span className='d-block mt-2 px-3 py-2 t bg-danger text-light'>
                                                                                            This property was reseved by {bookedByLen ? (bookedByLen > 1 ? 'several customers' : 'a customer') : ''}. <b>Are you sure to continue ?</b>
                                                                                        </span>

                                                                                    </> : ''
                                                                                }
                                                                            </>
                                                                        }
                                                                    </p>
                                                                </>
                                                            ),
                                                            type: !listed ? 'gray-700' : 'warning',
                                                            action: !listed ? showProperty : hideProperty,
                                                            closeCallback: () => setShowSelectedPropertyInfo(true),
                                                        });
                                                    }
                                                }
                                            >
                                                {!listed ?
                                                    <><Eye size={16} weight='fill' className='me-2 opacity-75' /> SHOW</>
                                                    : <><EyeSlash size={16} weight='fill' className='me-2 opacity-75' /> HIDE</>
                                                }
                                            </button>
                                            :
                                            <div className="btn btn-sm btn-outline-warning border-warning border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                                onClick={() => toast({ message: 'At least 5 images are required to display this property in listing', type: 'gray-700' })}
                                            ><Eye size={16} weight='fill' className='me-2 opacity-75' /> SHOW</div>
                                        }

                                        <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customConfirmDialog({
                                                        message: (
                                                            <>
                                                                <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">{name}</h5>
                                                                <p>
                                                                    {!featured ?
                                                                        <>Mark this property as featured (Pin property)</>
                                                                        :
                                                                        <>Remove featured mark from this property (Unpin property)</>
                                                                    }
                                                                </p>
                                                            </>
                                                        ),
                                                        type: !featured ? 'gray-700' : 'warning',
                                                        action: !featured ? featureProperty : unfeatureProperty,
                                                        closeCallback: () => setShowSelectedPropertyInfo(true),
                                                    });
                                                }
                                            }
                                        >
                                            {!featured ?
                                                <><PushPinSimple size={16} weight='fill' className='me-2 opacity-75' /> PIN</>
                                                : <><PushPinSimpleSlash size={16} weight='fill' className='me-2 opacity-75' /> UNPIN</>
                                            }
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <p>
                                                                        Enter new name for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'text',
                                                            action: changePropertyName,
                                                            placeholder: 'Enter new name',
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <TextAUnderline size={16} weight='fill' className='me-2 opacity-75' /> RENAME
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current property about:</strong><br />
                                                                    <p className='fst-italic small'>
                                                                        {about}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'textarea',
                                                            action: changePropertyAbout,
                                                            placeholder: 'Enter new about',
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <TextAlignLeft size={16} weight='fill' className='me-2 opacity-75' /> EDIT ABOUT
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current location: "{location}"</strong>
                                                                    <p>
                                                                        Enter new location for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''} <br />
                                                                        {mapUrl ?
                                                                            <small className='text-warning'>
                                                                                You might also need to change the property's location map.
                                                                            </small>
                                                                            : ''
                                                                        }
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'text',
                                                            action: changePropertyLocation,
                                                            placeholder: 'Enter new location',
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <MapPinArea size={16} weight='fill' className='me-2 opacity-75' /> EDIT LOCATION
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current price: "{price.toLocaleString()} RWF"</strong>
                                                                    <p>
                                                                        Enter new price for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'number',
                                                            action: changePropertyPrice,
                                                            placeholder: 'Enter new price',
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <MoneyWavy size={16} weight='fill' className='me-2 opacity-75' /> EDIT PRICE
                                        </button>

                                        <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current payment method: "{payment}"</strong>
                                                                    <p>
                                                                        Select a new payment method for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'select',
                                                            selectOptions: ['once', 'annually', 'monthly', 'weekly', 'daily', 'hourly', { default: payment }],
                                                            action: changePropertyPayment,
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <Money size={16} weight='fill' className='me-2 opacity-75' /> EDIT PAYMENT
                                        </button>

                                        <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current type: "{type}"</strong>
                                                                    <p>
                                                                        Select a new type for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'select',
                                                            selectOptions: ['Apartment', 'House', 'Office', 'Commercial', 'Land Plot', { default: type }],
                                                            action: changePropertyType,
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <Building size={16} weight='fill' className='me-2 opacity-75' /> EDIT TYPE
                                        </button>

                                        <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                            onClick={
                                                () => {
                                                    setShowSelectedPropertyInfo(false);
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <strong>Current category: "{category}"</strong>
                                                                    <p>
                                                                        Select a new category for the property. {booked ? 'This change will be communicated to those who reserved the property.' : ''}
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'select',
                                                            selectOptions: ['For Sale', 'For Rent', { default: category }],
                                                            action: changePropertyCategory,
                                                        }
                                                    )
                                                }
                                            }
                                        >
                                            <Swap size={16} weight='fill' className='me-2 opacity-75' /> EDIT CATEGORY
                                        </button>

                                        <hr className='w-100 my-2 opacity-0' />

                                        {(media === null || (media !== null || JSON.parse(media).images.length < 25)) &&
                                            <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown"
                                                onClick={() => { setShowAddImageForm(true); setShowAddVideoForm(false) }}
                                            >
                                                <Image size={16} weight='fill' className='me-2 opacity-75' /> ADD IMAGE
                                            </button>
                                        }

                                        <button type="button" className={`btn btn-sm btn-outline-${!videoUrl ? 'secondary' : 'danger'} border-${!videoUrl ? 'secondary' : 'danger'} border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown`}
                                            onClick={() => {
                                                if (videoUrl) {
                                                    setShowSelectedPropertyInfo(false);
                                                    customConfirmDialog({
                                                        message: (
                                                            <>
                                                                <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">{name}</h5>
                                                                <p>Remove video footage from this property</p>
                                                            </>
                                                        ),
                                                        type: 'warning',
                                                        action: removePropertyVideo,
                                                    });
                                                } else {
                                                    setShowAddImageForm(false);
                                                    setShowAddVideoForm(true);
                                                }
                                            }}
                                        >
                                            <Video size={16} weight='fill' className='me-2 opacity-75' />
                                            {!videoUrl ?
                                                <>ADD VIDEO</>
                                                : <>REMOVE VIDEO</>
                                            }
                                        </button>

                                        <button type="button" className={`btn btn-sm btn-outline-${!mapUrl ? 'secondary' : 'danger'} border-${!mapUrl ? 'secondary' : 'danger'} border-opacity-50 flex-center px-3 rounded-pill fs-75 clickDown`}
                                            onClick={() => {
                                                setShowSelectedPropertyInfo(false);
                                                if (mapUrl) {
                                                    customConfirmDialog({
                                                        message: (
                                                            <>
                                                                <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">{name}</h5>
                                                                <p>Remove location map from this property</p>
                                                            </>
                                                        ),
                                                        type: 'warning',
                                                        action: removePropertyMap,
                                                    });
                                                } else {
                                                    customPrompt(
                                                        {
                                                            message: (
                                                                <>
                                                                    <h5 className='h6 border-bottom mb-3 pb-2'><CheckSquare size={25} weight='fill' className='opacity-50' /> {name}</h5>
                                                                    <p>
                                                                        Paste here a link for the property's location map.<br /><strong> Make sure to copy the embed link</strong> from Google Maps.
                                                                    </p>
                                                                </>
                                                            ),
                                                            inputType: 'text',
                                                            action: addPropertyMap,
                                                            placeholder: 'Paste link',
                                                        }
                                                    )
                                                }
                                            }}
                                        >
                                            <MapTrifold size={16} weight='fill' className='me-2 opacity-75' />
                                            {!mapUrl ?
                                                <>ADD LOCATION MAP</>
                                                : <>REMOVE LOCATION MAP</>
                                            }
                                        </button>

                                        <hr className='w-100 my-2 opacity-0' />
                                        {/* Image form */}
                                        {showAddImageForm && (
                                            <div className="w-100 p-3 bg-gray-300 small add-property-image">
                                                <h6 className='flex-align-center text-gray-600'><Image size={20} weight="fill" className='me-1' /> Add Property Image</h6>
                                                <div className="flex-align-center flex-wrap gap-2 mb-3">
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg, image/jpg, image/png"
                                                        name="propImage"
                                                        id="propImage"
                                                        className="form-control rounded-0 file-input"
                                                        onChange={handleImageFileChange}
                                                    />
                                                    <p className={`${imageFileName ? 'text-success' : ''} mb-0 px-2`}>{imageFileName || "No file chosen"}</p>
                                                </div>
                                                <div className="modal-footer justify-content-around">
                                                    <button
                                                        type="button"
                                                        className={`col-5 btn btn-sm text-secondary border-0 ${isWaitingAdminEditAction ? 'opacity-25' : 'opacity-75'
                                                            } clickDown`}
                                                        disabled={isWaitingAdminEditAction}
                                                        onClick={() => { setImageFileName(null); setShowAddImageForm(false) }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="col-5 btn btn-sm btn-secondary flex-center px-3 rounded-pill clickDown"
                                                        id="uploadImage"
                                                        onClick={addPropertyImage}
                                                        disabled={imageFileName === null || isWaitingAdminEditAction}
                                                    >
                                                        {!isWaitingAdminEditAction ? (
                                                            <>
                                                                Submit <CaretRight size={18} className="ms-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Working <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {/* Video form */}
                                        {showAddVideoForm && (
                                            <div className="w-100 p-3 bg-gray-300 small add-property-video">
                                                <h6 className='flex-align-center text-gray-600'><Video size={20} weight="fill" className='me-1' /> Add Property Video</h6>
                                                <div className="flex-align-center flex-wrap gap-2 mb-3">
                                                    <input
                                                        type="file"
                                                        accept="video/mp4, video/quicktime, video/x-msvideo, video/x-matroska, video/3gpp"
                                                        name="propVideo"
                                                        id="propVideo"
                                                        className="form-control rounded-0 file-input"
                                                        onChange={handleVideoFileChange}
                                                    />
                                                    <p className={`${videoFileName ? 'text-success' : ''} mb-0 px-2`}>{videoFileName || "No file chosen"}</p>
                                                </div>
                                                <div className="modal-footer justify-content-around">
                                                    <button
                                                        type="button"
                                                        className={`col-5 btn btn-sm text-secondary border-0 ${isWaitingAdminEditAction ? 'opacity-25' : 'opacity-75'
                                                            } clickDown`}
                                                        disabled={isWaitingAdminEditAction}
                                                        onClick={() => { setVideoFileName(null); setShowAddVideoForm(false) }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="col-5 btn btn-sm btn-secondary flex-center px-3 rounded-pill clickDown"
                                                        id="uploadVideo"
                                                        onClick={addPropertyVideo}
                                                        disabled={videoFileName === null || isWaitingAdminEditAction}
                                                    >
                                                        {!isWaitingAdminEditAction ? (
                                                            <>
                                                                Submit <CaretRight size={18} className="ms-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Working <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <button type="button" className="btn btn-sm btn-outline-secondary border-secondary border-opacity-50 flex-center my-2 px-3 rounded-pill w-100 fs-75 clickDown"
                                            onClick={() => setEditSelectedProperty(true)}
                                        >
                                            <Pen size={16} weight='fill' className='me-2 opacity-75' /> EDIT MORE
                                        </button>

                                        <hr className='w-100 my-2 opacity-0' />

                                        {/* {booked && !closed && */}
                                        {!closed && listed && (
                                            <>
                                                {/* Toggle Close Property Form */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-success flex-center px-3 py-2 rounded-0 w-100 fs-75 clickDown"
                                                    onClick={() => { setShowSelectedPropertyInfo(false); setShowClosePropertyForm(true) }}
                                                >
                                                    <SealCheck size={16} weight="fill" className="me-2 opacity-75" /> CLOSE PROPERTY
                                                </button>
                                            </>
                                        )}
                                        {/* <hr class /> */}

                                        <DividerText text="DANGER ZONE" className="my-4 mx-auto text-danger ptr" clickable onClick={() => setShowSelectedPropertyDangerZone(!showSelectedPropertyDangerZone)} />
                                        {showSelectedPropertyDangerZone && (
                                            <div className="border border-danger border-opacity-25 p-3 rounded bg-light-danger small">
                                                <p className="text-danger-emphasis mb-3">
                                                    <Warning className='me-1' />
                                                    Actions performed in this section are <u>irreversible</u>. Proceed with caution!
                                                </p>

                                                <ul className="mb-3">
                                                    <li className="mb-2">
                                                        <span className="text-danger">Clear Bookings:</span> Removes all booking records associated with this property.
                                                    </li>
                                                    <li>
                                                        <span className="text-danger">Reset Status:</span> Resets the property's status to its default state.
                                                    </li>
                                                    <li className="mb-2">
                                                        <span className="text-danger">Delete Property:</span> Permanently deletes the property, including all associated media (images, videos, etc.).
                                                    </li>
                                                </ul>

                                                <div className="alert alert-danger d-flex align-items-start rounded-0">
                                                    <i className="bi bi-shield-exclamation me-3 fs-5"></i>
                                                    <div>
                                                        <strong>Warning:</strong> Make sure to double-check these actions. Deleted data cannot be recovered.
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger flex-center px-3 py-2 rounded-0 w-100 fs-75 clickDown"
                                                    onClick={() => {
                                                        setShowSelectedPropertyInfo(false);
                                                        customConfirmDialog({
                                                            message: (
                                                                <>
                                                                    <h5 className="h6 border-bottom border-dark border-opacity-25 mb-3 pb-2">{name}</h5>
                                                                    <p>
                                                                        {/* General message for deleting a property */}
                                                                        {!listed ? (
                                                                            <>{`You are about to delete this property from your listing.`}</>
                                                                        ) : (
                                                                            <>
                                                                                {`You are about to delete this property from your listing. `}
                                                                                {booked ? (
                                                                                    <span className="d-block mt-2 px-3 py-2 bg-warning text-dark">
                                                                                        <b>Warning:</b> This property is reserved by {bookedByLen ? (bookedByLen > 1 ? 'several customers' : 'a customer') : 'no one'}.
                                                                                        <br />
                                                                                        <b>Are you sure you want to delete this property and all associated media?</b>
                                                                                        <br />
                                                                                        <b>This action cannot be undone!</b>
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="d-block mt-2 px-3 py-2 bg-info text-dark">
                                                                                        <b>Info:</b> This property is listed but not currently reserved.
                                                                                    </span>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        <br />
                                                                        {closed && (
                                                                            <span className="d-block mt-2 px-3 py-2 bg-secondary text-dark">
                                                                                <b>This property has been marked as closed.</b>
                                                                                <br />
                                                                                <b>Are you sure you want to permanently delete this record and all associated media?</b>
                                                                            </span>
                                                                        )}
                                                                        <br />
                                                                        <span className="d-block mt-2">
                                                                            Deleting this property will remove all associated media (images, videos, etc.) and it cannot be recovered.
                                                                        </span>
                                                                    </p>
                                                                </>
                                                            ),
                                                            type: 'danger',
                                                            action: handleDeleteProperty,
                                                            closeCallback: () => setShowSelectedPropertyInfo(true),
                                                        });
                                                    }}
                                                >
                                                    <Trash size={16} weight="fill" className="me-2 opacity-75" /> DELETE PROPERTY
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </>
        )
    }

    // Closed properties report
    const [showClosedPropertiesReport, setShowClosedPropertiesReport] = useState(false);
    const ClosedPropertiesReport = () => {
        const [openGroups, setOpenGroups] = useState({});

        // cLog(closedProperties);

        // Helper function to group properties by month and year
        const groupByMonthYear = (properties) => {
            const grouped = {};

            properties.forEach((property) => {
                const closedDate = new Date(property.closedOn);
                const month = closedDate.toLocaleString("default", { month: "long" });
                const year = closedDate.getFullYear();
                const key = `${year} - ${month}`;

                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(property);
            });

            return grouped;
        };

        const toggleGroup = (key) => {
            setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
        };

        const groupedProperties = groupByMonthYear(closedProperties);

        return (
            <div className="mt-4">
                <h3 className="h6 flex-align-center mb-4 px-2 py-2 bg-gray-300 text-gray-600 peak-borders-b"><Calendar className='me-2 opacity-50' /> Closed Properties Monthly Report</h3>
                {Object.entries(groupedProperties).length === 0 ? (
                    <p className="text-muted">No closed properties to display.</p>
                ) : (
                    Object.entries(groupedProperties).map(([key, properties]) => {
                        const totalClosed = properties.length;

                        return (
                            <div key={key} className="mb-2 border-bottom border-2 rounded">
                                {/* Group Header */}
                                <div
                                    className="bg-light p-3 d-flex justify-content-between align-items-center cursor-pointer"
                                    onClick={() => toggleGroup(key)}
                                >
                                    <div>
                                        <h5 className="mb-0 text-gray-700">
                                            {key} <span className="text-success small fw-normal"><CaretRight /> <span style={{ textDecoration: '1px dotted underline', textUnderlineOffset: '3px' }}>{totalClosed} Closed</span></span>
                                        </h5>
                                    </div>
                                    <CaretDown
                                        size={20}
                                        className={`transition ${openGroups[key] ? "rotate-180" : ""}`}
                                    />
                                </div>

                                {/* Property List */}
                                {openGroups[key] && (
                                    <ul className="list-group list-group-flush px-1" style={{ borderBottom: '3px double var(--bs-success)' }}>
                                        {properties.map((property, index) => {
                                            const { name, price, payment, closedOn, closedBy } = property;

                                            return (
                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-start border-0 border-start border-gray-200 border-2 mb-2"
                                                >
                                                    <div className="w-100 d-flex flex-wrap column-gap-3 row-gap-2 align-items-end text-gray-700">
                                                        <div className="ms-md-2 me-auto">
                                                            <h6 className='flex-align-center text-bg-secondary w-fit px-1 smaller'><CalendarCheck className='me-1' /> {new Date(closedOn).toLocaleDateString()}</h6>
                                                            <div className="flex-align-center fw-semibold">{name} <Info weight="bold" size={17} className='ms-2 opacity-75 ptr clickDown' title="Preview" onClick={() => { setSelectedProperty(property); setShowSelectedPropertyInfo(true) }} /></div>
                                                            <small className='d-flex flex-wrap column-gap-1'>
                                                                <span>
                                                                    Price:{" "}<span>RWF {price.toLocaleString()}</span>
                                                                </span>
                                                                <span> | {payment}</span>
                                                            </small>
                                                        </div>
                                                        <div className="small">
                                                            Closed By: <br />
                                                            <span>{closedBy}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        );
    };

    // __Customers
    const [customers, setCustomers] = useState([]);
    const [customersToShow, setCustomersToShow] = useState(customers);
    const [showOnlyActiveCustomers, setShowOnlyActiveCustomers] = useState(false); // Customers with open deals
    const [activeCustomers, setActiveCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [errorLoadingCustomers, setErrorLoadingCustomers] = useState(false);
    const totalCustomers = customers.length;


    const [activeUsersCustomers, setActiveUsersCustomers] = useState(false);
    const [activeUsersSubscribers, setActiveUsersSubscribers] = useState(true);

    const seeCustomers = () => {
        setActiveUsersCustomers(true);
        setActiveUsersSubscribers(false);
    }
    const seeSubscribers = () => {
        setActiveUsersCustomers(false);
        setActiveUsersSubscribers(true);
    }

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCustomers(data);
            setCustomersToShow(data);
            setErrorLoadingCustomers(null);
        } catch (error) {
            setErrorLoadingCustomers("Failed to load customers. Click the button to try again.");
            cError("Error fetching customers:", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // TBC

    // Active customers
    // if (customers && bookedProperties) {
    //     const bookedIDs = bookedProperties
    //         .filter(property => !property.closed)
    //         .map(property => property.id);

    //     // Get active customers
    //     const withActiveProperty = customers
    //         .filter(customer => {
    //             let bookedArray = [];
    //             if (customer.orders) {
    //                 try {
    //                     bookedArray = JSON.parse(customer.orders);
    //                 } catch (parseError) {
    //                     cError("Error parsing customer.orders array:", parseError);
    //                 }
    //             }
    //             return bookedArray.some(item => bookedIDs.includes(item));
    //         }
    //         );

    //     setActiveCustomers(withActiveProperty);
    //     cLog(activeCustomers);
    // }


    // __Subscribers
    const [subscribers, setSubscribers] = useState([]);
    const [subscribersToShow, setSubscribersToShow] = useState(subscribers);
    // 
    const [showSelectedSubscriberInfo, setShowSelectedSubscriberInfo] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState([]);
    const [refreshSubscribers, setRefreshSubscribers] = useState(false);

    const [loadingSubscribers, setLoadingSubscribers] = useState(false);
    const [errorLoadingSubscribers, setErrorLoadingSubscribers] = useState(false);
    const totalSubscribers = subscribers.length;
    // cLog(totalSubscribers);

    // Fetch subscribers
    const fetchSubscribers = async () => {
        try {
            setLoadingSubscribers(true);
            const response = await fetch(`${BASE_URL}/subscribers`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSubscribers(data);
            setSubscribersToShow(data);
            setErrorLoadingSubscribers(null);
        } catch (error) {
            setErrorLoadingSubscribers("Failed to load subscribers. Click the button to try again.");
            cError("Error fetching subscribers:", error);
        } finally {
            setLoadingSubscribers(false);
        }
    };

    // Unsubscribe a subscriber

    const unsubscribeSubscriber = async () => {
        try {
            setIsWaitingAdminEditAction(true);
            const response = await fetch(`${BASE_URL}/subscription/${selectedSubscriber.email}/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error unsubscribing the subscriber');
            }
            const data = await response.json();
            resetConfirmDialog();
            setShowSelectedSubscriberInfo(false);
            fetchSubscribers();
            toast({ message: data.message, type: 'gray-700' });
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
        } finally {
            setIsWaitingAdminEditAction(false);
            setConfirmDialogActionWaiting(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    // Refreshment
    useEffect(() => {
        if (refreshSubscribers) {
            fetchSubscribers();
        }
    }, [refreshSubscribers]);

    // Search user (Customer/Subscriber)
    const userSearcherRef = useRef();
    const [userSearchValue, setUserSearchValue] = useState('');

    const filterUsersBySearch = useCallback(() => {
        let searchString = userSearcherRef.current.value.trim();
        if (searchString !== null || searchString !== undefined || searchString !== '') {
            setUserSearchValue(searchString);
            let filteredUsers;
            if (activeUsersCustomers) { // Customer case
                filteredUsers = customers.filter(val => (
                    val.name.toLowerCase().includes(searchString) ||
                    val.email.toLowerCase().includes(searchString)
                ));
                setCustomersToShow(filteredUsers);
            } else if (activeUsersSubscribers) { // Subscriber case
                filteredUsers = subscribers.filter(val => (
                    val.email.toLowerCase().includes(searchString)
                ));
                setSubscribersToShow(filteredUsers);
            }
        }
    }, [customers, subscribers, activeUsersCustomers, activeUsersSubscribers]);

    // Subsc preview card
    const SubscriberPreview = ({ setRefreshSubscribers }) => {
        const { email, createdAt, updatedAt } = selectedSubscriber;

        return (
            <>
                <h5 className='flex-center mb-4 fs-5 fw-bold text-gray-600'><BellRinging weight='fill' className='me-2 opacity-50' /> Subscriber</h5>
                <div className='flex-align-center flex-wrap mb-4 bg-gray-300 p-2 rounded'>
                    <User size={30} className='opacity-50' />
                    <span className='mx-auto'>{email}</span>
                </div>

                <div className='mb-4 px-2'>
                    <div className='d-flex mb-2 px-sm-2 border-bottom smaller'>
                        <div className='col-6 p-2 fw-bold text-gray-600'>
                            {createdAt !== updatedAt ? 'First ' : ''}Subscription:
                        </div>
                        <div className='col-6 p-2 border-start ps-2'>
                            {formatDate(createdAt, { todayKeyword: true, longMonthFormat: true })}
                        </div>
                    </div>
                    {createdAt !== updatedAt && (
                        <div className='d-flex mb-2 px-sm-2 border-bottom smaller'>
                            <div className='col-6 p-2 fw-bold text-gray-600'>
                                Updated Subscription:
                            </div>
                            <div className='col-6 p-2 border-start ps-2'>
                                {formatDate(updatedAt, { todayKeyword: true, longMonthFormat: true })}
                            </div>
                        </div>
                    )}
                </div>

                <ul className='list-unstyled d-flex m-0 px-3 py-0'>
                    <li className='rounded-pill ms-auto btn btn-sm btn-dark'
                        onClick={
                            () => {
                                setShowSelectedPropertyInfo(false);
                                customConfirmDialog({
                                    message: (
                                        <>
                                            <h5 className="h6 border-bottom mb-3 pb-2">{email}</h5>
                                            <p>
                                                If unsubscriberd, they will not receive any updates on your properties listing.<br /><br />
                                                Are you sure to continue?
                                            </p>
                                        </>
                                    ),
                                    action: unsubscribeSubscriber,
                                    closeText: 'Cancel',
                                });
                            }
                        }
                    ><BellSimpleSlash /> Unsubscribe</li>
                </ul>
            </>
        )
    }

    // __Messages
    const [messages, setMessages] = useState([]);
    const [messagesToShow, setMessagesToShow] = useState(messages);
    const [showOnlyUnrepliedMessages, setShowOnlyUnrepliedMessages] = useState(false);
    const [notRepliedMessages, setNotRepliedMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorLoadingMessages, setErrorLoadingMessages] = useState(false);
    // Fetch messages
    const fetchMessages = async () => {
        try {
            setLoadingMessages(true);
            const response = await fetch(`${BASE_URL}/messages`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
            setNotRepliedMessages(data.filter(item => !item.replied));
            setErrorLoadingMessages(null);
        } catch (error) {
            setErrorLoadingMessages("Failed to load messages. Click the button to try again.");
            cError("Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Reset user filter
    useEffect(() => {
        if (userSearchValue === '') {
            setCustomersToShow(customers);
            setSubscribersToShow(subscribers);
        }
        // fetchMessages();
    }, [customers, subscribers, userSearchValue]);

    // Toggle unreplied
    useEffect(() => {
        showOnlyUnrepliedMessages
            ? setMessagesToShow(notRepliedMessages)
            : setMessagesToShow(messages);
    }, [showOnlyUnrepliedMessages, notRepliedMessages, messages]);

    // cLog(messages);

    // Reply to messages
    const [showContactUsMessage, setShowContactUsMessage] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    // _Handle Reply
    const handleMessageReply = async (e, messageItem) => {
        if (e) e.preventDefault();

        // Ensure the reply message is not empty
        if (!replyMessage.trim()) {
            toast({ message: "Reply message cannot be empty", type: "warning" });
            return;
        }

        try {
            setSendingReply(true);
            const response = await fetch(`${BASE_URL}/message/${messageItem.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyMessage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            toast({ message: data.message, type: 'dark' });

            // Clear the reply message and refresh the messages list
            setShowContactUsMessage(false);
            setReplyMessage('');
            setTimeout(() => {
                fetchMessages();
            }, 1000);
        } catch (error) {
            cError('Error:', error.message);
            toast({ message: error.message, type: 'warning' });
        } finally {
            setSendingReply(false);
        }
    };

    // __Settings

    // Site common setting
    const {
        businessProfileSettings,
        loadingBusinessProfileSettings,
        errorLoadingBusinessProfileSettings,
        fetchBusinessProfileSettings,
        propertySettings,
        loadingPropertySettings,
        errorLoadingPropertySettings,
        fetchPropertySettings,
    } = useSettings();

    /**
     * Sections
    */

    const Dashboard = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 section-about'>
                <h1 className='text-center mb-4 fw-bold text-secondary'>Dashboard</h1>
                <div className="d-xl-flex pt-xl-4">
                    <div className="p-4 small col-xl-8 clip-text-gradient">
                        <p className="mb-3 text-justify">
                            <span className='fs-3'>Welcome</span> <br />
                            With admin tools, you can manage and oversee various aspects of your platform efficiently. ___ You can can perform different activities:
                        </p>
                        <ul className="mb-0 list-unstyled">
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Manage Content:</b> Edit and organize your properties database.</li>
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Manage Users:</b> View and control user accounts.</li>
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Monitor Activity:</b> Keep track of site activities and user interactions.</li>
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Settings:</b> Customize and configure system settings.</li>
                        </ul>
                        <a href="#siteStats" className='btn brn-lg d-grid d-xl-none mx-auto mt-4 mt-md-5 text-decoration-none border-0 fw-bold fs-4' style={{ placeItems: 'center' }}>
                            Site activity <CaretDown className='ms-2 opacity-50' />
                        </a>
                    </div>
                    <div className='d-none d-xl-block col-xl-4 py-3 text-gray-600 clickDown peak-borders-b clip-path-heptagon'
                        style={{ backgroundImage: 'linear-gradient(150deg, rgba(195, 133, 0, .15), rgba(39, 128, 157, .15))' }}
                    >
                        <div className='dim-100 flex-center'>
                            <ul className='list-unstyled m-0'>
                                <li className="my-3 py-1 ptr">
                                    <a href="#siteStats" className='text-decoration-none text-gray-600 fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Site activity </a>
                                </li>
                                <li className="my-3 py-1 ptr"
                                    onClick={() => setActiveSection("properties")}
                                >
                                    <span className='fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Properties </span>
                                </li>
                                <li className="my-3 py-1 ptr"
                                    onClick={() => setActiveSection("orders")}
                                >
                                    <span className='fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Orders </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Content : Statistics */}
            <div className="container my-5 px-0 py-4 section-content">
                <h3 className="mb-5 flex-center gap-2 text-primaryColorDark fw-bold">
                    <ChartBar weight='duotone' />
                    <span>Site activity</span>
                </h3>
                <div className="mb-3 d-flex flex-wrap" id='siteStats'>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("properties")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Properties</span>
                            <span className="display-5 mx-auto">{totalProperties}</span>
                        </div>
                        <Building size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("orders")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Orders</span>
                            <span className="display-5 mx-auto">{openDealsNum}</span>
                        </div>
                        <ShoppingCart size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("messages")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Messages</span>
                            <span className="display-5 mx-auto">{notRepliedMessages.length}</span>
                        </div>
                        <ChatDots size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("usersList")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Customers</span>
                            <span className="display-5 mx-auto">29</span>
                        </div>
                        <User size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("usersList")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Subscribers</span>
                            <span className="display-5 mx-auto">{totalSubscribers}</span>
                        </div>
                        <BellRinging size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                    <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("reports")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Closed deals</span>
                            <span className="display-5 mx-auto">{closedPropertiesNum}</span>
                        </div>
                        <CircleWavyCheck size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div>
                </div>
            </div>
        </section>
    );

    const Properties = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Properties</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Access and update the complete list of properties available on the platform, including details and availability.
                    </div>
                </div>
                <Building size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : All Properties */}
            <div className="container my-5 px-0 py-4 section-content">
                {/* Loading */}
                {loadingProperties && <LoadingBubbles icon={<Building size={50} className='loading-skeleton' />} />}
                {/* Error */}
                {!loadingProperties && errorLoadingProperties && (
                    <FetchError
                        errorMessage="Failed to load properties. Click the button to try again"
                        refreshFunction={() => fetchProperties()}
                        className="mb-5 mt-4"
                    />
                )}
                {/* Zero content */}
                {!loadingProperties && !errorLoadingProperties && totalProperties === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                        <Building size={80} className="dblock text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            No properties yet. Upload properties to be listed on your website and you can manage them from here.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingProperties && !errorLoadingProperties && totalProperties > 0 &&
                    <>
                        {/* Filters */}
                        <div className='d-flex flex-wrap gap-2 mb-3 pb-2 overflow-auto'>
                            <div className={`d-flex align-items-center w-fit text-nowrap ${showAllAvailableProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showAllProperties()}
                            >
                                <span className={`small d-flex align-items-center ${showAllAvailableProperties ? 'text-light' : 'text-gray-700'}`}>All</span>
                                <span className={`badge w-fit ms-2 p-1 ${showAllAvailableProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{totalProperties}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyListedProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyListed()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyListedProperties ? 'text-light' : 'text-gray-700'}`}>Listed</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyListedProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{listedPropertiesNum}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyUnlistedProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyUnlisted()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyUnlistedProperties ? 'text-light' : 'text-gray-700'}`}>Unlisted</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyUnlistedProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{unlistedPropertiesNum}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyLiveProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyLiveDeals()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyLiveProperties ? 'text-light' : 'text-gray-700'}`}><Building weight='fill' className='me-1' /> Live</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyLiveProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{livePropertiesNum}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyFeaturedProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyFeatured()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyFeaturedProperties ? 'text-light' : 'text-gray-700'}`}><PushPinSimple weight='fill' className='me-1' /> Featured</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyFeaturedProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{featuredPropertiesNum}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyReservedProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyReserved()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyReservedProperties ? 'text-light' : 'text-gray-700'}`}><Bookmark weight='fill' className='me-1' /> Reserved</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyReservedProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{bookedPropertiesNum}</span>
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyForSaleProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyForSale()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyForSaleProperties ? 'text-light' : 'text-gray-700'}`}><CreditCard weight='fill' className='me-1' /> For sale</span>
                                {showOnlyForSaleProperties &&
                                    <span className={`badge w-fit ms-2 p-1 text-light border border-light border-opacity-25 fw-normal`}>{forSalePropertiesNum}</span>
                                }
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyForRentProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyForRent()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyForRentProperties ? 'text-light' : 'text-gray-700'}`}><HandCoins weight='fill' className='me-1' /> For rent</span>
                                {showOnlyForRentProperties &&
                                    <span className={`badge w-fit ms-2 p-1 text-light border border-light border-opacity-25 fw-normal`}>{forRentPropertiesNum}</span>
                                }
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyClosedProperties ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`}
                                onClick={() => showOnlyClosedDeals()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyClosedProperties ? 'text-light' : 'text-gray-700'}`}><SealCheck weight='fill' className='me-1' /> Closed</span>
                                {showOnlyClosedProperties &&
                                    <span className={`badge w-fit ms-2 p-1 ${showOnlyClosedProperties ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{closedPropertiesNum}</span>
                                }
                            </div>

                            <div className={`d-flex align-items-center w-fit text-nowrap border border-primary border-opacity-25 rounded-3 px-2 py-1 small ptr`}
                                onClick={() => setActiveSection('orders')}
                            >
                                <span className='small text-primary'>Open Deals</span>
                                <span className="badge w-fit ms-2 p-1 border border-primary border-opacity-25 text-primary fw-normal">{openDealsNum}</span>
                            </div>
                        </div>

                        {/* Searcher */}
                        <div className={`col-12 col-md-8 col-xl-5  mx-auto mb-3 position-relative p-1 ps-2 border border-2 border-black4 bg-bodi target-input search-box`}>
                            <MagnifyingGlass weight='bold' className='flex-grow-1 text-black2 opacity-75' />
                            <input ref={propSearcherRef} type="text" placeholder="Search property" className="border-0 search-box__input" id="propertySearcher" style={{ minWidth: "10rem" }}
                                onKeyUp={e => { (e.key === "Enter") && filterPropertiesBySearch() }}
                            />
                            {propSearchValue !== '' && (
                                <button className="fa fa-close r-middle-m ratio-1-1 rounded-circle border-0 bg-transparent text-gray-500"
                                    onClick={() => { propSearcherRef.current = ''; showAllProperties(); setPropertiesToShow(allProperties) }}
                                ></button>
                            )
                            }
                        </div>

                        {/* View and search toggler */}
                        <ul className='d-flex justify-content-center gap-2 mb-2 list-unstyled'>
                            <li className={`flex-align-center p-2 ${propertyListingFormat === 'list' ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={() => setPropertyListingFormat('list')}>
                                <ListDashes weight='fill' className='me-1' /> List
                            </li>
                            <li className={`flex-align-center p-2 ${propertyListingFormat === 'table' ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={() => setPropertyListingFormat('table')}>
                                <Table weight='fill' className='me-1' /> Table
                            </li>
                            <li className={`flex-align-center ms-3 p-2 text-gray-600 ptr clickDown`}
                                title={sortPropertyAscending ? 'Sort by New - Old' : 'Sort by Old - New'}
                                onClick={() => setSortPropertyAscending(!sortPropertyAscending)}>
                                {sortPropertyAscending ?
                                    <SortAscending size={20} />
                                    : <SortDescending size={20} />
                                }
                            </li>
                            <li className="flex-align-center p-2 text-gray-600 ptr clickDown"
                                title="Property types"
                                data-bs-toggle="dropdown" id="filterByType">
                                <Building size={20} /> <CaretDown size={10} className='ms-1' />
                            </li>
                            <div className="dropdown-menu me-1 me-sm-0 filter-options" aria-labelledby="filterByType">
                                <ul className='list-unstyled mb-0'>
                                    {aboutProperties.allTypes
                                        .sort((a, b) =>
                                            a.localeCompare(b)
                                        )
                                        .map((val, index) => (
                                            <li key={index} className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                                onClick={() => { propSearcherRef.current.value = val; filterPropertiesByType() }}>
                                                {val}s
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </ul>

                        {/* Search Zero content */}
                        {propSearchValue !== '' && propertiesToShow.length === 0 && (
                            <FetchError
                                errorMessage="No match properties found."
                                retryKeyword="Refresh"
                                refreshFunction={() => { propSearcherRef.current.value = ''; showAllProperties(); setPropertiesToShow(allProperties) }}
                                className="mb-5 mt-4"
                            />
                        )}

                        {/* Filted content - list view*/}
                        {propertyListingFormat === 'list' &&
                            <div className='overflow-auto' style={{ minHeight: '50dvh', maxHeight: '100dvh' }}>
                                {propertiesToShow
                                    .sort((a, b) =>
                                        new Date(sortPropertyAscending ? a.createdAt : b.createdAt)
                                        - new Date(sortPropertyAscending ? b.createdAt : a.createdAt)
                                    )
                                    .map((property, index) => {
                                        const type = property.type;
                                        const payment = property.payment;
                                        const date = property.createdAt;
                                        const mainColor = property.category === "For Sale" ? "#25b579" : "#ff9800";

                                        const isActive = (property.booked && !property.closed) || false;
                                        const isClosed = (property.closed) || false;
                                        const isUnlisted = !property.listed || false;

                                        return (
                                            <div key={index} className={`flex-align-center p-2 ${isActive ? 'border-start border-primary' : (isClosed && !showOnlyClosedProperties) ? 'opacity-50' : isUnlisted ? 'border-start border-warning' : ''} ${isUnlisted ? 'fst-italic' : ''} border-2 ptr clickDown`}
                                                onClick={() => { setShowSelectedPropertyInfo(true); setSelectedProperty(property) }}
                                            >
                                                <div className='pe-2'>
                                                    {
                                                        type === 'Apartment' ? <BuildingApartment size={20} weight='duotone' className='text' />
                                                            : type === 'House' ? <HouseLine size={20} weight='duotone' className='text' />
                                                                : type === 'Commercial' ? <Storefront size={20} weight='duotone' className='text' />
                                                                    : type === 'Office' ? <BuildingOffice size={20} weight='duotone' className='text' />
                                                                        : type === 'Land Plot' ? <Mountains size={20} weight='duotone' className='text' />
                                                                            : <Building size={20} weight='duotone' className='text' />
                                                    }
                                                </div>
                                                <div className='flex-grow-1 d-sm-flex align-items-center gap-2 px-2'>
                                                    <div className='col-sm-6 mb-2 mb-sm-0'>
                                                        <h6 className='m-0'>{property.name}</h6>
                                                        <div className='fs-75 text-gray-600'> {property.location}</div>
                                                    </div>
                                                    <div className='col-sm-6 d-flex align-items-center d-sm-block small px-sm-3'>
                                                        <div>
                                                            <span style={{ color: mainColor }}>
                                                                {property.category}
                                                            </span> - <span className='text-nowrap'>
                                                                RWF {property.price.toLocaleString()}
                                                                {payment === 'once' && <span className="opacity-50 fw-normal ms-1 smaller">/once</span>}
                                                                {payment === 'annually' && <span className="opacity-50 fw-normal ms-1 smaller">/year</span>}
                                                                {payment === 'monthly' && <span className="opacity-50 fw-normal ms-1 smaller">/month</span>}
                                                                {payment === 'weekly' && <span className="opacity-50 fw-normal ms-1 smaller">/week</span>}
                                                                {payment === 'daily' && <span className="opacity-50 fw-normal ms-1 smaller">/day</span>}
                                                                {payment === 'hourly' && <span className="opacity-50 fw-normal ms-1 smaller">/hour</span>}
                                                            </span>
                                                        </div>
                                                        <div className='ms-auto ps-2 ps-sm-0 fs-75'>
                                                            {formatDate(date)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }

                        {/* Filted content - table view */}
                        {propertyListingFormat === 'table' &&
                            <div className='overflow-auto' style={{ minHeight: '50dvh', maxHeight: '100dvh' }}>
                                <table className="table table-hover table-borderless h-100 properties-table">
                                    <thead className='table-primary position-sticky top-0 inx-1'>
                                        <tr>
                                            <th className='ps-sm-3 py-3 text-nowrap text-gray-700'>N</th>
                                            <th className='py-3 text-nowrap text-gray-700' style={{ minWidth: '10rem' }}>Name</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Type</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Price <sub className='fs-60'>/RwF</sub></th>
                                            <th className='py-3 text-nowrap text-gray-700'>Category</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Location</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Date</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propertiesToShow
                                            .sort((a, b) =>
                                                new Date(sortPropertyAscending ? a.createdAt : b.createdAt)
                                                - new Date(sortPropertyAscending ? b.createdAt : a.createdAt)
                                            )
                                            .map((property, index) => {
                                                let bookedByArray = [];
                                                let bookedByLen;

                                                if (property.bookedBy) {
                                                    try {
                                                        bookedByArray = JSON.parse(property.bookedBy);
                                                    } catch (parseError) {
                                                        cError("Error parsing bookedBy array:", parseError);
                                                    }
                                                }
                                                bookedByLen = Array.isArray(bookedByArray) ? bookedByArray.length : 0;

                                                const isActive = (property.booked && !property.closed) || false;
                                                const isClosed = (property.closed) || false;
                                                const isLive = (property.listed && !property.booked) || false;
                                                const isUnlisted = !property.listed || false;

                                                return (
                                                    <tr key={index}
                                                        className={`small ${property.closed && !showOnlyClosedProperties ? 'opacity-50' : ''} ${isUnlisted ? 'fst-italic' : ''} cursor-default clickDown table-secondary property-row`}
                                                        onClick={() => { setShowSelectedPropertyInfo(true); setSelectedProperty(property) }}
                                                    >
                                                        <td className={`ps-sm-3 ${isClosed ? 'text-success' : ''} border-0 border-end ${isActive ? 'border-2 border-primary' : isClosed ? 'border-1 border-success' : isUnlisted ? 'border-1 border-warning' : ''}`}>
                                                            {index + 1}
                                                        </td>
                                                        <td title={`Location: ` + property.location + `,\n\n` + property.about}>
                                                            {property.name}
                                                        </td>
                                                        <td className="text-muted fs-75" >
                                                            {property.type}
                                                        </td>
                                                        <td title={`Paid ${property.payment}`} >
                                                            {property.price.toLocaleString()}
                                                        </td>
                                                        <td style={{ color: property.category === "For Sale" ? "#25b579" : "#ff9800" }}>
                                                            {property.category}
                                                        </td>
                                                        <td className='text-nowrap fs-75'>
                                                            {property.location}
                                                        </td>
                                                        <td className='text-muted text-nowrap small'>
                                                            {formatDate(property.createdAt, { longMonthFormat: true })}
                                                        </td>
                                                        <td className={`${isClosed ? 'text-success' : isActive ? 'text-primary' : isUnlisted ? 'text-secondary' : ''} text-nowrap`}
                                                            title={isActive ? `Reserved by ${bookedByLen} client${bookedByLen > 1 ? 's' : ''}` : undefined}
                                                        >
                                                            {isClosed && `Closed`}
                                                            {isClosed && isUnlisted && `Closed & Unlisted`}
                                                            {isActive && `Reserved (${bookedByLen})`}
                                                            {isLive && `Live`}
                                                            {isUnlisted && `Unlisted`}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </>
                }

                {/* <PropertyCard /> */}

                {/* <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio aut in, soluta ducimus tempora dicta odit recusandae omnis impedit quas delectus a quaerat ea accusantium necessitatibus molestias, porro sequi maxime!
                </p>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio aut in, soluta ducimus tempora dicta odit recusandae omnis impedit quas delectus a quaerat ea accusantium necessitatibus molestias, porro sequi maxime!
                </p> */}
            </div>
        </section>
    );

    const Orders = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Orders</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Manage and track all property reservations made through your website.
                    </div>
                </div>
                <ShoppingCart size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : Active Orders */}
            <div className="container my-5 px-0 py-4 section-content">
                {/* Loading */}
                {loadingProperties && <LoadingBubbles icon={<ShoppingCart size={50} className='loading-skeleton' />} />}
                {/* Error */}
                {!loadingProperties && errorLoadingProperties && (
                    <FetchError
                        errorMessage="Failed to load properties. Click the button to try again."
                        refreshFunction={() => fetchProperties()}
                        className="mb-5 mt-4"
                    />
                )}
                {/* Zero content */}
                {!loadingProperties && !errorLoadingProperties && openDealsNum === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                        <ShoppingCart size={80} className="dblock text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            No orders yet. Property reservations/orders will be listed and managed here as they come in.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingProperties && !errorLoadingProperties && openDealsNum > 0 &&
                    <>
                        <div className='container mb-4 py-3 border border-2'>
                            <h4 className='text-info-emphasis mb-4 fs-4 text-uppercase'>Reserved properties ( {bookedPropertiesNum} )</h4>
                            <div className='alert alert-info small'>
                                <div className='grid-center'>
                                    <p>
                                        <Info size={20} className='me-1' /> Here is a list of reserved properties. These properties have been temporarily held for potential buyers or tenants and are awaiting final confirmation or payment. While reserved, they remain unavailable for other inquiries or listings
                                    </p>
                                    <CaretDown />
                                </div>
                            </div>
                        </div>
                        <div className='row align-items-stretch'>
                            {
                                bookedProperties.map((property, index) => {
                                    const { name, type, category, location, bookedBy } = property;
                                    const orderEmails = JSON.parse(bookedBy);
                                    const orderCount = orderEmails.length;

                                    const mainColor = category === "For Sale" ? "#25b579" : "#ff9800";

                                    return (
                                        <div key={index} className='col-12 col-lg-6 col-xxl-4 mb-3'>
                                            <div className='h-100 d-flex flex-column py-3 text-gray-700 border'>
                                                <div className='h5 flex-align-center flex-wrap gap-2 p-2 small border-start border-3 border-dark bg-gray-300'>
                                                    <span className='flex-align-center opacity-50'>
                                                        <Bookmark size={15} weight="fill" /> {orderCount}
                                                    </span>
                                                    <span>{name}</span>
                                                    <Info weight="bold" size={17} className='ms-auto opacity-75 ptr clickDown' onClick={() => { setSelectedProperty(property); setShowSelectedPropertyInfo(true) }} />
                                                </div>
                                                <p className='px-2 text-gray-600 smaller'>
                                                    <span style={{ color: mainColor }}>{type} {category}</span> <CaretRight /> {location}
                                                </p>
                                                <div className='mt-auto px-2'>
                                                    <div className='p-2 border-start border-end border-3'>
                                                        <div className="h6 grid-center text-gray-600 border-bottom pb-1">
                                                            <span>RESERVED BY</span>
                                                            <CaretDown />
                                                        </div>
                                                        <div className='d-grid'>
                                                            {orderEmails.map((email, index) => (
                                                                <div key={index} className='flex-align-center overflow-hidden smaller'>
                                                                    <User className='opacity-50 me-1' />
                                                                    <span className='text-gray-600 fw-bold text-truncate'>{email}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* <div> */}
                                                    <button className="w-100 btn btn-sm btn-outline-success mt-3 py-2 rounded-0 fw-light"
                                                        onClick={() => { setSelectedProperty(property); setShowClosePropertyForm(true) }}
                                                    >
                                                        (1) close request
                                                    </button>
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                }
            </div>
        </section>
    );

    const Reports = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Reports</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Review key insights on property performance and analyze closed deals to inform business decisions.
                    </div>
                </div>
                <ChartBar size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : Reports */}
            <div className="container my-5 px-0 py-4 section-content">
                {/* Loading */}
                {loadingProperties && <LoadingBubbles icon={<ChartBar size={50} className='loading-skeleton' />} />}
                {/* Error */}
                {!loadingProperties && errorLoadingProperties && (
                    <FetchError
                        errorMessage="Failed to load properties. Click the button to try again"
                        refreshFunction={() => fetchProperties()}
                        className="mb-5 mt-4"
                    />
                )}
                {/* Zero content */}
                {!loadingProperties && !errorLoadingProperties && closedPropertiesNum === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                        <SealCheck size={80} className="dblock text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            Closed properties will be listed here as they come in.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingProperties && !errorLoadingProperties && closedPropertiesNum > 0 && (
                    <>
                        <div className='container mb-4 py-3 border border-2'>
                            <h4 className='text-info-emphasis mb-4 fs-4 text-uppercase'>Closed properties ( {closedPropertiesNum} )</h4>
                            <div className='alert alert-info small'>
                                <div className='grid-center'>
                                    <p>
                                        <Info size={20} className='me-1' /> Below is a list of properties marked as closed. These properties represent successful transactions or agreements finalized between the involved parties. Once closed, they are locked from further editing to preserve the integrity of the records and reflect completed dealings
                                    </p>
                                    <CaretDown />
                                </div>
                            </div>
                        </div>

                        {/* View and search toggler */}
                        <ul className='d-flex justify-content-center gap-2 mb-2 list-unstyled'>
                            <li className={`flex-align-center p-2 ${!showClosedPropertiesReport ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={() => setShowClosedPropertiesReport(false)}>
                                <ListDashes weight='fill' className='me-1' /> List
                            </li>
                            <li className={`flex-align-center p-2 ${showClosedPropertiesReport ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={() => setShowClosedPropertiesReport(true)}>
                                <Calendar weight='fill' className='me-1' /> Report
                            </li>
                        </ul>
                        {!showClosedPropertiesReport ? (
                            <div className='row align-items-stretch'>
                                {closedProperties.map((property, index) => {
                                    const { name, type, category, location, bookedBy, closedBy, closedOn } = property;
                                    const orderEmails = JSON.parse(bookedBy);
                                    const orderCount = orderEmails.length;

                                    const mainColor = category === "For Sale" ? "#25b579" : "#ff9800";

                                    return (
                                        <div key={index} className='col-12 col-lg-6 col-xxl-4 mb-3'>
                                            <div className='h-100 d-flex flex-column py-3 text-gray-700 border'>
                                                <div className='h5 flex-align-center flex-wrap gap-2 p-2 small border-start border-3 border-dark bg-gray-300'>
                                                    <SealCheck weight="fill" className='opacity-75' />
                                                    <span>{name}</span>
                                                    <Info weight="bold" size={17} className='ms-auto opacity-75 ptr clickDown' title="Preview" onClick={() => { setSelectedProperty(property); setShowSelectedPropertyInfo(true) }} />
                                                </div>
                                                <p className='px-2 text-gray-600 smaller'>
                                                    <span style={{ color: mainColor }}>{type} {category}</span> <CaretRight /> {location}
                                                </p>
                                                <div className='mt-auto px-2'>
                                                    {orderCount > 1 && (
                                                        <div className='p-2 border-start border-end border-3'>
                                                            <div className="h6 grid-center text-gray-600 border-bottom pb-1">
                                                                <span>BOOKED BY ( {orderCount} )</span>
                                                                <CaretDown />
                                                            </div>
                                                            <div className='d-grid'>
                                                                {orderEmails.map((email, index) => (
                                                                    <div key={index} className='flex-align-center overflow-hidden smaller'>
                                                                        <User className='opacity-50 me-1' />
                                                                        <span className='text-gray-600 fw-bold text-truncate'>{email}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className='p-2 border-start border-end border-3'>
                                                        <div className="h6 grid-center text-gray-600 border-bottom pb-1">
                                                            <span>CLOSED BY</span>
                                                            <CaretDown />
                                                        </div>
                                                        <div className='d-grid'>
                                                            <div className='flex-align-center overflow-hidden smaller'>
                                                                <User className='opacity-50 me-1' />
                                                                <span className='text-gray-600 fw-bold text-truncate'>{closedBy}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='px-2 border-start border-end border-3 smaller text-success'>
                                                        <Check className='me-1' /> Closed on <span className="fw-bold">{formatDate(closedOn, { todayKeyword: true })}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <ClosedPropertiesReport />
                        )}


                    </>
                )}
                {/* <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio aut in, soluta ducimus tempora dicta odit recusandae omnis impedit quas delectus a quaerat ea accusantium necessitatibus molestias, porro sequi maxime!
                </p>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio aut in, soluta ducimus tempora dicta odit recusandae omnis impedit quas delectus a quaerat ea accusantium necessitatibus molestias, porro sequi maxime!
                </p> */}
            </div>
        </section>
    );

    const Messages = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Messages</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Read and reply to messages sent from your website. When you reply to a message here, they will be notified throught the email.
                    </div>
                </div>
                <ChatDots size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : Messages */}
            <div className="container my-5 px-0 py-4 section-content">
                {/* Loading */}
                {loadingMessages && <LoadingBubbles icon={<ChatDots size={50} className='loading-skeleton' />} />}
                {/* Error */}
                {!loadingMessages && errorLoadingMessages && (
                    <FetchError
                        errorMessage={errorLoadingMessages}
                        refreshFunction={() => fetchMessages()}
                        className="mb-5 mt-4"
                    />
                )}
                {/* Zero content */}
                {!loadingMessages && !errorLoadingMessages && messages.length === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                        <ChatDots size={80} className="dblock text-center w-100 mb-3 opacity-50" style={{ animation: 'wobbleBottom 10s infinite' }} />
                        <p className="text-muted text-center small">
                            No messages yet. Messages from your website will appear here as they come in.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingMessages && !errorLoadingMessages && messages.length > 0 &&
                    <>
                        <div className='d-flex flex-wrap gap-2 mb-4 pb-2 overflow-auto'>
                            <div className="d-flex align-items-center w-fit text-nowrap bg-gray-300 rounded-3 px-2 py-1 small ptr" onClick={() => setShowOnlyUnrepliedMessages(false)}
                            >
                                <span className='small'>All</span>
                                <span className="badge w-fit ms-2 p-1 border border-secondary border-opacity-25 text-dark fw-normal">{messages.length}</span>
                            </div>
                            <div className={`d-flex align-items-center w-fit text-nowrap ${showOnlyUnrepliedMessages ? 'bg-gray-700' : 'bg-gray-300'} rounded-3 px-2 py-1 small ptr`} onClick={() => setShowOnlyUnrepliedMessages(true)}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyUnrepliedMessages ? 'text-light' : 'text-gray-700'}`}><EnvelopeSimple className='me-1' /> Not replied</span>
                                <span className={`badge w-fit ms-2 p-1 ${showOnlyUnrepliedMessages ? 'text-light border-light' : 'text-dark border-secondary'} border border-opacity-25 fw-normal`}>{notRepliedMessages.length}</span>
                            </div>
                            <div className={`d-flex align-items-center w-fit text-nowrap bg-gray-300 rounded-3 px-2 py-1 small ptr`} onClick={() => fetchMessages()}
                            >
                                <span className={`small d-flex align-items-center ${showOnlyUnrepliedMessages ? 'text-light' : 'text-gray-700'}`}><ArrowClockwise weight="bold" className="me-1" /> Refresh</span>
                            </div>
                        </div>
                        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                            {messagesToShow
                                .sort((a, b) => b.id - a.id)
                                .map((item, index) => (
                                    <div key={index} className={`col d-flex align-items-center border-bottom border-start py-2 ${!item.replied ? 'bg-gray-300 ptr' : ''} clickDown message-item`}
                                        onClick={() => { setShowContactUsMessage(true); setReplyTo(item) }}
                                    >
                                        <ChatDots size={30} className='me-2 text-gray-500 flex-shrink-0' />
                                        <div className='flex-grow-1 d-flex align-items-center justify-content-between'>
                                            <div className='d-grid fs-80 person-info'>
                                                <span className={`fw-bold ${!item.replied ? 'text-gray-900' : 'text-gray-600'} text-truncate person-info__name`}>
                                                    {item.name}
                                                </span>
                                                <span className={`text-gray-700 ${!item.replied ? 'fw-bold' : ''} small text-truncate person-info__email`}>
                                                    {item.email}
                                                </span>
                                            </div>
                                            <div className='d-grid ms-3 fs-80 message-cta'>
                                                {!item.replied ?
                                                    <span className='text-end'>Reply</span>
                                                    :
                                                    <CheckCircle className='mx-auto' />
                                                }
                                                <span className={`mt-1 fw-bold ${!item.replied ? 'text-gray-900' : 'text-gray-600'} text-nowrap small`}>
                                                    {formatDate(item.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </div>

        </section>
    );

    const UsersList = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Users List</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        View and manage customer accounts and subscriber information to keep your audience engaged and informed.
                    </div>
                </div>
                <User size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : Users */}
            <div className="container my-5 px-0 py-4 section-content">
                {/* Loading */}
                {loadingCustomers && <LoadingBubbles icon={<User size={50} className='loading-skeleton' />} />}
                {/* Error */}
                {!loadingCustomers && errorLoadingCustomers && (
                    <FetchError
                        errorMessage="Failed to load customers. Click the button to try again"
                        refreshFunction={() => fetchCustomers()}
                        className="mb-5 mt-4"
                    />
                )}
                {/* Zero content */}
                {!loadingCustomers && !errorLoadingCustomers && totalCustomers === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                        <User size={80} className="dblock text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            No customers yet. Clients who made orders will appear here.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingCustomers && !errorLoadingCustomers && totalCustomers > 0 &&
                    <>
                        {/* Searcher */}
                        <div className={`col-12 col-md-8 col-xl-5  mx-auto mb-3 position-relative p-1 ps-2 border border-2 border-black4 bg-bodi target-input search-box`}>
                            <MagnifyingGlass weight='bold' className='flex-grow-1 text-black2 opacity-75' />
                            <input ref={userSearcherRef} type="text"
                                placeholder={`Search ${activeUsersCustomers ? 'customer' : activeUsersSubscribers ? 'subscriber' : ''}`} className="border-0 search-box__input" id="userSearcher" style={{ minWidth: "10rem" }}
                                // value={propSearchValue}
                                // onChange={(e) => setPropSearchValue(e.target.value)}
                                onKeyUp={(e) => { (e.key === "Enter") && filterUsersBySearch(e) }}
                            />
                            {propSearcherRef.current && propSearcherRef.current.value !== '' && (
                                <button className="fa fa-close r-middle-m ratio-1-1 rounded-circle border-0 bg-transparent text-gray-500"
                                    onClick={() => { propSearcherRef.current.value = ''; showAllProperties(); setPropertiesToShow(allProperties) }}
                                ></button>
                            )}
                        </div>

                        {/* Content */}
                        {/* Users  toggler */}
                        <ul className='d-flex justify-content-center gap-2 mb-2 list-unstyled'>
                            <li className={`flex-align-center p-2 ${activeUsersCustomers ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={seeCustomers}>
                                <UserCheck weight='fill' className='me-1' /> Customers
                            </li>
                            <li className={`flex-align-center p-2 ${activeUsersSubscribers ? 'border-bottom border-3 border-primary fw-bold text-primary' : 'text-gray-600'} ptr clickDown`}
                                onClick={seeSubscribers}>
                                <BellRinging weight='fill' className='me-1' /> Subscribers
                            </li>
                        </ul>

                        {/* Reset user filter */}
                        {userSearchValue !== '' &&
                            (
                                <div className="flex-center p-3 fw-bold text-gray-700">
                                    <button type="button" className="btn btn-sm btn-secondary flex-center px-3 rounded-pill"
                                        onClick={() => setUserSearchValue('')}>

                                        <Eraser className='me-2' /> Reset
                                    </button>
                                </div>
                            )
                        }

                        {/* Users content - Customers */}
                        {activeUsersCustomers && (
                            <div>
                                Customers
                            </div>
                        )}

                        {/* Users content - Subscribers */}
                        {activeUsersSubscribers && (
                            <div className="overflow-auto">
                                <table className="table h-100 table-hover subscribers-table">
                                    <thead className='table-primary position-sticky top-0 inx-1'>
                                        <tr>
                                            <th className='ps-sm-3 py-3 text-nowrap text-gray-700'>N</th>
                                            <th className='py-3 text-nowrap text-gray-700' style={{ maxWidth: '15rem' }}>Email</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Subscription</th>
                                            <th className='py-3 text-nowrap text-gray-700'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribersToShow
                                            .sort((a, b) =>
                                                new Date(b.updatedAt) - new Date(a.updatedAt)
                                            )
                                            .map((subscriber, index) => {
                                                // Subsc email
                                                const email = subscriber.email;

                                                // Type of subsc
                                                const subscription = JSON.parse(subscriber.subscriptionType),
                                                    submitedTypes = subscription.types.join(''),
                                                    submitedCategories = subscription.categories;

                                                let subscTypes, subscCategories;

                                                switch (true) {
                                                    case submitedTypes === 'all' && submitedCategories === 'all':
                                                        subscTypes = <><span className='px-1 bg-gray-400 text-gray-800'>All types</span></>;
                                                        subscCategories = <><span className='px-1 bg-gray-400 text-gray-800' title="Rents & Sales">Both</span></>;
                                                        break;

                                                    case submitedTypes === 'all' && submitedCategories !== 'all':
                                                        subscTypes = <><span className='px-1 bg-gray-400 text-gray-800'>All types</span></>;
                                                        subscCategories =
                                                            <>
                                                                <span>{submitedCategories}</span>
                                                            </>;
                                                        break;

                                                    case submitedTypes !== 'all' && submitedCategories === 'all':
                                                        subscTypes =
                                                            <>
                                                                {subscription.types.map((type, index) => (
                                                                    <span key={index} className='px-1 bg-gray-400 text-gray-800'>
                                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                    </span>
                                                                ))}
                                                            </>;;
                                                        subscCategories = <><span className='px-1 bg-gray-400 text-gray-800' title="Rents & Sales">Both</span></>;
                                                        break;

                                                    case submitedTypes !== 'all' && submitedCategories !== 'all':
                                                        subscTypes =
                                                            <>
                                                                {subscription.types.map((type, index) => (
                                                                    <span key={index} className='px-1 bg-gray-400 text-gray-800'>
                                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                    </span>
                                                                ))}
                                                            </>;;
                                                        subscCategories =
                                                            <>
                                                                <span>{submitedCategories}</span>
                                                            </>;
                                                        break;

                                                    default:
                                                        subscTypes = <><span className='px-1 bg-gray-400 text-gray-800'>All types</span></>;
                                                        subscCategories = <><span className='px-1 bg-gray-400 text-gray-800' title="Rents & Sales">Both</span></>;
                                                        break;
                                                }

                                                // Subsc update date
                                                const date = formatDate(subscriber.updatedAt, { todayKeyword: true });

                                                return (
                                                    <tr key={index} className="clickDown subscriber-row"
                                                        onClick={() => { setShowSelectedSubscriberInfo(true); setSelectedSubscriber(subscriber) }}
                                                    >
                                                        <td className={`ps-sm-3`} style={{ '--bs-border-width': '3px' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td className='small text-truncate' style={{ '--bs-border-width': '3px', maxWidth: '15rem' }}>
                                                            {email}
                                                        </td>
                                                        <td className="border-start border-secondary border-opacity-25 text-muted fs-75">
                                                            <div className='w-100 d-flex gap-2'>
                                                                <div className='col-6'>
                                                                    <h6 className='mb-1 pb-1 border-bottom border-secondary border-opacity-25'>Property</h6>
                                                                    <div className="px-1 d-flex flex-wrap gap-1 small">
                                                                        {subscTypes}
                                                                    </div>
                                                                </div>
                                                                <div className='col-6'>
                                                                    <h6 className='mb-1 pb-1 border-bottom border-secondary border-opacity-25'>Category</h6>
                                                                    <div className="px-1 d-flex flex-wrap gap-1 small">
                                                                        {subscCategories}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='border-start border-secondary border-opacity-25 small text-nowrap' title="Last subscription">
                                                            {date}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Filter zero content */}
                        {userSearchValue !== '' && (customersToShow.length === 0 || subscribersToShow.length === 0) && (
                            <FetchError
                                errorMessage={
                                    `${activeUsersCustomers ? 'Customer' : activeUsersSubscribers ? 'Subscriber' : ''} Not found. Reset to see all ${activeUsersCustomers ? 'customers' : activeUsersSubscribers ? 'subscribers' : ''}`
                                }
                                retryKeyword="Reset"
                                refreshFunction={() => setUserSearchValue('')}
                                className="mb-5"
                            />
                        )}
                    </>
                }
            </div>
        </section>
    );

    const Settings = () => {
        const [propertySettings, setPropertySettings] = useState({
            maxImages: 25,
            maxVideos: 1,
            featuredPropertiesLimit: 15,
            allowGuestLikes: true,
        });

        const unchangedBusinessProfile = useMemo(() => (
            {
                businessName: businessProfileSettings.businessName,
                motto: businessProfileSettings.motto,
                email: businessProfileSettings.email,
                phone1: businessProfileSettings.phone1,
                phone2: businessProfileSettings.phone2,
                workingHours: {
                    weekdays: { open: businessProfileSettings.weekdaysOpen, close: businessProfileSettings.weekdaysClose },
                    weekends: { open: businessProfileSettings.weekendsOpen, close: businessProfileSettings.weekendsClose },
                },
                address: businessProfileSettings.address,
            }
        ), []);

        const [businessProfile, setBusinessProfile] = useState({
            businessName: businessProfileSettings.businessName,
            motto: businessProfileSettings.motto,
            email: businessProfileSettings.email,
            phone1: businessProfileSettings.phone1,
            phone2: businessProfileSettings.phone2,
            workingHours: {
                weekdays: { open: businessProfileSettings.weekdaysOpen, close: businessProfileSettings.weekdaysClose },
                weekends: { open: businessProfileSettings.weekendsOpen, close: businessProfileSettings.weekendsClose },
            },
            address: businessProfileSettings.address,
        });

        const handlePropertySettingsChange = (e) => {
            const { name, value, type, checked } = e.target;
            setPropertySettings((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        };

        const handleBusinessProfileChange = (e) => {
            const { name, value, type, files } = e.target;
            setBusinessProfile((prev) => ({
                ...prev,
                [name]: type === 'file' ? files[0] : value,
            }));
        };

        // Detect changes on b-profile settings
        const [businessProfileChanged, setBusinessProfileChanged] = useState(false);

        useEffect(() => {
            // Perform deep comparison
            if (!deepEqual(unchangedBusinessProfile, businessProfile)) {
                setBusinessProfileChanged(true);
            } else {
                setBusinessProfileChanged(false);
            }
        }, [businessProfile, unchangedBusinessProfile]); // Trigger only when "businessProfile" changes

        // Edit logo
        const [editLogo, setEditLogo] = useState(false);
        const [newLogoFile, setNewLogoFile] = useState(null);
        const [newLogoFileName, setNewLogoFileName] = useState(null);

        const handleImageFileChange = (e) => {
            const file = e.target.files[0];
            if (file && !file.type.startsWith("image/")) {
                toast({
                    message: "Please upload a valid image file.",
                    type: "danger",
                });
                return;
            }
            setNewLogoFile(file);
            setNewLogoFileName(file?.name || ""); // Set the file name
        };

        // Handle logo update
        const updateBusinessLogo = async (file) => {
            if (!file) {
                return toast({ message: "Select new logo image to continue." });
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                setIsWaitingAdminEditAction(true);
                const response = await fetch(`${BASE_URL}/businessProfile/updateLogo`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        // No need for "Content-Type" as FormData sets it automatically
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to upload media.");
                }

                const data = await response.json();
                toast({ message: data.message, type: 'gray-700' });
                setEditLogo(false);
                fetchBusinessProfileSettings();
            } catch (error) {
                cError('Error:', error.message);
                toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
            } finally {
                setIsWaitingAdminEditAction(false);
                setConfirmDialogActionWaiting(false);
            }
        };

        // Handle B-settings update
        const handelUpdateBusinessProfileSettings = async (e) => {
            if (e) e.preventDefault();

            const newSettings = {
                businessName: businessProfile.businessName,
                motto: businessProfile.motto,
                email: businessProfile.email,
                phone1: businessProfile.phone1,
                phone2: businessProfile.phone2,
                weekdaysOpen: businessProfile.workingHours.weekdays.open,
                weekdaysClose: businessProfile.workingHours.weekdays.close,
                weekendsOpen: businessProfile.workingHours.weekends.open,
                weekendsClose: businessProfile.workingHours.weekends.close,
                address: businessProfile.businessName,
            };

            try {
                setIsWaitingAdminEditAction(true);
                const response = await fetch(`${BASE_URL}/businessProfile/update`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newSettings })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to save changes media.");
                }

                const data = await response.json();
                toast({ message: data.message, type: 'gray-700' });
                fetchBusinessProfileSettings();
            } catch (error) {
                cError('Error:', error.message);
                toast({ message: (error.message || 'Something went wrong. Please try again.'), type: 'warning' });
            } finally {
                setIsWaitingAdminEditAction(false);
                setConfirmDialogActionWaiting(false);
            }
        };

        return (
            <section>
                {/* Section Header */}
                <div className='pt-5 pb-3 d-lg-flex section-about'>
                    <div>
                        <h1 className='text-center mb-4 fw-bold text-secondary'>Settings</h1>
                        <div className="d-lg-flex px-4 fs-5 text-gray-600">
                            Customize property and business settings to align with your brand and operational needs.
                        </div>
                    </div>
                    <Gear size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
                </div>

                {/* Section Content */}
                <div className="container my-5 px-0 py-4 section-content">
                    <div className="d-lg-flex gap-4">
                        {/* Property Settings */}
                        <div className="col mb-5 settings-wrapper property-settings">
                            <h2 className="h4 d-flex px-2 text-primaryColorDark fw-semibold"><Building size={30} weight="duotone" className="opacity-75 me-2" /> Property Settings</h2>
                            <hr className='mb-4' />
                            <div className="px-2">
                                <form>
                                    <div className="mb-3">
                                        <div className="label mb-2">Max Images per Property</div>
                                        <p><Image size={20} weight='duotone' className='me-1' /> {propertySettings.maxImages} images</p>
                                    </div>
                                    <div className="mb-3">
                                        <div className="label mb-2">Max Videos per Property</div>
                                        <p><Video size={20} weight='duotone' className='me-1' /> {propertySettings.maxVideos} video</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="featuredPropertiesLimit" className="form-label">Featured Properties Limit</label>
                                        <input
                                            type="number"
                                            id="featuredPropertiesLimit"
                                            name="featuredPropertiesLimit"
                                            className="form-control rounded-0"
                                            value={propertySettings.featuredPropertiesLimit}
                                            onChange={handlePropertySettingsChange}
                                        />
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="allowGuestLikes"
                                            name="allowGuestLikes"
                                            className="form-check-input"
                                            checked={propertySettings.allowGuestLikes}
                                            onChange={handlePropertySettingsChange}
                                        />
                                        <label htmlFor="allowGuestLikes" className="form-check-label">Allow Guest Likes</label>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Business Profile Settings */}
                        <div className="col mb-5 settings-wrapper business-settings">
                            <h2 className="h4 d-flex px-2 text-primaryColorDark fw-semibold"><IdentificationBadge size={30} weight="duotone" className="opacity-75 me-2" /> Business Profile Settings</h2>
                            <hr className='mb-4' />

                            {/* Loading */}
                            {loadingBusinessProfileSettings && <LoadingBubbles icon={<IdentificationBadge size={50} className='loading-skeleton' />} />}
                            {/* Error */}
                            {!loadingBusinessProfileSettings && errorLoadingBusinessProfileSettings && (
                                <FetchError
                                    errorMessage={errorLoadingBusinessProfileSettings}
                                    refreshFunction={() => fetchBusinessProfileSettings()}
                                    className="mb-5 mt-4"
                                />
                            )}
                            {/* Zero content */}
                            {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && businessProfileSettings.length === 0 &&
                                <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 rounded info-message">
                                    <ChatDots size={80} className="dblock text-center w-100 mb-3 opacity-50" style={{ animation: 'wobbleBottom 10s infinite' }} />
                                    <p className="text-muted text-center small">
                                        No business profile setting available. Please contact you site developer for support.
                                    </p>
                                </div>
                            }
                            {/* Available content */}
                            {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && (
                                <div className="px-2">
                                    <div className="d-flex mb-4">
                                        <div className="position-relative">
                                            <img src={businessProfileSettings.logoUrl} alt="logo" className="w-7rem h-7rem object-fit-cover p-2 rounded-0 img-thumbnail" />
                                            <Pen size={30} className='position-absolute bottom-0 end-0 mt-3 ms-2 mt-1 p-1 rounded-2 bg-light border ptr clickDown'
                                                onClick={() => setEditLogo(!editLogo)}
                                            />
                                        </div>
                                        <div className="p-2">
                                            <div className="h4 mb-0">{businessProfile.businessName}</div>
                                            <div className="small">{businessProfile.motto}</div>
                                            <div className="fs-70 text-muted"><Envelope weight='duotone' /> {businessProfile.email}</div>
                                            <div className="fs-70 text-muted"><Phone weight='duotone' /> <WhatsappLogo weight='duotone' fill='var(--bs-success)' /> {companyPhoneNumber1.text}</div>
                                        </div>
                                    </div>

                                    {/* Logo editor */}
                                    {editLogo && (
                                        <>
                                            <div className="mb-3 p-3 bg-gray-300 small add-property-image">
                                                <h6 className='flex-align-center text-gray-600'><Image size={20} weight="fill" className='me-1' />Change Business Logo</h6>
                                                <div className="flex-align-center flex-wrap gap-2 mb-3">
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg, image/jpg, image/png"
                                                        name="propImage"
                                                        id="propImage"
                                                        className="form-control rounded-0 file-input"
                                                        onChange={handleImageFileChange}
                                                    />
                                                    <p className={`${newLogoFileName ? 'text-success' : ''} mb-0 px-2`}>{newLogoFileName || "No file chosen"}</p>
                                                </div>
                                                <div className="modal-footer justify-content-around">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm text-secondary border-0 ${isWaitingAdminEditAction ? 'opacity-25' : 'opacity-75'
                                                            } clickDown`}
                                                        disabled={isWaitingAdminEditAction}
                                                        onClick={() => { setNewLogoFile(null); setEditLogo(false) }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-secondary flex-center px-4 rounded-pill clickDown"
                                                        id="uploadLogoImage"
                                                        onClick={(e) => { e.preventDefault(); updateBusinessLogo(newLogoFile) }}
                                                        disabled={!newLogoFile || isWaitingAdminEditAction}
                                                    >
                                                        {!isWaitingAdminEditAction ? (
                                                            <>
                                                                Change Logo <CaretRight size={18} className="ms-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Working <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="businessName" className="form-label">Business Name</label>
                                            <input
                                                type="text"
                                                id="businessName"
                                                name="businessName"
                                                className="form-control rounded-0"
                                                placeholder='Enter name'
                                                value={businessProfile.businessName}
                                                onChange={handleBusinessProfileChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="motto" className="form-label">Business Motto</label>
                                            <input
                                                type="text"
                                                id="motto"
                                                name="motto"
                                                className="form-control rounded-0"
                                                placeholder='Enter motto'
                                                value={businessProfile.motto}
                                                onChange={handleBusinessProfileChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Business Email</label>
                                            <div className="flex-align-center gap-3 mb-2">
                                                <div className="position-relative h-100 ms-1 flex-shrink-0 flex-grow-1">
                                                    <Envelope weight='duotone' />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-control rounded-0"
                                                    placeholder='Enter email'
                                                    value={businessProfile.email}
                                                    onChange={handleBusinessProfileChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone(s)</label>
                                            <div className="flex-align-center gap-3 mb-2">
                                                <div className="position-relative h-100 ms-1 flex-shrink-0 flex-grow-1">
                                                    <Phone weight='duotone' /> <span className='position-absolute bottom-0 start-100 fs-60 bg-light translate-middle-x ms-1'>1</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="phone1"
                                                    name="phone1"
                                                    className="form-control rounded-0"
                                                    placeholder='Enter phone number'
                                                    value={businessProfile.phone1}
                                                    onChange={handleBusinessProfileChange}
                                                />
                                            </div>
                                            <div className="flex-align-center gap-3 mb-2">
                                                <div className="position-relative h-100 ms-1 flex-shrink-0 flex-grow-1">
                                                    <Phone weight='duotone' /> <span className='position-absolute bottom-0 start-100 fs-60 bg-light translate-middle-x ms-1'>2</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="phone2"
                                                    name="phone2"
                                                    className="form-control rounded-0"
                                                    placeholder='Enter phone number'
                                                    value={businessProfile.phone2}
                                                    onChange={handleBusinessProfileChange}
                                                />
                                            </div>
                                            <div className="d-flex m-0 fs-75 form-text"><WhatsappLogo weight='duotone' size={20} fill='var(--bs-success)' className='ms-1 me-3' /> Phone number one is also set as WhatsApp number</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="weekdaysStart" className="form-label">Week days working hours (Open - Close)</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <input
                                                    type="time"
                                                    id="weekdaysStart"
                                                    name="weekdaysStart"
                                                    className="form-control rounded-0"
                                                    value={businessProfile.workingHours.weekdays.open}
                                                    onChange={(e) =>
                                                        setBusinessProfile((prev) => ({
                                                            ...prev,
                                                            workingHours: {
                                                                ...prev.workingHours,
                                                                weekdays: { ...prev.workingHours.weekdays, open: e.target.value },
                                                            },
                                                        }))
                                                    }
                                                />
                                                -
                                                <input
                                                    type="time"
                                                    id="weekdaysEnd"
                                                    name="weekdaysEnd"
                                                    className="form-control rounded-0"
                                                    value={businessProfile.workingHours.weekdays.close}
                                                    onChange={(e) =>
                                                        setBusinessProfile((prev) => ({
                                                            ...prev,
                                                            workingHours: {
                                                                ...prev.workingHours,
                                                                weekdays: { ...prev.workingHours.weekdays, close: e.target.value },
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="weekendsStart" className="form-label">Weekend working hours (Open - Close)</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <input
                                                    type="time"
                                                    id="weekendsStart"
                                                    name="weekendsStart"
                                                    className="form-control rounded-0"
                                                    value={businessProfile.workingHours.weekends.open}
                                                    onChange={(e) =>
                                                        setBusinessProfile((prev) => ({
                                                            ...prev,
                                                            workingHours: {
                                                                ...prev.workingHours,
                                                                weekends: { ...prev.workingHours.weekends, open: e.target.value },
                                                            },
                                                        }))
                                                    }
                                                />
                                                -
                                                <input
                                                    type="time"
                                                    id="weekendsEnd"
                                                    name="weekendsEnd"
                                                    className="form-control rounded-0"
                                                    value={businessProfile.workingHours.weekends.close}
                                                    onChange={(e) =>
                                                        setBusinessProfile((prev) => ({
                                                            ...prev,
                                                            workingHours: {
                                                                ...prev.workingHours,
                                                                weekends: { ...prev.workingHours.weekends, close: e.target.value },
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <div className="flex-align-center gap-3 mb-2">
                                                <div className="position-relative h-100 ms-1 flex-shrink-0 flex-grow-1">
                                                    <MapPinArea weight='duotone' />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    className="form-control rounded-0"
                                                    placeholder='Enter address'
                                                    value={businessProfile.address}
                                                    onChange={handleBusinessProfileChange}
                                                />
                                            </div>
                                        </div>
                                        {/* Save Changes Button */}
                                        <div className="text-end mt-4 py-4">
                                            <button type="submit" className="btn btn-sm btn-dark col-12 col-sm-auto flex-center mt-3 ms-auto me-auto ms-lg-0 py-2 px-4 rounded-pill clickDown"
                                                onClick={(e) => handelUpdateBusinessProfileSettings(e)}
                                                disabled={!businessProfileChanged || isWaitingAdminEditAction}
                                            >
                                                {!isWaitingAdminEditAction ?
                                                    <>Save Changes <FloppyDisk size={18} className='ms-2' /></>
                                                    : <>Saving changes <span className="spinner-grow spinner-grow-sm ms-2"></span></>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section >
        );
    };

    // export default Settings;

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />;
            case "orders":
                return <Orders />;
            case "properties":
                return <Properties />;
            case "reports":
                return <Reports />;
            case "messages":
                return <Messages />;
            case "usersList":
                return <UsersList />;
            case "settings":
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
            <header className="navbar navbar-light sticky-top flex-md-nowrap py-0 pe-3 border-bottom admin-header">
                <div className='nav-item navbar-brand col-md-3 d-flex align-items-center px-2'>
                    <div className="me-2 logo">
                        <Link to="/">
                            <img src={businessProfileSettings.logoUrl} alt="logo" className="rounded-circle logo"></img>
                        </Link>
                    </div>
                    <small className='fs-70 text-uppercase'>
                        {businessProfileSettings.businessName}
                    </small>
                </div>
                {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
                <div className="ms-auto me-3 navbar-nav">
                    <div className="nav-item text-nowrap d-none d-md-block">
                        <button className="nav-link px-3" >Sign out</button>
                    </div>
                </div>
                <div className='d-flex align-items-center gap-2 d-md-none'>
                    <button className="rounded-0 border-0 box-shadow-none clickDown" type="button" onClick={() => setShowCreatePropertyForm(true)}>
                        <Plus weight='bold' fill='var(--bs-primary)' />
                    </button>
                    <button ref={sideNavbarTogglerRef} className="rounded-0 border-0 navbar-toggler" type="button" aria-controls="sidebarMenu" aria-label="Toggle navigation" onClick={() => setSideNavbarIsFloated(!sideNavbarIsFloated)}>
                        <List />
                    </button>
                </div>
            </header>
            <main className="container-fluid">
                <div className="row">
                    {/* Sidebar Navigation */}
                    <nav className={`col-12 col-md-3 col-xl-2 d-md-block border-end overflow-y-auto sidebar ${sideNavbarIsFloated ? 'floated' : ''}`} id="sidebarMenu">
                        <div ref={sideNavbarRef} className="position-sticky top-0 h-fit col-8 col-sm-5 col-md-12 pt-3 pt-md-2 pb-3 peak-borders-tb">
                            {/* <button type="button" className='btn col-11 col-md-auto flex-center mt-2 mt-md-0 mb-4 mb-md-3 mx-auto px-4 py-3 rounded-4 bg-gray-600 text-gray-300 shadow-sm clickDown'>
                                <Plus className='me-2' />
                                New property
                            </button> */}
                            <button type="button" className='btn col-11 col-md-auto flex-center mt-2 mt-md-0 mb-4 mb-md-3 mx-auto px-4 py-3 rounded-4 border border-secondary border-opacity-25 text-gray-600 shadow-sm clickDown'
                                onClick={() => { hideSideNavbar(); setShowCreatePropertyForm(true) }}>
                                <Plus className='me-2' />
                                New property
                            </button>
                            <ul className="nav flex-column">
                                <li className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("dashboard"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChartPieSlice size={20} weight='fill' className="me-2" /> Dashboard
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'properties' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("properties"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <Building size={20} weight='fill' className="me-2" /> Properties
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'orders' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("orders"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ShoppingCart size={20} weight='fill' className="me-2" /> Orders
                                    </button>
                                    {openDealsNum > 0 &&
                                        <span
                                            className='r-middle-m h-1rem flex-center me-3 px-2 bg-gray-300 text-gray-900 fs-60 fw-medium rounded-pill'
                                            style={{ lineHeight: 1 }}>
                                            {openDealsNum}
                                        </span>
                                    }
                                </li>
                                <li className={`nav-item ${activeSection === 'reports' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("reports"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChartBar size={20} weight='fill' className="me-2" /> Reports
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'messages' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("messages"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChatDots size={20} weight='fill' className="me-2" /> Messages
                                    </button>
                                    {notRepliedMessages.length > 0 &&
                                        <span
                                            className='r-middle-m h-1rem flex-center me-3 px-2 bg-gray-300 text-gray-900 fs-60 fw-medium rounded-pill'
                                            style={{ lineHeight: 1 }}>
                                            {notRepliedMessages.length}
                                        </span>
                                    }
                                </li>
                                <li className={`nav-item ${activeSection === 'usersList' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("usersList"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <User size={20} weight='fill' className="me-2" /> Users List
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'settings' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("settings"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <Gear size={20} weight='fill' className="me-2" /> Settings
                                    </button>
                                </li>

                                <hr className={`d-md-none`} />

                                <li className={`nav-item mb-3 d-md-none`}>
                                    <button className="nav-link w-100">
                                        <SignOut size={20} weight='fill' className="me-2" /> Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Content Area */}
                    <div className="col-md-9 col-xl-10 ms-sm-auto px-md-4">
                        {renderContent()}

                        {/* Prompt actions */}
                        <ActionPrompt
                            show={showPrompt}
                            // isStatic
                            message={promptMessage}
                            type={promptType}
                            inputType={promptInputType}
                            selectInputOptions={promptSelectInputOptions}
                            promptInputValue={promptInputValue}
                            inputPlaceholder={promptInputPlaceholder}
                            action={() => { promptAction(); setPromptActionWaiting(true); }}
                            actionIsWaiting={promptActionWaiting}
                            onClose={resetPrompt}
                        />

                        {/* Dialog actions */}
                        <ConfirmDialog
                            show={showConfirmDialog}
                            message={confirmDialogMessage}
                            type={confirmDialogType}
                            action={() => { confirmDialogAction(); setConfirmDialogActionWaiting(true); }}
                            actionText={confirmDialogActionText}
                            actionIsWaiting={confirmDialogActionWaiting}
                            closeText={confirmDialogCloseText}
                            onClose={resetConfirmDialog}
                            onCloseCallback={confirmDialogCloseCallback}
                        />

                        {/* Reply to messages */}
                        {showContactUsMessage &&
                            <div className='position-fixed fixed-top inset-0 py-md-3 px-lg-5 inx-high message-reply-comp'>
                                <div className="d-flex flex-column col-md-9 col-lg-8 col-xl-7 h-100 overflow-auto mx-auto bg-gray-300 message-reply">
                                    {/* Chat header */}
                                    <div className={`position-sticky sticky-top bg-dark d-flex align-items-center p-2 px-md-3 shadow-sm`}>
                                        <ArrowLeft size={30} className={`me-2 text-gray-500 flex-shrink-0 ${sendingReply ? 'cursor-not-allowed' : 'ptr'} clickDown`}
                                            onClick={() => { !sendingReply && setShowContactUsMessage(false) }}
                                        />
                                        <div className='flex-grow-1 d-flex align-items-center justify-content-between'>
                                            <div className='d-grid fs-80 person-info'>
                                                <span className={`fw-bold text-gray-200 text-truncate person-info__name`}>
                                                    {replyTo.name}
                                                </span>
                                                <span className='text-gray-400 small text-truncate person-info__email'>
                                                    {replyTo.email}
                                                </span>
                                            </div>
                                            <div className='d-grid ms-3 fs-80 message-cta'>
                                                {!replyTo.replied ?
                                                    <span className='text-end text-gray-300'>Replying</span>
                                                    :
                                                    <CheckCircle className='mx-auto text-gray-300' />
                                                }
                                                <span className={`mt-1 fw-bold text-gray-300 text-nowrap small`}>
                                                    {formatDate(replyTo.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat body */}
                                    <div className='flex-grow-1 d-flex flex-column'>
                                        {/* Messages space */}
                                        <div className={`px-2 py-3 d-flex flex-column chat-space`}>
                                            <div className='position-relative ms-2 mb-4 p-2 pb-1 small message-body message-body-sender'>
                                                <p className='mb-1'>
                                                    {replyTo.message}
                                                </p>
                                                <div className='d-flex align-items-center justify-content-end message-footer'>
                                                    <span className='fs-80'>{getDateHoursMinutes(replyTo.createdAt)}</span>
                                                </div>
                                            </div>
                                            {replyTo.replied && replyTo.reply &&
                                                <>
                                                    {
                                                        replyTo.createdAt !== replyTo.updatedAt &&
                                                        <div className='w-fit mx-auto mb-4 px-3 badge bg-gray-600 fw-normal fs-65 rounded-pill'>
                                                            {formatDate(replyTo.updatedAt, { todayKeyword: true })}
                                                        </div>

                                                    }
                                                    <div className='position-relative ms-auto me-2 mb-4 p-2 pb-1 small message-body message-body-responder'>
                                                        <p className='mb-1'>
                                                            {replyTo.reply}
                                                        </p>
                                                        <div className='d-flex align-items-center justify-content-end gap-2 message-footer'>
                                                            <span className='fs-80'>{getDateHoursMinutes(replyTo.updatedAt)}</span> <Check />
                                                        </div>
                                                    </div>

                                                </>
                                            }
                                        </div>

                                        {/* Reply space */}
                                        {!replyTo.replied ?
                                            <div className='p-2 mt-auto' style={{ bottom: 0 }}>
                                                <textarea id="messageReplyInput" name="MessageReply" className="form-control bg-gray-400 rounded-0" cols="30" rows="5" placeholder="Enter a reply message" required value={replyMessage} onChange={e => { setReplyMessage(e.target.value) }}></textarea>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm btn-secondary flex-center w-100 py-3 px-4 fw-bold rounded-0 clickDown"
                                                    id="sendReplyBtn"
                                                    onClick={(e) => !sendingReply && handleMessageReply(e, replyTo)}
                                                    disabled={sendingReply} // Optionally, disable button when sending
                                                >
                                                    {!sendingReply ?
                                                        <>Reply <PaperPlaneRight size={18} weight='duotone' className='ms-2' /></>
                                                        : <>Replying <span className="spinner-grow spinner-grow-sm ms-2"></span></>
                                                    }
                                                </button>
                                            </div>
                                            :
                                            <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto mt-auto mb-5 p-3 rounded">
                                                <CheckCircle size={40} weight='fill' className="w-4rem h-4rem d-block mx-auto mb-2 text-success" />
                                                <p className="text-center text-gray-800 fw-bold small">Message replied.</p>
                                                <button className="btn btn-sm btn-outline-dark d-block mx-auto px-3 rounded-pill" onClick={() => setShowContactUsMessage(false)}>
                                                    OK
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {/* Fixed components */}

                {/* Property preview card */}
                <BottomFixedCard
                    show={showSelectedPropertyInfo}
                    content={[
                        <PropertyPreview
                            setDontCloseCard={setDontCloseCard}
                            setRefreshProperties={setRefreshProperties}
                        />
                    ]}
                    blurBg
                    // closeButton={<X size={35} weight='bold' className='p-2' />}
                    closeButton
                    onClose={() => setShowSelectedPropertyInfo(false)}
                    className="pb-3"
                    avoidCloseReasons={dontCloseCard}
                />

                {/* Subscriber preview card */}
                <BottomFixedCard
                    show={showSelectedSubscriberInfo}
                    content={[
                        <SubscriberPreview
                            setRefreshSubscribers={setRefreshSubscribers}
                        />
                    ]}
                    blurBg
                    onClose={() => setShowSelectedSubscriberInfo(false)}
                    className="pb-3"
                />

                {/* Add Property Form */}
                {showCreatePropertyForm &&
                    <>
                        <div className='position-fixed fixed-top inset-0 bg-black2 py-3 inx-high add-property-form'>
                            <div className="container col-md-8 col-lg-7 col-xl-6 peak-borders-b overflow-auto" style={{ animation: "zoomInBack .2s 1", maxHeight: '100%' }}>
                                <div className="container h-100 bg-light text-gray-700 px-3">
                                    <h6 className="sticky-top flex-align-center justify-content-between mb-0 pt-3 pb-2 bg-light text-gray-600 border-bottom text-uppercase">
                                        <div className='flex-align-center'>
                                            <RowsPlusBottom weight='fill' className="me-1" />
                                            <span style={{ lineHeight: 1 }}>Add a new property</span>
                                        </div>
                                        <div title="Cancel" onClick={() => { setShowCreatePropertyForm(false) }}>
                                            <X size={25} className='ptr' />
                                        </div>
                                    </h6>

                                    {/* Type selection */}
                                    <div className="my-2 text-primary smaller grid-center">
                                        <p className='mb-0 text-center fw-bold smaller'>Select property type</p>
                                        <CaretDown />
                                    </div>
                                    <ul className='d-flex flex-wrap justify-content-lg-center gap-1 mb-4 p-2 bg-primary-subtle border-start border-end border-2 border-primary fw-bold text-center text-balance'>
                                        {aboutProperties.allTypes
                                            .sort((a, b) =>
                                                a.localeCompare(b)
                                            )
                                            .map((val, index) => (
                                                <li key={index} className={`btn btn-sm ${newPropertyType === val ? 'btn-primary' : ''} px-3 py-1 rounded-pill smaller ptr clickDown`}
                                                    onClick={() => setNewPropertyType(val)}>
                                                    {val}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className="my-2 text-primary smaller grid-center">
                                        <p className='mb-0 text-center fw-bold smaller'>Add details</p>
                                        <CaretDown />
                                    </div>

                                    {/* The form */}
                                    <form onSubmit={(e) => handleCreateProperty(e)} className="px-sm-2 pb-3">
                                        <div className="mb-4 form-text text-gray-600">
                                            Add the main details for the <span className='text-lowercase'>{newPropertyType}</span> property. <b>Feel free to skip</b> fields that are not required or unavailable.
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label" required>Property Name</label>
                                            <input type="text" id="name" name="name" className="form-control" required placeholder="Enter name" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="location" className="form-label" required>Location</label>
                                            <input type="text" id="location" name="location" className="form-control" placeholder="Eg: Kiyovu - Kigali, or KG Ave 23 Kicukiro" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select id="category" name="category" className="form-select"
                                                defaultValue={aboutProperties.allCategories[0]}
                                                required>
                                                {aboutProperties.allCategories
                                                    .map((val, index) => (
                                                        <option key={index} value={val} className='p-2 px-3 small'>
                                                            {val}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="about" className="form-label" required>About the Property</label>
                                            <textarea rows={5} id="about" name="about" className="form-control" placeholder="Provide a brief description"></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label" required>Price (RWF)</label>
                                            <input type="number" id="price" name="price" className="form-control" required placeholder="Enter the price" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="payment" className="form-label">Payment method</label>
                                            <select id="payment" name="payment" className="form-select"
                                                defaultValue=""
                                                required>
                                                <option value="" disabled className='p-2 px-3 small text-gray-500'>Select method</option>
                                                {aboutProperties.paymentMethods
                                                    .map((val, index) => (
                                                        <option key={index} value={val} className='p-2 px-3 small'>
                                                            {val}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        {(newPropertyType === "House" || newPropertyType === "Apartment") && (
                                            <>
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
                                                        <input type="number" id="bedrooms" name="bedrooms" className="form-control" placeholder="N° of bedrooms" />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
                                                        <input type="number" id="bathrooms" name="bathrooms" className="form-control" placeholder="N° of bathrooms" />
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="kitchens" className="form-label">Kitchens</label>
                                                        <input type="number" id="kitchens" name="kitchens" className="form-control" placeholder="N° of kitchens" />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="garages" className="form-label">Garages</label>
                                                    <input type="number" id="garages" name="garages" className="form-control" placeholder="N° of garages" />
                                                </div>
                                            </>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="area" className="form-label">Area (sq. meters)</label>
                                            <input type="text" id="area" name="area" className="form-control" placeholder="Enter the area" />
                                        </div>
                                        {newPropertyType !== "Land Plot" && (
                                            <>
                                                <div className="mb-3">
                                                    <label htmlFor="furnished" className="form-label">Furnished</label>
                                                    <select id="furnished" name="furnished" className="form-select">
                                                        <option value="1" className='small'>Furnished</option>
                                                        <option value="0" className='small'>Not Furnished</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="featured" className="form-label">Featured/Pinned</label>
                                            <select id="featured" name="featured" className="form-select" defaultValue={0}>
                                                <option value="0" className='small'>Not Featured</option>
                                                <option value="1" className='small'>Featured</option>
                                            </select>
                                        </div>

                                        {/* Add record */}
                                        <div className='mb-3 p-3 bg-primary-subtle border-start border-end border-2 border-primary'>
                                            <div className="my-2 text-primary smaller grid-center">
                                                <p className='mb-0 text-center fw-bold smaller'>Next steps</p>
                                                <CaretDown />
                                            </div>
                                            <div className="mb-4 form-text text-gray-700">
                                                Add the property now and complete the details later (e.g., images). <b>Note: At least 5 images are required for listing visibility</b>.
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-primary flex-center w-100 mt-3 py-2 px-4 rounded-pill clickDown" id="addPropertyBtn"
                                            >
                                                {!isWaitingAdminEditAction ?
                                                    <>Add Property <Plus size={18} className='ms-2' /></>
                                                    : <>Working <span className="spinner-grow spinner-grow-sm ms-2"></span></>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {/* Close Property Form */}
                {showClosePropertyForm &&
                    <>
                        <div className='position-fixed fixed-top inset-0 bg-black2 py-5 inx-high close-property-form'>
                            <div className="container col-md-8 col-lg-7 col-xl-6 peak-borders-b overflow-auto" style={{ animation: "zoomInBack .2s 1", maxHeight: '100%' }}>
                                <div className="container h-100 bg-light text-gray-700 px-3">
                                    <h6 className="sticky-top flex-align-center justify-content-between mb-0 pt-3 pb-2 bg-light text-gray-600 border-bottom text-uppercase">
                                        <div className='flex-align-center'>
                                            <SealCheck weight="fill" className="me-1" />
                                            <span style={{ lineHeight: 1 }}>Close a property</span>
                                        </div>
                                        <div title="Cancel" onClick={() => { activeSection === 'properties' && setShowSelectedPropertyInfo(true); setShowClosePropertyForm(false) }}>
                                            <X size={25} className='ptr' />
                                        </div>
                                    </h6>
                                    <div className='h6 my-4 px-2 border-start border-end border-2 border-secondary fw-bold text-center text-balance'>{selectedProperty.name}</div>
                                    <p className="smaller text-gray-700">
                                        Marking this property as <strong>closed</strong> will restrict all future activities related to it, including reservations and inquiries from clients and site visitors.
                                        <strong className="text-danger"> This action is permanent and cannot be undone.</strong>
                                    </p>
                                    {/* Toggle between email selection modes */}
                                    <div className="d-flex justify-content-center my-4">
                                        {selectedProperty.booked && (
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${closeBookedProperty ? 'btn-secondary' : 'btn-outline-secondary'} col-6 flex-center px-3 rounded-0`}
                                                onClick={() => setCloseBookedProperty(true)}
                                            >
                                                Reserved email
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${!closeBookedProperty ? 'btn-secondary' : 'btn-outline-secondary'} col-6 flex-center px-3 rounded-0`}
                                            onClick={() => setCloseBookedProperty(false)}
                                        >
                                            Type email
                                        </button>
                                    </div>
                                    {/* Conditional Rendering Based on Email Selection Mode */}
                                    {closeBookedProperty ? (
                                        <>
                                            {/* Select Dropdown for Reserved Emails */}
                                            <label htmlFor="reservedEmail" className="form-label small">
                                                Select closer email
                                            </label>
                                            <select
                                                id="reservedEmail"
                                                className="form-select mb-3"
                                                value={closePropertyEmail}
                                                onChange={(e) => setClosePropertyEmail(e.target.value)}
                                            >
                                                <option value="" disabled>
                                                    Select email...
                                                </option>
                                                {JSON.parse(selectedProperty.bookedBy).map((email) => (
                                                    <option key={email} value={email}>
                                                        {email}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            {/* Manual Email Input */}
                                            <label htmlFor="manualEmail" className="form-label small">
                                                Enter closer email
                                            </label>
                                            <input
                                                id="manualEmail"
                                                type="email"
                                                className="form-control mb-3"
                                                placeholder="Enter email address"
                                                value={closePropertyEmail}
                                                onChange={(e) => setClosePropertyEmail(e.target.value)}
                                            />
                                        </>
                                    )}
                                    {/* Property cover */}
                                    <img src={selectedProperty.cover} alt="Property cover" className='h-15vh object-fit-cover my-3 peak-borders-t' />
                                    {/* Form Action Buttons */}
                                    <div className="modal-footer justify-content-around px-2 px-sm-3" style={{ translate: '0 -75%' }}>
                                        <button
                                            type="button"
                                            className={`col-sm-5 btn btn-light text-secondary rounded-0 border-0 ${isWaitingAdminEditAction ? 'opacity-25' : 'opacity-75'} clickDown`}
                                            disabled={isWaitingAdminEditAction}
                                            onClick={() => setShowClosePropertyForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className={`col-sm-5 btn btn-dark flex-center ms-auto px-3 rounded-0 clickDown`}
                                            onClick={() => closeProperty(closePropertyEmail)}
                                            disabled={isWaitingAdminEditAction || !closePropertyEmail}
                                        >
                                            {!isWaitingAdminEditAction ? (
                                                <>
                                                    Close property <SealCheck size={18} className="ms-2" />
                                                </>
                                            ) : (
                                                <>
                                                    Working <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </main>
        </>
    )
}

export default Admin;
