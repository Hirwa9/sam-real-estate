import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import './property.css';
import { AuthenticationContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import { formatBigCountNumbers, formatDate, shareProperty } from '../../scripts/myScripts';
import { ArrowBendDoubleUpRight, ArrowClockwise, Bed, Building, Car, CaretRight, ChatText, Clock, CookingPot, DeviceMobileCamera, HashStraight, Heart, Images, MapPinArea, MoneyWavy, ShareFat, Shower, Translate, VectorThree, VectorTwo } from '@phosphor-icons/react';
// import Button from '@mui/material/Button';
import PropertyMediaContainer from './PropertyMediaContainer';
import WorkingHours from '../common/workinghours/WorkingHours';
import BottomFixedCard from '../common/bottomFixedCard/BottomFixedCard';
import MediaViewer from '../common/mediaViewer/MediaViewer';
import PropertySearcher from '../common/PropertySearcher';
import LoginForm from '../common/loginForm/LoginForm';
import BackButton from '../common/BackButton';
import MyToast from '../common/Toast';
import ConfirmDialog from '../common/confirmDialog/ConfirmDialog';
import Heading from '../common/Heading';
import LoadingBubbles from '../common/LoadingBubbles';

const Property = () => {
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
        confirmDialogType,
        confirmDialogActionWaiting,
        customConfirmDialog,
        resetConfirmDialog,
    } = useCustomDialogs();

    // Auth check
    const { isLoggedIn, checkAuthentication } = useContext(AuthenticationContext);
    useEffect(() => {
        !isLoggedIn && checkAuthentication();
    }, [isLoggedIn, checkAuthentication]);

    const sendMessage = () => {
        window.open(`https://wa.me/250789305885?text=Hello%2C%20I%27m%20interested%20in%20your%20services.%20Especially%20with%20this%20property_*${name}*_%20${window.location}`, '_blank');
    }

    const { propertyId } = useParams();

    // Image viewer
    const [openImageViewer, setOpenImageViewer] = useState();
    const [scrollToImage, setScrollToImage] = useState(0);

    const [matchProperty, setMatchProperty] = useState(undefined); // Set initial state to null
    const [matchPropertyImages, setMatchPropertyImages] = useState([]);
    const [matchPropertyLikes, setMatchPropertyLikes] = useState(0); // Set initial state to null
    const [otherRelatedProperties, setOtherRelatedProperties] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    // Property like state
    const [likedProperties, setLikedProperties] = useState([]);
    useEffect(() => {
        // On mount, get liked properties from localStorage and set state
        const storedLikes = JSON.parse(localStorage.getItem('likedProperties')) || [];
        setLikedProperties(storedLikes);
    }, []);

    // Working hours
    const [showWorkingHours, setShowWorkingHours] = useState(false);
    const toggleWorkingHours = () => setShowWorkingHours(!showWorkingHours);
    const workingHoursTogglerRef = useRef(null);

    // Fetch properties
    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/properties`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Get requested property
            const foundProperty = data.find(item => item.id === Number(propertyId));
            setMatchProperty(foundProperty);

            if (foundProperty) {
                const { category, type, media, likes } = foundProperty;
                setMatchPropertyImages(JSON.parse(JSON.parse(media)).images || []);

                // Format likes
                let likesNumber = likes !== null ? Array(likes).length : 0;
                // console.log(likesNumber);
                let formattedLikes = formatBigCountNumbers(likesNumber);
                setMatchPropertyLikes(formattedLikes);

                // Related properties
                setOtherRelatedProperties(data.filter(property =>
                    property.type === type && property.category === category
                ));
            }
            setError(null); // Reset any previous errors
        } catch (error) {
            setError("Failed to load properties. Please refresh to try again.");
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);


    // Handle reload on fetch failure
    const handleReload = () => {
        fetchProperties();
    };

    // Destructure safely using optional chaining
    const {
        id, cover, category, type, name, location, about, price, payment,
        area, volume, bedrooms, bathrooms, kitchens,
        garages, furnished, videoUrl, mapUrl, booked, bookedBy, closed,
        media, likes, createdAt } = matchProperty || {};

    const mainColor = category === "For Sale" ? "#25b579" : "#ff9800";
    const mainLightColor = category === "For Sale" ? "#25b5791a" : "#ff98001a";
    const matchPropertyId = id;

    // Reserve property
    const [showLogin, setShowLogin] = useState(false);
    const [reserverError, setReserverError] = useState('');
    const reservePropertyRef = useRef();

    const handleReserveProperty = async () => {
        if (!isLoggedIn) return setShowLogin(true); // Auth
        try {
            const response = await fetch(`http://localhost:5000/property/${propertyId}/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your token logic
                }
            });
            const result = await response.json();
            if (response.ok) {
                // On success, redirect to user dashboard
                toast({ message: 'Property reserved successfully!', type: 'dark' });
                // navigate('/user/orders');
                navigate('/user');
            } else {
                setReserverError(result.message || 'Error reserving property');
                toast({ message: reserverError, type: 'warning' });
            }
        } catch (err) {
            setReserverError('Error reserving property');
        }
    };

    const LoadingSuspense = () => {
        return <LoadingBubbles icon={<Building size={50} className='loading-skeleton' />} className="h-100vh" />
    }

    const NotFoundSuspense = () => {
        return (
            <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4 h-100vh flex-center m-auto p-3 p-sm-4 error-message">
                <div>
                    <span className="fab fa-searchengin fs-1 d-block text-center text-warning mb-3"></span>
                    <p className="text-center text-muted small">No property found</p>
                    <BackButton isStatic />
                </div>
            </div>
        )
    }

    // Handle case where no property is found
    if (!loading && !error && (!matchProperty || !matchProperty.listed)) {
        return <NotFoundSuspense />
    }

    // Navigate to a property
    const goToProperty = (id) => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (id) {
            navigate(`/property/${id}`); // Navigate to the corresponding type
        }
    };

    const updateLikedProperties = (updatedLikes) => {
        setLikedProperties(updatedLikes);
        localStorage.setItem('likedProperties', JSON.stringify(updatedLikes));
    };

    // Like the property
    const handleLike = (propertyId) => {
        if (likedProperties.includes(propertyId)) return;

        const updatedLikes = [...likedProperties, propertyId];
        updateLikedProperties(updatedLikes);

        fetch(`http://localhost:5000/property/${propertyId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            if (!response.ok) {
                toast({ message: 'Couldn\'t like the property, please try again.' });
                // Rollback
                const updatedLikes = [...likedProperties.filter(id => id !== propertyId)];
                updateLikedProperties(updatedLikes);
            }
        }).finally(() => {
            const likesNumber = Array(JSON.parse(localStorage.getItem('likedProperties') || '[]')).length;
            setMatchPropertyLikes(formatBigCountNumbers(likesNumber));
        });
    };

    // Unike the property
    const handleUnlike = (propertyId) => {
        if (!likedProperties.includes(propertyId)) return;

        const updatedLikes = likedProperties.filter(id => id !== propertyId);
        updateLikedProperties(updatedLikes);

        fetch(`http://localhost:5000/property/${propertyId}/unlike`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            console.log(response)
            if (!response.ok) {
                toast({ message: 'Couldn\'t unlike the property, please try again.' });
                // Rollback
                const updatedLikes = [...likedProperties.filter(id => id !== propertyId), propertyId];
                updateLikedProperties(updatedLikes);
            }
        }).finally(() => {
            const likesNumber = Array(JSON.parse(localStorage.getItem('likedProperties') || '[]')).length;
            setMatchPropertyLikes(formatBigCountNumbers(likesNumber));
        });
    };
    // const someText = ["hirwawilly5@gmail.com", "hirwawilly55@gmail.com"]
    // console.log(JSON.stringify(someText))

    return (
        <>
            {/* Messages */}
            <ConfirmDialog
                show={showConfirmDialog}
                message={confirmDialogMessage}
                type={confirmDialogType}
                action={() => { confirmDialogAction(); }}
                actionText={confirmDialogActionText}
                actionIsWaiting={confirmDialogActionWaiting}
                closeText={confirmDialogCloseText}
                onClose={resetConfirmDialog}
            />
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />

            {/* Component */}
            <BackButton />

            {/* Loading State */}
            {loading && <LoadingSuspense />}

            {/* Error State */}
            {!loading && error && (
                <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4 h-100vh flex-center m-auto p-3 p-sm-4 error-message">
                    <div>
                        <img src="/images/fetch_error_image.jpg" alt="Error" className="w-4rem h-4rem mx-auto mb-2 opacity-50" />
                        <p className="text-center text-muted small">{error}</p>
                        <button className="btn btn-sm btn-outline-secondary d-block mx-auto border border-secondary border-opacity-25" onClick={handleReload}>
                            <ArrowClockwise weight="bold" size={18} className="me-1" /> Refresh
                        </button>
                    </div>
                </div>

            )}

            {/* Content State */}
            {!loading && !error && (
                <>
                    <PropertyMediaContainer className="px-0" primaryImage={cover} media={JSON.parse(media)} video={!closed ? videoUrl : null} map={!closed ? mapUrl : null} />

                    {/* Login form */}
                    {showLogin && <LoginForm setShowLogin={setShowLogin} toggler={reservePropertyRef} />}

                    <div className='container-fluid column-gap-3 mt-4 mt-md-0 p-3 py-5 rounded property-details'>
                        {/* Property heading */}
                        <div className='px-lg-4'>
                            <div>
                                <div>
                                    <h1 className="d-flex justify-content-between text-gray-700">
                                        {name}
                                        <span className="d-flex gap-2 align-self-start p-1 property-actions">
                                            <ShareFat size={28} className='ptr trans-p3s bounceClick' title="Share property"
                                                onClick={() => shareProperty(id, name, category)}
                                            />
                                            <span className='d-grid' style={{ justifyItems: "center" }}>
                                                {likedProperties.includes(id) ? (
                                                    <Heart size={28} weight='fill' className='ptr trans-p3s bounceClick like-icon liked'
                                                        onClick={() => handleUnlike(id)} />
                                                ) : (
                                                    <Heart size={28} className='ptr trans-p3s bounceClick like-icon'
                                                        onClick={() => handleLike(id)} />
                                                )}
                                                <span className='text-danger fw-bold' style={{ fontSize: "40%" }}>
                                                    {Number(matchPropertyLikes) !== 0 && matchPropertyLikes}
                                                </span>
                                            </span>
                                        </span>
                                    </h1>
                                    <div className='mb-0 text-muted'>
                                        <p className='d-flex align-items-start w-100'>
                                            <span>
                                                <MapPinArea size={22} weight="fill" className='text-black2 opacity-75 me-1' />{location}
                                            </span>
                                            <span className='ms-auto mx-md-4 flex-align-center text-nowrap small'>
                                                {/* <Clock size={22} weight='bold' className='text-black2 opacity-75 me-1' />{createdAt.slice(0, createdAt.indexOf('T'))} */}
                                                <Clock size={22} weight='fill' className='text-black2 opacity-75 me-1' />{formatDate(createdAt, { todayKeyword: true, longMonthFormat: true })}
                                            </span>
                                        </p>
                                        <p className='mb-0' style={{ background: mainLightColor, color: mainColor }}>
                                            {type} - {category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className='text-black2 smaller'>
                                {about}
                            </p>
                            <img src={cover} alt="Property cover" className='d-none d-md-block w-100 h-30vh object-fit-cover my-3 peak-borders-lr' style={{ borderBottom: `10px solid ${mainColor}` }} />
                        </div>
                        {/* Contact properties */}
                        <div className='h-fit col-sm-10 col-md-7 col-lg-auto mx-auto my-4 my-lg-0 side-tools'>
                            {/* Reserve or send message */}
                            {!closed &&
                                <div className='p-4 rad-15 border border-black5 shadow-sm'>
                                    <h2 className='h5 mb-4 text-center font-variant-small-caps'>Contact This Property</h2>
                                    <div>
                                        <div>
                                            <button ref={reservePropertyRef} className="btn w-100 btn-secondary text-light d-block mb-3 fw-light rounded-pill clickDown"
                                                onClick={handleReserveProperty}
                                            >
                                                Reserve Property
                                            </button>

                                            {/* <button className="btn w-100 border-dark text-dark d-block mb-3 fw-light rounded-pill clickDown">
                                Request Tour
                            </button> */}

                                            <button ref={reservePropertyRef} className="btn w-100 border-dark border-opacity-50 text-dark d-block mb-3 fw-light rounded-pill clickDown"
                                                onClick={
                                                    () => {
                                                        customConfirmDialog({
                                                            message: (
                                                                <>
                                                                    <h5 className="h6 flex-align-center border-bottom border-light border-opacity-25 mb-3 pb-2"><ChatText size={20} weight='bold' className='me-2 opacity-50' /> Chat with Us</h5>
                                                                    <p>
                                                                        Interested in this property? Connect with us on WhatsApp and get all the details!
                                                                    </p>
                                                                </>
                                                            ),
                                                            closeText: 'Maybe Later',
                                                            actionText: <>Start Chat <CaretRight /> </>,
                                                            type: 'gray-700',
                                                            action: () => { sendMessage(); resetConfirmDialog(); },
                                                        });
                                                    }
                                                }
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                        <p className='d-flex flex-column justify-content-center small clickDown'>
                                            <span className='flex-align-center mx-auto mb-3'>
                                                <DeviceMobileCamera className='me-2 fs-4 text-dark opacity-75' /> <a href="tel:+250788321583" className='text-decoration-none text-dark'>(250) 788 321 583</a>
                                            </span>
                                            {/* <span className='flex-align-center mx-auto mb-3'>
                                <DeviceMobileCamera className='me-2 fs-4 text-dark opacity-75' /> <a href="tel:+250789305885" className='text-decoration-none text-dark'>(250) 789 305 885</a>
                            </span> */}
                                        </p>
                                        <hr style={{ borderTopColor: "var(--black2)" }} />
                                        <div className='d-grid' style={{ fontSize: "80%" }}>
                                            <div className='flex-center mb-3'>
                                                <Translate size={30} weight='light' className='flex-shrink-0 opacity-50 me-2' />
                                                <div className='text-gray-600 '>
                                                    Kinyarwanda and English
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                <div className='text-gray-600 d-grid'>
                                                    <span>Open 10am - 5pm Today</span>
                                                    <span className="text-black2 fw-bold mx-auto ptr clickDown" ref={workingHoursTogglerRef} onClick={toggleWorkingHours}>See All Hours</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Working hours card */}
                                        <BottomFixedCard
                                            show={showWorkingHours}
                                            content={[
                                                <WorkingHours />
                                            ]}
                                            toggler={workingHoursTogglerRef}
                                            onClose={() => setShowWorkingHours(false)} />
                                    </div>
                                </div>
                            }
                            {/* General property searcher */}
                            <PropertySearcher className="d-none d-lg-block my-3 p-4 rad-15 border border-black5 shadow-sm" />
                        </div>

                        {/* Detailed property properties */}
                        <div className='detailed-property-properties'>
                            {/* booking status */}
                            {!closed && booked &&
                                <div className="d-flex align-items-sm-center gap-2 p-2 px-3 opacity-75 inx--1 alert alert-warning">
                                    <span className='fa fa-cart-plus me-1 mt-1 mt-sm-0'></span>
                                    <span className='smaller '>
                                        <b>{JSON.parse(bookedBy).length} potential client{JSON.parse(bookedBy).length > 1 && "s"}</b> have this property on their wishlist
                                    </span>
                                </div>
                            }
                            <div className="d-flex flex-wrap py-3 property-subproperties">
                                <div className="mb-3 px-4 fw-bold" style={{ color: mainColor }}>
                                    <h6 className='mb-0 fw-light'><MoneyWavy size={23} weight='fill' className='me-2' />Price</h6>
                                    <p className={`${closed ? 'text-decoration-line-through' : ''}`}>RwF {price.toLocaleString()} {payment === 'annually' && "/year"}
                                        {payment === 'monthly' && "/month"}
                                        {payment === 'weekly' && "/week"}
                                        {payment === 'daily' && "/day"}
                                        {payment === 'hourly' && "/hour"}
                                    </p>
                                </div>
                                {bedrooms !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><Bed size={23} weight='fill' className='me-2 text-black2' /></h6>
                                        <p>{bedrooms} Bedroom{bedrooms > 1 && "s"}</p>
                                    </div>
                                }
                                {bathrooms !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><Shower size={23} weight='fill' className='me-2 text-black2' /></h6>
                                        <p>{bathrooms} Bathroom{bathrooms > 1 && "s"}</p>
                                    </div>
                                }
                                {kitchens !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><CookingPot size={23} weight='fill' className='me-2 text-black2' /></h6>
                                        <p>{kitchens} Kitchen{kitchens > 1 && "s"}</p>
                                    </div>
                                }
                                {garages !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><Car size={23} weight='fill' className='me-2 text-black2' /></h6>
                                        <p>{garages} Carport{garages > 1 && "s"}</p>
                                    </div>
                                }
                                {area !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><VectorTwo size={23} weight='fill' className='me-2 text-black2' />Area</h6>
                                        <p>{area} m<sup>2</sup></p>
                                    </div>
                                }
                                {volume !== null &&
                                    <div className="mb-3 px-4">
                                        <h6 className='mb-0 fw-light text-muted'><VectorThree size={23} weight='fill' className='me-2 text-black2' />Volume</h6>
                                        <p>{volume} m<sup>3</sup></p>
                                    </div>
                                }
                            </div>
                            {/* Gallery inages */}
                            {matchPropertyImages.length > 4 &&
                                <div className="px-sm-2 px-md-4 py-3">
                                    <div className='d-flex align-items-center mb-2'>
                                        <Images size={30} className='me-2 me-md-3' />
                                        <h6 className='m-0 fs-5 text-muted'>Property Gallery</h6>
                                    </div>
                                    <div>
                                        <div className="d-flex flex-wrap">
                                            {
                                                matchPropertyImages.slice(0, 5).map((image, index) => (
                                                    <img key={index} src={image.url} alt={`Image_${index + 1}`} className='col-4 col-sm-3 col-xl-2 clickDown'
                                                        style={{ padding: ".125rem" }}
                                                        onClick={() => { setScrollToImage(image?.url); setOpenImageViewer(true); }}
                                                    />
                                                ))
                                            }
                                            {matchPropertyImages.length > 5 &&
                                                <div className='col-4 col-lg-3 col-xl-2 position-relative flex-grow-1 bg-black2 clickDown'
                                                    style={{
                                                        backgroundImage: `url(${matchPropertyImages[6]?.url})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        padding: ".125rem",
                                                        backgroundClip: "content-box",
                                                        userSelect: "none",
                                                        cursor: "default"
                                                    }}
                                                    onClick={() => { setScrollToImage(matchPropertyImages[6]?.url); setOpenImageViewer(true); }}
                                                >
                                                    <div className='py-3 position-absolute inset-0 grid-center bg-black2 text-light fs-3'
                                                        style={{ margin: ".125rem" }}>
                                                        + {matchPropertyImages.slice(5).length}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/* Property images fullscreen viewer */}
                                        {openImageViewer &&
                                            <MediaViewer media={matchPropertyImages} goToUrl={scrollToImage} onClose={() => setOpenImageViewer(false)} />
                                        }
                                    </div>
                                </div>
                            }
                            <div className="px-sm-2 px-md-4 py-3 d-flex">
                                <HashStraight size={30} className='me-2 me-md-3 flex-shrink-0' />
                                <div>
                                    <h6 className='fs-5 text-muted'>More-in Special</h6>
                                    <p className='small'>
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam dicta unde, nesciunt inventore est nobis error quas laboriosam perspiciatis expedita consequatur necessitatibus impedit, quisquam eius ad voluptates iure! Nihil, harum!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List other related properties */}
                    {otherRelatedProperties.length > 1 &&
                        (
                            <div className="container-fluid px-lg-4 related-properties">

                                <Heading
                                    title="Similar listing"
                                    subtitle="Continue browsing to explore more properties like this one."
                                    hType="h2"
                                />
                                {/* <h2 className='h1 ms-md-3 font-variant-small-caps' style={{ color: mainColor }}>Related Properties</h2> */}
                                <div className='d-flex justify-content-around overflow-auto'>
                                    {
                                        otherRelatedProperties
                                            .filter(property => property.id !== matchPropertyId)
                                            .map((val, index) => {
                                                const { id, cover, category, location, name, price, type } = val;
                                                return (
                                                    <div key={index} className="col-10 col-sm-5 col-md-4 mb-4 mb-md-0 p-2 p-md-3">
                                                        <div className="box">
                                                            <div className="position-relative img">
                                                                <img src={cover} alt="Property" />
                                                            </div>
                                                            <div className="text px-2 small">
                                                                <div className="d-flex align-items-center justify-content-between gap-3 my-2 category">
                                                                    <span className='px-0' style={{ background: category === "For Sale" ? "#25b5791a" : "#ff98001a", color: category === "For Sale" ? "#25b579" : "#ff9800" }}>
                                                                        {type} - {category}
                                                                    </span>
                                                                    <span className="flex-align-center px-0 text-muted fw-light ptr text-nowrap bounceClick">
                                                                        <MoneyWavy size={15} weight='fill' className='me-1' />
                                                                        {price.toLocaleString()}</span>
                                                                </div>
                                                                <h4 className="h6 m-0">{name}</h4>
                                                                <p className="text-muted small">
                                                                    <MapPinArea size={20} weight="fill" /> {location}
                                                                </p>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap column-gap-3 row-gap-1 px-3">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <button className="btn btn-sm px-lg-4 border-2 bg-warning bg-opacity-25 text-success clickDown rounded-0 shadow-sm"
                                                                        onClick={() => goToProperty(id)} >View property <ArrowBendDoubleUpRight size={16} weight="bold" className="ms-1" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                            </div>
                        )
                    }
                </>

            )}
        </>
    )
}

export default Property;