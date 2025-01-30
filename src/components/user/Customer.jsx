import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import './customer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { PropertiesContext } from '../../App';
import { ArrowLeft, BellRinging, BellSimpleSlash, Bookmark, Building, Calendar, CalendarCheck, CaretDoubleRight, CaretDown, CaretRight, ChartBar, ChartPieSlice, ChatDots, ChatsTeardrop, Check, CheckCircle, CheckSquare, CircleWavyCheck, CreditCard, Dot, Envelope, EnvelopeSimple, Eraser, Eye, EyeSlash, FloppyDisk, Gear, HandCoins, Heart, HourglassHigh, HouseLine, IdentificationBadge, Image, Info, List, ListDashes, MagnifyingGlass, MapPinArea, MapTrifold, Money, MoneyWavy, Mountains, PaperPlaneRight, Pen, Phone, Plus, PushPinSimple, PushPinSimpleSlash, RowsPlusBottom, SealCheck, ShareFat, ShoppingCart, Shower, SignOut, SortAscending, SortDescending, Storefront, Swap, Table, TextAlignLeft, TextAUnderline, Trash, User, UserCheck, Video, Warning, WarningCircle, WhatsappLogo, X } from '@phosphor-icons/react';
import { cError, cLog, deepEqual, formatDate, getDateHoursMinutes, isValidEmail } from '../../scripts/myScripts';
import MyToast from '../common/Toast';
import BottomFixedCard from '../common/bottomFixedCard/BottomFixedCard';
import ActionPrompt from '../common/actionPrompt/ActionPrompt';
import ConfirmDialog from '../common/confirmDialog/ConfirmDialog';
import { companyPhoneNumber1 } from '../data/Data';
import LoadingBubbles from '../common/LoadingBubbles';
import FetchError from '../common/FetchError';
import { useSettings } from '../SettingsProvider';
import axios, { BASE_URL } from '../../api/axios';
import { AuthContext } from '../AuthProvider';
import BusinessLogoName from '../common/BusinessLogoName';
// import userPlaceholderImg from '/images/user_placeholder_image.jpg';
// import userPlaceholderImg from '/images/user_placeholder_image.jpg';

const Customer = () => {

    // Get user data
    const { userId } = useParams();
    const [signedUser, setSignedUser] = useState([]);
    console.log(signedUser);

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

    const { isAuthenticated, checkAuthOnMount, accessToken, logout } = useContext(AuthContext);

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
    // const [activeSection, setActiveSection] = useState("settings");

    // __Properties
    const { propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties } = useContext(PropertiesContext);

    const allProperties = useMemo(() => (
        propertiesContext
    ), [propertiesContext]);
    const totalProperties = allProperties.length;

    // Filtered properties
    // Count booked properties
    const bookedProperties = useMemo(() => {
        return allProperties.filter(
            property => (
                JSON.parse(property.bookedBy)?.includes(signedUser.email)
                && property.booked
                && !property.closed
            )
        );
    }, [allProperties, signedUser]);
    const bookedPropertiesNum = bookedProperties.length;

    // Count closed properties
    const closedProperties = useMemo(() => {
        return allProperties
            .filter(
                property => (
                    property.closed
                    && property.closedBy === signedUser.email
                )
            );
    }, [allProperties, signedUser]);
    const closedPropertiesNum = closedProperties.length;


    const [propertyListingFormat, setPropertyListingFormat] = useState('list');

    // Filter Properties by search bar
    const propSearcherRef = useRef();
    const [propSearchValue, setPropSearchValue] = useState('');

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


    // Handle request property closure
    const requestPropertyClosure = async (propertyId) => {
        try {
            const response = await axios.post(`/property/${propertyId}/close-request`, { customerEmail: signedUser.email });
            resetConfirmDialog();
            toast({
                message: <><SealCheck size={22} weight='fill' className='me-1 opacity-50' /> {response.data.message}</>,
                type: 'gray-800'
            });
            fetchProperties();
            return response.data; // Return the response data for further use
        } catch (error) {
            console.error("Error requesting property closure:", error.response?.data || error.message);
            toast({
                message: <><WarningCircle size={22} weight='fill' className='me-1 opacity-50' /> {error.response?.data}</>,
                type: 'warning'
            });
            throw error; // Re-throw the error to handle it outside
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
                                            const { name, price, currency, payment, closedOn, closedBy } = property;

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
                                                                    Price:{" "}<span>{currency} {price.toLocaleString()}</span>
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
            const response = await fetch(`${BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCustomers(data);
            setCustomersToShow(data);
            setSignedUser(data.filter(u => u.id === Number(userId))[0]);
            setErrorLoadingCustomers(null);
        } catch (error) {
            setErrorLoadingCustomers("Failed to load customers. Click the button to try again.");
            cError("Error fetching customers:", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    // console.log(customers);

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
                    <div className="p-4 col-xl-8 clip-text-gradient">
                        <p className="mb-3 text-justify">
                            <span className='fs-3'>Welcome {signedUser.name}</span> <br />
                            With your dashboard, you can manage your activities and interactions on the platform effortlessly. Here's what you can do:
                        </p>
                        <ul className="mb-0 list-unstyled">
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">View Your Properties:</b> Track and manage properties you've reserved, purchased, or favorited.</li>
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Track Your Orders:</b> Monitor your property reservations and finalized deals.</li>
                            <li className="ps-3 my-4 border-start border-2 border-success border-opacity-25"><b className="me-1">Manage Setting:</b> Review your personal information shared with us.</li>
                        </ul>
                        <a href="#siteStats" className='btn brn-lg d-grid d-xl-none mx-auto mt-4 mt-md-5 text-decoration-none border-0 fw-bold fs-4' style={{ placeItems: 'center' }}>
                            Site activity <CaretDown className='ms-2 opacity-50' />
                        </a>
                    </div>
                    <div className='d-none d-xl-block col-xl-4 py-3 text-gray-600 clickDown wavy-borders-tb'
                        style={{ backgroundImage: 'linear-gradient(150deg, rgba(195, 133, 0, .15), rgba(39, 128, 157, .15))' }}
                    >
                        <div className='dim-100 flex-center'>
                            <ul className='list-unstyled m-0'>
                                <li className="my-3 py-1 ptr">
                                    <a href="#siteStats" className='text-decoration-none text-gray-600 fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Site activity </a>
                                </li>
                                <li className="my-3 py-1 ptr"
                                    onClick={() => setActiveSection("orders")}
                                >
                                    <span className='fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Orders </span>
                                </li>
                                <li className="my-3 py-1 ptr"
                                    onClick={() => setActiveSection("settings")}
                                >
                                    <span className='fw-bold fs-4'><CaretRight className='me-2 opacity-75' /> Settings </span>
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
                            <span className="display-5 mx-auto">{bookedPropertiesNum}</span>
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
                    {/* <div className="col-6 col-lg-4 col-xl-3 position-relative mb-3 mx-0 px-2">
                        <div className="position-relative isolate d-grid justify-content-center mx-0 p-3 rad-10 overflow-hidden bg-gray-200 text-gray-600 shadow-sm ptr clickDown"
                            onClick={() => setActiveSection("usersList")}
                        >
                            <span className="fs-6 mb-3 mb-xl-4 fw-bold">Subscribers</span>
                            <span className="display-5 mx-auto">{totalSubscribers}</span>
                        </div>
                        <BellRinging size={22} className='position-absolute b-0 r-0 me-3 mb-2 text-gray-500' />
                    </div> */}
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

    const Orders = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Orders</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Track your reserved properties and finalize your next steps.
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
                {!loadingProperties && !errorLoadingProperties && bookedPropertiesNum === 0 &&
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 info-message">
                        <ShoppingCart size={80} className="text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            No orders yet. Property reservations/orders will be listed and managed here as they come in.
                        </p>
                    </div>
                }
                {/* Available content */}
                {!loadingProperties && !errorLoadingProperties && bookedPropertiesNum > 0 &&
                    <>
                        <div className='container mb-4 py-3 border border-2'>
                            <h4 className='text-info-emphasis mb-4 fs-4 text-uppercase'>Reserved properties ( {bookedPropertiesNum} )</h4>
                            <div className='alert alert-info small'>
                                <div className='grid-center'>
                                    <p>
                                        <Info size={20} className='me-1' /> Reserved properties are temporarily held for you, awaiting your confirmation or payment. While reserved, they are unavailable for others. However, multiple users can reserve the same property, with the deal finalized by the first successful confirmation.
                                    </p>
                                    <CaretDown />
                                </div>
                            </div>
                        </div>
                        <div className='row align-items-stretch'>
                            {bookedProperties
                                .map((property, index) => {
                                    const { name, type, category, price, currency, payment, location, bookedBy, closeRequests } = property;
                                    const orderEmails = JSON.parse(bookedBy);
                                    let closeRequestsEmails = [];
                                    if (closeRequests) {
                                        closeRequestsEmails = JSON.parse(property.closeRequests)
                                    }
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
                                                    <CaretDoubleRight weight="bold" size={17} className='ms-auto me-2 opacity-75 ptr clickDown' onClick={() => goToProperty(property.id)} title="View property" />
                                                </div>
                                                <p className='px-2 text-gray-600 smaller'>
                                                    <span style={{ color: mainColor }}>{type} {category}</span> <CaretRight /> {location}
                                                </p>
                                                <div className='mt-auto px-2'>
                                                    <div className='p-2 border-start border-end border-3'>
                                                        <div className="h6 grid-center text-gray-600 border-bottom pb-1">
                                                            <span>{currency} {price.toLocaleString()}  / {payment}</span>
                                                        </div>
                                                    </div>
                                                    {/* <div> */}
                                                    {(!closeRequests || !closeRequestsEmails.includes(signedUser.email)) ? (

                                                        <button className="w-100 btn btn-sm btn-outline-success mt-3 py-2 rounded-0 fw-light"
                                                            onClick={() => {
                                                                customConfirmDialog({
                                                                    message: (
                                                                        <>
                                                                            <h5 className="h6 border-bottom border-light border-opacity-25 mb-3 pb-2"><SealCheck size={22} weight="fill" className='opacity-75' /> Close deal request</h5>
                                                                            <div className='h5 flex-align-center flex-wrap gap-2 p-2 small border-start border-3 bg-gray-600'>
                                                                                <span>{name}</span>
                                                                            </div>
                                                                            <p>
                                                                                By requesting to close this deal, you confirm that all specified requirements have been met. You'll be notified once the deal is validated and accepted by the admin or property listing agent.
                                                                            </p>
                                                                        </>
                                                                    ),
                                                                    type: 'gray-800',
                                                                    action: () => requestPropertyClosure(property.id),
                                                                });
                                                            }}
                                                        >
                                                            Request closing this deal
                                                        </button>
                                                    ) : (closeRequests && closeRequestsEmails.includes(signedUser.email)) ? (
                                                        <div className="w-100 mt-3 py-2 fw-light flex-center text-bg-secondary smaller">
                                                            <HourglassHigh weight='fill' className='me-1 opacity-50' /> Deal closure request under review
                                                        </div>
                                                    ) : ''}
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
                        View your successfully closed deals and completed transactions.
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
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 info-message">
                        <SealCheck size={80} className="text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            Successfully closed deals will be listed here as they come in.
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
                                        <Info size={20} className='me-1' /> These properties represent successful transactions or agreements that you have finalized with the involved parties, marking them as officially closed and no longer available for inquiries or reservations unless if put back on the market in the future.
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

    const Feedback = () => (
        <section>
            {/* Section about */}
            <div className='pt-5 pb-3 d-lg-flex section-about'>
                <div>
                    <h1 className='text-center mb-4 fw-bold text-secondary'>Feedback</h1>
                    <div className="d-lg-flex px-4 fs-5 text-gray-600">
                        Create a support ticket or just give us a testimonial regarding our services.
                    </div>
                </div>
                <ChatsTeardrop size={200} className='d-none d-lg-block px-4 col-lg-4 text-gray-400 mask-bottom section-icon' />
            </div>

            {/* Section Content : Feedback */}
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
                    <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 info-message">
                        <SealCheck size={80} className="text-center w-100 mb-3 opacity-50" />
                        <p className="text-muted text-center small">
                            Successfully closed deals will be listed here as they come in.
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
                                        <Info size={20} className='me-1' /> These properties represent successful transactions or agreements that you have finalized with the involved parties, marking them as officially closed and no longer available for inquiries or reservations unless if put back on the market in the future.
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
                                <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 info-message">
                                    <ChatDots size={80} className="text-center w-100 mb-3 opacity-50" style={{ animation: 'wobbleBottom 10s infinite' }} />
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
                                            <img src='/images/user_placeholder_image.jpg' alt="logo" className="w-7rem h-7rem object-fit-cover p-2 rounded-0 img-thumbnail" />
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
            </section>
        );
    };

    // export default Settings;

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />;
            case "orders":
                return <Orders />;
            case "reports":
                return <Reports />;
            case "feedback":
                return <Feedback />;
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
                <BusinessLogoName className="p-2" />
                {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
                <div className="ms-auto me-3 navbar-nav">
                    <div className="nav-item text-nowrap d-none d-md-flex align-items-center py-md-2">
                        <div className="d-flex align-items-center me-3 border-light border-opacity-25">
                            <div className='ms-auto d-grid pb-1'>
                                <span className='ms-auto smaller'>{signedUser.name}</span>
                                <span className='ms-auto fs-70 opacity-75 text-capitalize' style={{ lineHeight: 1 }}>{signedUser.type}</span>
                            </div>
                            <img src="/images/user_placeholder_image.jpg" alt="" className='w-2_5rem ratio-1-1 object-fit-cover ms-2 d-none d-md-block border border-3 border-light bg-light rounded-circle' />
                        </div>

                        <button className="nav-link px-2 text-gray-600 rounded-pill clickDown" title='Sign out'
                            onClick={() => logout()}
                        >
                            <SignOut size={20} />
                        </button>
                    </div>
                </div>
                <div className='d-flex align-items-center gap-2 d-md-none'>
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
                            <ul className="nav flex-column">
                                <li className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("dashboard"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChartPieSlice size={20} weight='fill' className="me-2" /> Dashboard
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'orders' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("orders"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ShoppingCart size={20} weight='fill' className="me-2" /> Orders
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'reports' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("reports"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChartBar size={20} weight='fill' className="me-2" /> Reports
                                    </button>
                                </li>
                                <li className={`nav-item ${activeSection === 'feedback' ? 'active' : ''} mb-3`}
                                    onClick={() => { setActiveSection("feedback"); hideSideNavbar() }}
                                >
                                    <button className="nav-link w-100">
                                        <ChatsTeardrop size={20} weight='fill' className="me-2" /> Feedback
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

                                <li className={`nav-item mb-3 d-md-none`}
                                    onClick={() => logout()}
                                >
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

            </main>
        </>
    )
}

export default Customer;
