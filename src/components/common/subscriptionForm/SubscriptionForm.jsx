import React, { useEffect, useState } from "react";
import useCustomDialogs from "../../hooks/useCustomDialogs";
import './subscriptionForm.css';
import MyToast from "../Toast";

const SubscriptionForm = ({ email, onClose, setDontCloseCard }) => {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,
    } = useCustomDialogs();

    const [subscType, setSubscType] = useState(['all']);
    const [subscCategory, setSubscCategory] = useState('all');

    // Setting Type
    const handleTypeCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (value === "all") {
            // Clear other selections and set only "All"
            if (checked) {
                setSubscType(['all']);
            } else {
                setSubscType([]);
            }
        } else {
            // Remove "All" If another option is selected
            setSubscType((prev) => {
                if (prev.includes('all')) {
                    return [value];
                } else if (checked) {
                    // Add value if checked
                    return [...prev, value];
                } else {
                    // Remove value if unchecked
                    return prev.filter((category) => category !== value);
                }
            });
        }
    };

    // Short content for each type
    const typeContent = {
        all: "You will receive updates about all property types, including houses, apartments, offices, and more.",
        house: "Get notified about the latest houses available for rent or sale in your preferred locations.",
        apartment: "Stay informed about new apartments hitting the market for rent or sale.",
        office: "Receive alerts about available office spaces in commercial or residential areas.",
        land: "Be the first to know about new land plots for sale in various neighborhoods.",
        commercial: "Get updates about commercial properties for business or investment purposes.",
        general: "You've selected multiple types, and we'll keep you updated about all of them.",
        none: "Choose your type of properties and we'll keep you posted about their availability.",
    };

    // Determine which message content to display based on selection
    const displayContent = () => {
        switch (true) {
            case subscType.includes('all'):
                return typeContent.all;
            case subscType.length === 1:
                return typeContent[subscType[0]];
            case subscType.length === 0:
                return typeContent.none;
            default:
                return typeContent.general;
        }
    };

    // Submit subscription
    const [isWaitingSubscription, setIsWaitingSubscription] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const types = subscType;
        const categories = subscCategory;
        const subscription = { email, subscriptionType: { types, categories } };

        try {
            setIsWaitingSubscription(true);
            const response = await fetch('http://localhost:5000/subscription', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
            });

            if (response.ok) {
                const data = await response.json();
                // Reset form
                setSubscType(['all']);
                setSubscCategory('all');
                // Respond
                toast({ message: data.message, type: 'dark' });
                // Close/hide form
                setTimeout(() => {
                    onClose();
                }, 3500);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                toast({ message: 'Something went wrong. You can try again' });
            }
        } catch (error) {
            console.error('Request failed:', error);
            toast({ message: 'Owc! Could not get your request. Check your connection and try again', type: 'warning' });
        } finally {
            setIsWaitingSubscription(false);
        }
    };

    // Prevent closing the card/form
    useEffect(() => {
        const reasonsToTrack = [
            { name: 'isWaitingSubscription', state: isWaitingSubscription },
        ];

        setDontCloseCard(prev => {
            // Add component reasons and then remove false ones
            const activeReasons = [...prev, ...reasonsToTrack]
                .filter((reason) => reason.state)
                .map((reason) => ({ name: reason.name, value: true }));
            return [...activeReasons];
        });
    }, [isWaitingSubscription, setDontCloseCard]);

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            <div className="text-muted">
                <h3 className="h6 text-center fw-bold">SUBSCRIBE TO</h3>
                <form onSubmit={handleSubmit} className="subscription-form">
                    <div className="form-check form-switch d-flex flex-wrap justify-content-sm-evenly gap-3 mb-0 p-3">
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscAll"
                                name="subscType"
                                value="all"
                                checked={subscType.includes('all')} // Checked if "All" is in the array
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscAll">All</label>
                        </div>
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscHouse"
                                name="subscType"
                                value="house"
                                checked={subscType.includes('house')}
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscHouse">Houses</label>
                        </div>
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscApartment"
                                name="subscType"
                                value="apartment"
                                checked={subscType.includes('apartment')}
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscApartment">Apartments</label>
                        </div>
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscOffice"
                                name="subscType"
                                value="office"
                                checked={subscType.includes('office')}
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscOffice">Offices</label>
                        </div>
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscCommercial"
                                name="subscType"
                                value="commercial"
                                checked={subscType.includes('commercial')}
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscCommercial">Commercials</label>
                        </div>
                        <div className='flex-shrink-0 text-nowrap ms-5'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subscLand"
                                name="subscType"
                                value="land"
                                checked={subscType.includes('land')}
                                onChange={handleTypeCheckboxChange}
                            />
                            <label className="form-check-label ms-0" htmlFor="subscLand">Land Plots</label>
                        </div>
                    </div>
                    <div className='form-text position-relative mb-4 p-3 alert alert-dark'>
                        <div className="position-absolute top-0 mx-auto px-3 border rounded-2 small"
                            style={{ translate: "0 -50%", backgroundColor: "var(--bs-alert-bg)", borderColor: 'var(--bs-dark-border-subtle) !important', letterSpacing: '0.5px' }}
                        >
                            {email}
                        </div>
                        <div className="small">
                            {displayContent()}
                        </div>
                        <div className="form-check form-switch d-flex flex-wrap gap-3 mb-0 p-3">
                            <div className='flex-shrink-0 flex-grow-1 text-nowrap ms-5'>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="subsCategorycAll"
                                    name="subscCategory"
                                    value="all"
                                    checked={subscCategory === 'all'}
                                    onChange={(e) => setSubscCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-0" htmlFor="subsCategorycAll">All</label>
                            </div>

                            <div className='flex-shrink-0 flex-grow-1 text-nowrap ms-5'>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="subsCategoryForRent"
                                    name="subscCategory"
                                    value="For Rent"
                                    checked={subscCategory === 'For Rent'}
                                    onChange={(e) => setSubscCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-0" htmlFor="subsCategoryForRent">For Rent</label>
                            </div>

                            <div className='flex-shrink-0 flex-grow-1 text-nowrap ms-5'>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="subsCategoryForSale"
                                    name="subscCategory"
                                    value="For Sale"
                                    checked={subscCategory === 'For Sale'}
                                    onChange={(e) => setSubscCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-0" htmlFor="subsCategoryForSale">For Sale</label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-dark w-100 px-5 rounded-pill clickDown" disabled={!subscType.length}>
                        Subscribe
                        {isWaitingSubscription &&
                            <span className="spinner-grow spinner-grow-sm ms-2"></span>
                        }
                    </button>
                </form>
            </div>
        </>
    );
};

export default SubscriptionForm;
