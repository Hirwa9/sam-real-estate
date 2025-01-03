import React, { useContext, useEffect, useMemo, useState } from "react";
import useCustomDialogs from "../hooks/useCustomDialogs";
import { useNavigate } from "react-router-dom";
import "./propertyCard.css";
import { PropertiesContext } from "../../App";
import {
    Heart, BuildingApartment, HouseLine, BuildingOffice, Bookmark,
    ShareFat, MapPinArea, Mountains, Storefront, Car, Shower, Bed, CircleWavyCheck,
    CaretDown, ArrowClockwise, ArrowsLeftRight, CaretRight, Plus, CaretDoubleRight
} from '@phosphor-icons/react';
import { addToCompareList, formatBigCountNumbers, shareProperty } from "../../scripts/myScripts";
import MyToast from "./Toast";
import ConfirmDialog from "./confirmDialog/ConfirmDialog";
import CompareProperties from "./compareProperties/CompareProperties";
import FetchError from "./FetchError";

const PropertyCard = ({ filterOption, filterValue, resetFilters, setFilterCount, sortStatus, limited }) => {
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

    // Get fetched properties
    const { propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties } = useContext(PropertiesContext);
    const listedProperties = useMemo(() => (
        propertiesContext
            .filter(property => property.listed)
    ), [propertiesContext]);

    const [limit, setLimit] = useState(limited ? 8 : 50);

    // Navigate to a property
    const navigate = useNavigate();
    const goToProperty = (id) => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (id) {
            navigate(`/property/${id}`); // Navigate to the property
        }
    };


    // Compare properties
    const [showPropComparison, setShowPropComparison] = useState(false);

    const compareProperty = async (id) => {
        const result = await addToCompareList(id);
        if (result.type === 'success') {
            toast({ message: result.message, type: 'info' });
        } else if (result.type === 'exists' && result.ids.length < 2) {
            return toast({ message: result.message, type: 'gray-700' });
        }

        if (result.ids.length > 1) {
            customConfirmDialog({
                message: (
                    <>
                        <h5 className="h6 flex-align-center border-bottom border-light border-opacity-25 mb-3 pb-2"><ArrowsLeftRight size={20} weight='bold' className='me-2 opacity-50' /> {result.ids.length} properties</h5>
                        <p>
                            {result.type === 'exists' ? <>{result.message}<br /><br /></> : ''}
                            {result.ids.length} properties added for comparison. See how they match up!
                        </p>
                    </>
                ),
                action: () => { setShowPropComparison(true); resetConfirmDialog() },
                actionText: <>Compare <CaretRight /> </>,
                closeText: 'Later',
            });
        }
    };

    // Set properties to show
    const [propertiesToShow, setPropertiesToShow] = useState(listedProperties);
    const propertiesToShowCount = useMemo(() => {
        return propertiesToShow.length;
    }, [propertiesToShow]);

    if (setFilterCount) {
        setFilterCount(propertiesToShowCount);
    }

    // Filter properties to show
    useEffect(() => {
        if (filterOption) {
            let filteredProperties = listedProperties.filter(val => {
                if (filterOption === 'all') return true;
                switch (filterOption) {
                    case "type":
                        return val.type.toLowerCase() === filterValue.toLowerCase();
                    case "priceRange":
                        return val.price >= Number(filterValue[0]) && val.price <= Number(filterValue[1]);
                    case "name":
                    case "location": {
                        let searchString = filterValue.toLowerCase();
                        return val.name.toLowerCase().includes(searchString) ||
                            val.location.toLowerCase().includes(searchString) ||
                            val.about.toLowerCase().includes(searchString);
                    }
                    case "bedrooms":
                        return (val.bedrooms !== null && val.bedrooms === Number(filterValue));
                    case "unfurnished":
                        return (val.furnished !== null && !val.furnished);
                    case "furnished":
                        return (val.furnished !== null && val.furnished);
                    case "featured":
                        return (val.featured !== null && val.featured && !val.closed);
                    // Combined filters (price range, category and type)
                    case "combined": {
                        const combinedFilter = filterValue;
                        const hasPriceRangeFilter = combinedFilter.priceRange[0] && combinedFilter.priceRange[1];
                        const hasPropCategoryFilter = combinedFilter.propCategorySubFilter !== '';
                        const hasPropTypeFilter = combinedFilter.propTypeSubFilter !== '';

                        const applyCombinedFilters = (val) => {
                            const filters = [
                                {
                                    isActive: hasPriceRangeFilter,
                                    check: () => val.price >= Number(combinedFilter.priceRange[0]) && val.price <= Number(combinedFilter.priceRange[1]),
                                },
                                {
                                    isActive: hasPropCategoryFilter,
                                    check: () => val.category === combinedFilter.propCategorySubFilter,
                                },
                                {
                                    isActive: hasPropTypeFilter,
                                    check: () => val.type === combinedFilter.propTypeSubFilter,
                                },
                            ];

                            // Check if ALL ACTIVE FILTERS are valid for the current item (val)
                            return filters.every((filter) => !filter.isActive || filter.check());
                        };

                        return applyCombinedFilters(val);

                        // Without the helper function (applyCombinedFilters())
                        // // All 3 filters
                        // if (hasPriceRangeFilter && hasPropCategoryFilter && hasPropTypeFilter) {
                        //     return (
                        //         (val.price >= Number(filterValue.priceRange[0]) && val.price <= Number(filterValue.priceRange[1]))
                        //         && val.category === filterValue.propCategorySubFilter
                        //         && val.type === filterValue.propTypeSubFilter
                        //     );
                        // }
                        // // 2 filters
                        // if (hasPriceRangeFilter && hasPropCategoryFilter && !hasPropTypeFilter) {
                        //     return (
                        //         (val.price >= Number(filterValue.priceRange[0]) && val.price <= Number(filterValue.priceRange[1]))
                        //         && val.category === filterValue.propCategorySubFilter
                        //     );
                        // }
                        // if (hasPriceRangeFilter && !hasPropCategoryFilter && hasPropTypeFilter) {
                        //     return (
                        //         (val.price >= Number(filterValue.priceRange[0]) && val.price <= Number(filterValue.priceRange[1]))
                        //         && val.type === filterValue.propTypeSubFilter
                        //     );
                        // }
                        // if (!hasPriceRangeFilter && hasPropCategoryFilter && hasPropTypeFilter) {
                        //     return (
                        //         val.category === filterValue.propCategorySubFilter
                        //         && val.type === filterValue.propTypeSubFilter
                        //     );
                        // }
                    }
                    default:
                        return val[filterOption] === filterValue;
                }
            });
            setPropertiesToShow(filteredProperties);
        } else {
            setPropertiesToShow(listedProperties); // Reset to all properties if no filter
        }
    }, [filterOption, filterValue, listedProperties]);

    /**
     * Sort properties
     */
    // TBC
    // useEffect(() => {
    //     if (sortStatus.sorted) {
    //         const chosenSort = sortStatus.sortMethods.find(method => method.status === true);
    //         let sortedProperties = [...listedProperties]; // Use the filtered properties to apply sorting
    //         switch (chosenSort?.value) {
    //             case 'sortByRentsLowHigh':
    //                 sortedProperties =
    //                     (sortedProperties
    //                         .filter(property => property.category === "For Rent")
    //                         .sort((a, b) => a.price - b.price)
    //                     ).concat(sortedProperties
    //                         .filter(property => property.category === "For Sale")
    //                         .sort((a, b) => a.price - b.price)
    //                     );
    //                 break;
    //             case 'sortByRentsHighLow':
    //                 sortedProperties =
    //                     (sortedProperties
    //                         .filter(property => property.category === "For Rent")
    //                         .sort((a, b) => b.price - a.price)
    //                     ).concat(sortedProperties
    //                         .filter(property => property.category === "For Sale")
    //                         .sort((a, b) => b.price - a.price)
    //                     );
    //                 break;
    //             case 'sortBySalesLowHigh':
    //                 sortedProperties =
    //                     (sortedProperties
    //                         .filter(property => property.category === "For Sale")
    //                         .sort((a, b) => a.price - b.price)
    //                     ).concat(sortedProperties
    //                         .filter(property => property.category === "For Rent")
    //                         .sort((a, b) => a.price - b.price)
    //                     );
    //                 break;
    //             case 'sortBySalesHighLow':
    //                 sortedProperties =
    //                     (sortedProperties
    //                         .filter(property => property.category === "For Sale")
    //                         .sort((a, b) => b.price - a.price)
    //                     ).concat(sortedProperties
    //                         .filter(property => property.category === "For Rent")
    //                         .sort((a, b) => b.price - a.price)
    //                     );
    //                 break;
    //             case 'sortByLastUpdated':
    //                 sortedProperties =
    //                     sortedProperties.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    //                 break;
    //             default:
    //                 break;
    //         }
    //         setPropertiesToShow(sortedProperties);
    //     }
    // }, [sortStatus, listedProperties]);

    return (
        <>
            {/* Loading State */}
            {loadingProperties &&
                <div className="d-flex flex-wrap px-sm-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-6 mb-4 mb-md-0 p-md-3 loading-skeleton">
                            <div className="d-xl-flex px-2 py-3 py-xl-0 ps-xl-0 h-100 box skeleton">
                                <div className="col-xl-5 h-25vh mb-3 me-xl-2 img-skeleton" />
                                <div className="col-xl-7 mb-2 d-lg-flex flex-column py-xl-2 info-skeleton">
                                    <div className="mb-3">
                                        <div className="text small my-1 px-1 px-md-3 py-2 skeleton-line bg-black3 col-10"></div>
                                        <div className="text small my-1 px-1 px-md-3 py-2 skeleton-line bg-black3 col-8"></div>
                                        <div className="text small my-1 px-1 px-md-3 py-4 skeleton-line bg-black3 col-12"></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <div className="col-4 h-1_5rem skeleton-button bg-black3 rounded-pill"></div>
                                        <div className="col-4 h-1_5rem skeleton-button bg-black3 rounded-pill"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {/* Error State */}
            {!loadingProperties && errorLoadingProperties && (
                <FetchError
                    errorMessage={errorLoadingProperties}
                    refreshFunction={() => fetchProperties()}
                    className="mb-5 mt-4"
                />
            )}

            {/* No Properties State */}
            {!loadingProperties && !errorLoadingProperties && propertiesToShowCount === 0 && (
                <div className="mx-auto my-4 col-sm-8 col-md-6 col-lg-5 col-xl-4 rounded mb-5 p-3">
                    <img src="/images/not_found_illustration.webp" alt="Not found" />
                    <div className="text-center text-muted small">
                        {filterOption === 'all' ?
                            <>No properties available at the moment</>
                            : <>
                                <div className="grid-center">
                                    <p className="text-center text-muted small">No properties matching the criteria</p>
                                    <button className="btn btn-sm btn-outline-secondary d-block mx-auto border border-secondary border-opacity-25" onClick={() => resetFilters()}>
                                        <ArrowClockwise weight="bold" className="me-1" /> Refresh
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!loadingProperties && !errorLoadingProperties && propertiesToShowCount > 0 && (
                <>
                    <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
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

                    <div className="d-flex justify-content-center flex-wrap px-sm-2 overflow-hidden" id="propertyCard">
                        {propertiesToShow
                            .slice(0, limit)
                            .map((val, index) => {
                                const { id, cover, category, type, name, location, about, price, payment,
                                    bedrooms, bathrooms, garages, booked, bookedBy, closed,
                                    likes } = val;
                                const mainColor = category === "For Sale" ? "#25b579" : "#ff9800";
                                const mainLightColor = category === "For Sale" ? "#25b5791a" : "#ff98001a"
                                return (
                                    <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-6 mb-4 mb-md-0 p-2 p-md-3">
                                        <div className="position-relative d-flex flex-column flex-xl-row h-100 box"
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
                                                        title={JSON.parse(bookedBy).length + ` potential client${JSON.parse(bookedBy).length > 1 ? 's' : ''}`}>
                                                        <Bookmark size={15} weight="fill" /> {JSON.parse(bookedBy).length}
                                                    </div>
                                                }
                                                <img src={cover} alt="Property" className="dim-100 object-fit-cover" />
                                                {/* CAT buttons */}
                                                <div className="position-absolute top-0 bottom-0 mt-3 mb-2 me-3 property-actions">
                                                    <button className="btn d-flex align-items-center mb-2 border-0 bg-light text-black2 fst-italic small rounded-pill clickDown" onClick={() => goToProperty(id)}>
                                                        View property <CaretDoubleRight size={16} className="ms-1" />
                                                    </button>
                                                    {!closed && (
                                                        <>
                                                            <button className="btn d-flex align-items-center mb-2 border-0 bg-light text-black2 fst-italic small rounded-pill clickDown" onClick={() => shareProperty(id, name, category)} >
                                                                Share <ShareFat size={16} className="ms-1" />
                                                            </button>
                                                            <button className="btn d-flex align-items-center mt-auto border-0 bg-light text-black2 fst-italic small rounded-pill clickDown" title="Compare" onClick={() => compareProperty(id)} >
                                                                <Plus size={7} weight="bold" className="text-dark" /> <ArrowsLeftRight size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
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
                                            <div className='h-100 col-xl-7 d-flex flex-column px-2 pb-3 pb-xl-2'>
                                                <div className="text px-0 px-md-2 small">
                                                    <div className="d-flex align-items-center justify-content-between gap-3 my-2 category">
                                                        <span className="catgType" style={{ background: mainLightColor, color: mainColor }}>
                                                            {category}
                                                        </span>
                                                        <span className="flex-align-center">
                                                            <span className="fs-70 fw-bold text-black2">
                                                                {JSON.parse(likes).length > 0 && formatBigCountNumbers(JSON.parse(likes).length)}
                                                            </span>
                                                            <Heart className="text ms-1 fs-4 ptr me-1 bounceClick" />
                                                        </span>
                                                    </div>
                                                    <h4 className="m-0 fs-6 text-gray-700">{name}</h4>
                                                    <p className="mb-2"><MapPinArea size={20} weight="fill" /> {location}</p>
                                                    <p className="d-none d-md-block text-muted small">
                                                        <span className="text-clamp text-clamp-4">
                                                            {about}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap column-gap-3 row-gap-1 mt-lg-auto mt-auto px-0 px-md-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <button className={`btn btn-sm flex-align-center px-3 py-1 border-2 bg-warning bg-opacity-25 text-success clickDown rounded-pill small ${closed ? 'text-decoration-line-through' : ''}`}
                                                            title="View property"
                                                            onClick={() => goToProperty(id)} >
                                                            {/* <CurrencyDollar weight="bold" className="me-1" /> {price.toLocaleString()} */}
                                                            RWF {price.toLocaleString()}
                                                            {payment === 'annually' && <span className="opacity-50 fw-normal ms-1 fs-75">/year</span>}
                                                            {payment === 'monthly' && <span className="opacity-50 fw-normal ms-1 fs-75">/month</span>}
                                                            {payment === 'weekly' && <span className="opacity-50 fw-normal ms-1 fs-75">/week</span>}
                                                            {payment === 'daily' && <span className="opacity-50 fw-normal ms-1 fs-75">/day</span>}
                                                            {payment === 'hourly' && <span className="opacity-50 fw-normal ms-1 fs-75">/hour</span>}
                                                            <CaretDoubleRight size={16} weight="bold" className="ms-2" /></button>
                                                    </div>
                                                    <span className="d-flex align-items-center ms-auto fw-bold text-muted small opacity-50">
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
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}

            {/* Load More Button */}
            {!limited && !loadingProperties && !errorLoadingProperties && propertiesToShowCount > 0 && (
                <button
                    type="button"
                    className={`btn px-4 py-2 ${limit < propertiesContext.length ? 'border-2 border-primary border-opacity-25 text-primary' : 'text-gray-600'} d-block mx-auto my-5 rounded-pill`}
                    onClick={() => setLimit(limit + 25)}
                    style={limit >= propertiesContext.length ? { cursor: "not-allowed" } : { cursor: "pointer" }}>
                    {limit >= propertiesContext.length ? "All caught up" : <>More properties <CaretDown /> </>}
                </button>
            )}

            {/* Property comparison */}
            <CompareProperties show={showPropComparison} onClose={() => setShowPropComparison(false)} />
        </>
    );
};

export default PropertyCard;