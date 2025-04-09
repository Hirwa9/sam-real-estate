import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './properties.css';
import { aboutProperties } from '../data/Data';
import PageInfo from '../common/header/PageInfo';
import img from '../images/pricing.jpg';
import PropertyCard from '../common/PropertyCard';
import DividerText from '../common/DividerText';
/* global $ */

// Icons
import { ArrowsClockwise, Binoculars, CaretDoubleUp, CaretDown, MagnifyingGlass, XCircle, Sliders, X, ArrowClockwise } from '@phosphor-icons/react';
import FixedActionButtons from '../common/fixedActionButtons/FixedActionButtons';
import MyToast from '../common/Toast';
import useCustomDialogs from '../hooks/useCustomDialogs';
// import Heading from '../common/Heading';

const Properties = () => {
    // Custom hooks
    const {
        // Toast
        showToast,
        toastMessage,
        toastType,
        toast,
        resetToast,
    } = useCustomDialogs();

    // Data
    let { filterParameter } = useParams(); // Destructure parameter
    const [filterOption, setFilterOption] = useState("all");
    const [filterValue, setFilterValue] = useState("all");

    const navigate = useNavigate();
    const location = useLocation();
    const [filterOptions, setFilterOptions] = useState({
        location: '',
        type: '',
        price: '',
        currency: '',
        bedrooms: ''
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setFilterOptions({
            location: searchParams.get('location') || '',
            type: searchParams.get('type') || '',
            price: searchParams.get('price') || '',
            currency: searchParams.get('currency') || '',
            bedrooms: searchParams.get('bedrooms') || ''
        });
    }, [location.search]);

    const [minPriceInputValue, setMinPriceInputValue] = useState('');
    const [maxPriceInputValue, setMaxPriceInputValue] = useState('');
    const [propPriceRangeSubFilter, setPropPriceRangeSubFilter] = useState([]);
    const [propCategorySubFilter, setPropCategorySubFilter] = useState('');
    const [propTypeSubFilter, setPropTypeSubFilter] = useState('');
    const [combinedFilter, setCombinedFilter] = useState('');
    const [canUseCombinedFilter, setCanUseCombinedFilter] = useState(false);

    // Filter combination
    const submitCombinedFilter = () => {
        if (combinedFilter === '') {
            return toast({ message: 'Combine different filters for search.', type: 'info' });
        }

        // If filters includes price range
        // Return for invalid range (Provided only one value, negative/zero value, min > max range or a small range)
        // Minimum acceptable range difference is 1000
        if (
            // One value case
            (minPriceInputValue && !maxPriceInputValue) ||
            (!minPriceInputValue && maxPriceInputValue) ||
            // Invalid range: min > max, small range difference, negative/zero values
            (minPriceInputValue && maxPriceInputValue &&
                (minPriceInputValue > maxPriceInputValue ||
                    minPriceInputValue < 1 ||
                    maxPriceInputValue - minPriceInputValue < 1000)
            )
        ) {
            return toast({ message: 'Enter a valid price range to filter with.' });
        }

        // With a valid Price Range
        // Check if only Price Range was used (i.e the rest values will be an empty string '')
        const submitValues = Object.values(combinedFilter);
        if (
            (minPriceInputValue && maxPriceInputValue) &&
            submitValues.filter(val => val === '').length === (submitValues.length - 1)
        ) {
            return toast({ message: 'Combine different filters for search.', type: 'info' });
        }

        // Mark filter identifiers
        if (minPriceInputValue !== '') {
            setPropPriceRangeSubFilter([Math.min(minPriceInputValue, maxPriceInputValue), Math.max(minPriceInputValue, maxPriceInputValue)]);
        }

        // Set the filter option and value
        setFilterOption('combined');
        setFilterValue(combinedFilter);
    };

    // Set combined filter value
    useEffect(() => {
        const combinedArray = [
            minPriceInputValue,
            maxPriceInputValue,
            propCategorySubFilter,
            propTypeSubFilter,
        ];

        const validValues = combinedArray.filter(val => val !== '').length;
        if (validValues > 1) {
            setCombinedFilter({
                priceRange: [Math.min(minPriceInputValue, maxPriceInputValue), Math.max(minPriceInputValue, maxPriceInputValue)],
                propCategorySubFilter,
                propTypeSubFilter,
            });
            // Auto close filter modal if search is triggered with valid filter options
            if (minPriceInputValue !== '' || maxPriceInputValue !== '') {
                ((minPriceInputValue !== '' && maxPriceInputValue !== '' && validValues > 2)
                    && (Math.max(minPriceInputValue, maxPriceInputValue) - Math.min(minPriceInputValue, maxPriceInputValue) >= 1000)
                ) ? setCanUseCombinedFilter(true)
                    : setCanUseCombinedFilter(false);
            } else {
                setCanUseCombinedFilter(true);
            }
        } else {
            setCombinedFilter('');
            setCanUseCombinedFilter(false);
        }

        // Reset price range (combined filters)
        if (minPriceInputValue === '' && maxPriceInputValue === '') {
            setPropPriceRangeSubFilter([]);
        }
    }, [minPriceInputValue, maxPriceInputValue, propCategorySubFilter, propTypeSubFilter]);

    // Clear combined filter value
    const clearCombinedFilter = () => {
        setMinPriceInputValue('');
        setMaxPriceInputValue('');
        setPropCategorySubFilter('');
        setPropTypeSubFilter('');
    }

    const [showScrollTopIcon, setShowScrollTopIcon] = useState(false);
    const [showFilterIcon, setShowFilterIcon] = useState(false);
    const [floatFilterTools, setFloatFilterTools] = useState(false);

    // Toggle showScrollTopIcon visibility
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > (window.outerHeight * 2)) {
                setShowScrollTopIcon(true);
            } else {
                setShowScrollTopIcon(false);
            }

            if (window.scrollY > (window.outerHeight * (3 / 5))) {
                setShowFilterIcon(true);
            } else {
                setShowFilterIcon(false);
                setFloatFilterTools(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /**
     * Sort properties
     */

    const [listIsSorted, setListIsSorted] = useState(false);

    const [sortByRentsLowHigh, setSortByRentsLowHigh] = useState(false);
    const [sortByRentsHighLow, setSortByRentsHighLow] = useState(false);
    const [sortBySalesLowHigh, setSortBySalesLowHigh] = useState(false);
    const [sortBySalesHighLow, setSortBySalesHighLow] = useState(false);
    const [sortByLastUpdated, setSortByLastUpdated] = useState(false);

    // Toggle sorting states
    const sortRents_LowHigh = () => {
        setSortByRentsLowHigh(true);
        setSortByRentsHighLow(false);
        setSortBySalesLowHigh(false);
        setSortBySalesHighLow(false);
        setSortByLastUpdated(false)
    }
    const sortRents_HighLow = () => {
        setSortByRentsHighLow(true);
        setSortByRentsLowHigh(false);
        setSortBySalesLowHigh(false);
        setSortBySalesHighLow(false);
        setSortByLastUpdated(false)
    }
    const sortSales_LowHigh = () => {
        setSortBySalesLowHigh(true);
        setSortByRentsLowHigh(false);
        setSortByRentsHighLow(false);
        setSortBySalesHighLow(false);
        setSortByLastUpdated(false)
    }
    const sortSales_HighLow = () => {
        setSortBySalesHighLow(true);
        setSortByRentsLowHigh(false);
        setSortByRentsHighLow(false);
        setSortBySalesLowHigh(false);
        setSortByLastUpdated(false)
    }
    const sort_LastUpdated = () => {
        setSortByLastUpdated(true)
        setSortByRentsLowHigh(false);
        setSortByRentsHighLow(false);
        setSortBySalesLowHigh(false);
        setSortBySalesHighLow(false);
    }

    // Unsort properties
    const unsortProperties = () => {
        setSortByRentsLowHigh(false);
        setSortByRentsHighLow(false);
        setSortBySalesLowHigh(false);
        setSortBySalesHighLow(false);
        setSortByLastUpdated(false);
    }

    useEffect(() => {
        const isSorted = sortByRentsLowHigh || sortByRentsHighLow || sortBySalesLowHigh || sortBySalesHighLow || sortByLastUpdated;
        setListIsSorted(isSorted);

    }, [sortByRentsLowHigh, sortByRentsHighLow, sortBySalesLowHigh, sortBySalesHighLow, sortByLastUpdated]);

    /**
     * Filter functions
     */

    // Reset filter
    const resetFilters = () => {
        setFilterOption("all");
        setFilterValue("all")
        scrollToResults();
    }

    const refreshProperties = () => {
        if (filterParameter !== 'all') {
            resetFilters();
            navigate("/properties/all");
        } else {
            resetFilters();
        }
    }

    // Sorts and Filters
    useEffect(() => {
        // Filter by parameter
        if (filterParameter) {
            if (filterParameter !== 'all') {
                if (filterParameter === 'sale' || filterParameter === 'rent') {
                    setFilterOption('category');
                    if (filterParameter === 'sale') setFilterValue('For Sale')
                    else if (filterParameter === 'rent') setFilterValue('For Rent');
                } else if (filterParameter.includes('search_query=')) {
                    setFilterOption('name');
                    const sliceInx = "search_query=".length;
                    setFilterValue(filterParameter.slice(sliceInx));
                } else if (filterParameter.includes('priceRange_')) {
                    setFilterOption('priceRange');
                    const rangeNums = filterParameter.slice(filterParameter.indexOf('_') + 1).split('and');
                    setPropPriceRangeSubFilter([rangeNums[0], rangeNums[1]]);
                    setFilterValue(rangeNums);
                } else if (filterParameter.includes('bedrooms_')) {
                    setFilterOption('bedrooms');
                    setFilterValue(filterParameter.slice(filterParameter.indexOf('_') + 1));
                } else if (filterParameter.includes('_unfurnished')) {
                    setFilterOption('unfurnished');
                } else if (filterParameter.includes('_furnished')) {
                    setFilterOption('furnished');
                } else if (filterParameter.includes('search')) {
                    setFilterOption('combinedSearchOptions');
                    setFilterValue(filterOptions);
                }
                else {
                    setFilterOption('type');
                    setFilterValue(filterParameter);
                }
            }
        }
    }, [filterParameter, filterOptions]);

    // Filter by search bar
    const filterByName = (e) => {
        let value = e.target.value;
        if (value === null || value === undefined || value === '') {
            refreshProperties();
            return;
        }
        setFilterOption('name');
        setFilterValue(value);
    }

    // Filter by range value input
    const handlePriceRangeInput = () => {
        if (minPriceInputValue === '' && maxPriceInputValue === '') {
            return;
        } else if ((minPriceInputValue === '' || maxPriceInputValue === '') ||
            (minPriceInputValue <= 0 || maxPriceInputValue <= 0)) {
            return toast({ message: 'Enter a valid price range to filter with.' });
        }
        if (minPriceInputValue !== 0 && maxPriceInputValue !== 0) {
            setFilterOption("priceRange");
            setFilterValue([Math.min(minPriceInputValue, maxPriceInputValue), Math.max(minPriceInputValue, maxPriceInputValue)]);
            setPropPriceRangeSubFilter([Math.min(minPriceInputValue, maxPriceInputValue), Math.max(minPriceInputValue, maxPriceInputValue)]);
            scrollToResults();
        }
    }

    const clearPriceRangeInput = () => {
        setMinPriceInputValue('');
        setMaxPriceInputValue('');
    }


    // Scroll to results
    const scrollToResults = () => {
        // $('html,body').animate({ scrollTop: $('#propertyCard').offset().top - 200 }, 'slow');
        $('html,body').animate({ scrollTop: 300 }, 'slow');
    }

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={resetToast} />
            <section className='properties'>
                <PageInfo name="Property listing" title="Listing - Discover a Wide Range of Listed Properties" cover={img} className="mb-0" />
                {/* Filter tools */}
                <div className={`px-1 ${floatFilterTools ? 'mb-3 py-3 floated' : 'py-1'} filter-bar`}>
                    <div className="d-flex align-items-center gap-2 px-2 px-md-3 pb-2 pb-sm-0 overflow-auto Sbar-none">
                        {/* Filter using search bar */}
                        <div className={`${floatFilterTools ? 'col-12 col-sm-6 mb-2' : 'col-lg-3'} position-relative p-1 ps-2 border border-2 border-black4 target-input search-box`} style={{ height: `${floatFilterTools ? '3rem' : ''}` }}>
                            <Binoculars weight='bold' className='flex-grow-1 text-black2 opacity-75' style={{ animation: "shakeX 15s infinite" }} />
                            <input type="text" placeholder="Search name or place" className="border-0 search-box__input" id="propertySearcher" style={{ minWidth: "12rem" }}
                                onKeyUp={(e) => { (e.key === "Enter") && filterByName(e) }}
                            />
                            <button className="fa fa-close r-middle search-box__clearer d-none"></button>
                        </div>
                        {floatFilterTools &&
                            <DividerText text="Or apply some filter" className="mx-2 mb-3 w-100 text-gray-600" />
                        }
                        <div className='d-flex align-items-center justify-content-center gap-2 filters'>
                            {/* Refresh properties */}
                            <div className='h-2rem px-3 flex-align-center border-end border-black4 rad-0 text-muted ptr clickDown' title='All Properties' onClick={() => refreshProperties()}>
                                <span className='text-nowrap small'>All</span>
                            </div>

                            {/* Filter by Type */}
                            <div className='h-2rem px-3 flex-align-center border-end border-black4 rad-0 text-muted ptr' data-bs-toggle="dropdown" id="filterByType" aria-expanded="false">
                                <span className='small'>Type</span> <CaretDown className='ms-1' />
                            </div>
                            <div className="dropdown-menu me-1 me-sm-0 filter-options" aria-labelledby="filterByType">
                                <ul className='list-unstyled mb-0'>
                                    {aboutProperties.allTypes
                                        .sort((a, b) =>
                                            a.localeCompare(b)
                                        )
                                        .map((val, index) => (
                                            <li key={index} className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                                onClick={() => { setFilterOption("type"); setFilterValue(val); scrollToResults(); }}>
                                                {val}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>

                            {/* Filter by Category */}
                            <div className='h-2rem px-3 flex-align-center border-end border-black4 rad-0 text-muted ptr' data-bs-toggle="dropdown" id="filterByCategory" aria-expanded="false">
                                <span className='small'>Category</span> <CaretDown className='ms-1' />
                            </div>
                            <div className="dropdown-menu me-1 me-sm-0 filter-options" aria-labelledby="filterByCategory">
                                <ul className='list-unstyled mb-0'>
                                    {aboutProperties.allCategories
                                        .map((val, index) => (
                                            <li key={index} className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                                onClick={() => { setFilterOption("category"); setFilterValue(val); scrollToResults(); }}
                                            >
                                                {val}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>

                            {/* Filter by Price */}
                            <div className='h-2rem px-3 flex-align-center border-end border-black4 rad-0 text-muted ptr' data-bs-toggle="dropdown" id="filterByPrice" aria-expanded="false">
                                <span className='small'>Price</span>
                                <CaretDown className='ms-1' />
                            </div>
                            <div className="dropdown-menu col-12 col-sm-auto me-1 me-sm-0 p-3 filter-options" aria-labelledby="filterByPrice">
                                <DividerText text="Enter price range" className="mx-3 mb-2 no-line text-gray-600 fw-bold" />
                                <form onSubmit={(e) => { e.preventDefault(); handlePriceRangeInput() }}>
                                    <div className='d-flex flex-column flex-sm-row align-items-center flex-wrap mb-2 px-2'>
                                        <input type="number"
                                            value={minPriceInputValue}
                                            onChange={(e) => setMinPriceInputValue(e.target.value)} placeholder='Min Price (RWF)' className='col-12 col-sm-auto h-2_5rem rounded px-2 border border-2' />
                                        <span className='mx-2 fw-bold text-primaryColor'>-</span>
                                        <input type="number"
                                            value={maxPriceInputValue}
                                            onChange={(e) => setMaxPriceInputValue(e.target.value)} placeholder='Max Price (RWF)' className='col-12 col-sm-auto h-2_5rem rounded px-2 border border-2' />
                                    </div>
                                    <div className='flex-align-center justify-content-between mx-2'>
                                        <button type="reset" className='btn btn-sm flex-align-center ms-auto px-3 text-muted rounded-pill clickDown'
                                            onClick={clearPriceRangeInput}
                                        >
                                            Clear <X size={15} className='ms-1 opacity-50' />
                                        </button>
                                        <button type="submit" className='btn btn-sm bg-primaryColor flex-align-center ms-3 px-3 text-muted rounded-pill clickDown'
                                            onClick={handlePriceRangeInput}
                                        >
                                            Search <MagnifyingGlass size={17} className='ms-1' />
                                        </button>
                                    </div>
                                </form>
                                <DividerText noBorder className="mx-3 my-2 shadow-none" />
                                <div className='py-1 px-2 text-muted'>Pick a range (RWF)</div>
                                <div className='mb-3 fw-light price-filter-options'>
                                    {aboutProperties?.priceRanges?.['RWF']
                                        .map((val, index) => (
                                            <div key={index} className='p-2 small ptr mb-1 clickDown filter-option-value'
                                                onClick={() => {
                                                    setFilterOption("priceRange");
                                                    setFilterValue([val.min.replaceAll(',', ''), val.max.replaceAll(',', '')]);
                                                    setPropPriceRangeSubFilter([val.min.replaceAll(',', ''), val.max.replaceAll(',', '')]);
                                                    scrollToResults();
                                                }}
                                            >
                                                <div className='d-flex align-items-center justify-content-between px-4'>
                                                    <span className='px-3'>{val.min}</span>
                                                    <span className='px-3'> - </span>
                                                    <span className='px-3'>{val.max}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Filter by All */}
                            <div className='h-2rem px-3 flex-align-center border-end border-black4 rad-0 text-muted ptr' data-bs-toggle="modal" data-bs-target="#filterByAll">
                                <Sliders className='me-2' />
                                <span className='text-nowrap small'>Combined</span> <CaretDown className='ms-1' />
                            </div>
                        </div>

                        {/* <div className='h-2rem ms-auto flex-align-center rad-0 text-muted ptr' data-bs-toggle="dropdown" id="sortByOrder" aria-expanded="false">
                            Sort <FunnelSimple className='ms-1' />
                        </div> */}
                        <div className="dropdown-menu me-1 me-sm-0 filter-options" aria-labelledby="sortByOrder">
                            <ul className='list-unstyled mb-0'>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value active'
                                    onClick={() => unsortProperties()}
                                >
                                    Default
                                </li>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                    onClick={sortRents_LowHigh}
                                >
                                    Rent (low to high)
                                </li>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                    onClick={sortRents_HighLow}
                                >
                                    Rent (high to low)
                                </li>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                    onClick={sortSales_LowHigh}
                                >
                                    Sale (low to high)
                                </li>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                    onClick={sortSales_HighLow}
                                >
                                    Sale (high to low)
                                </li>
                                <li className='dropdown-item p-2 px-3 small ptr clickDown filter-option-value'
                                    onClick={sort_LastUpdated}
                                >
                                    Last Updated
                                </li>
                            </ul>
                        </div>
                    </div>
                    {floatFilterTools &&
                        <XCircle className="position-absolute mx-auto text-appColor rounded-circle blur-bg-5px ptr clickDown"
                            size={55}
                            weight="fill"
                            style={{ bottom: "0", left: "0", right: "0", translate: "0 100%" }}
                            onClick={() => setFloatFilterTools(false)}
                        />
                    }
                </div>
                {/* Property filters status displayer */}
                <div className="container-fluid px-2 px-md-4 py-sm-4 bg-bodi page-desc-tools">
                    {/* {filterOption !== "all" && */}
                    <div className='px-3 border-start border-secondary border-3 border-opacity-50 filter-info'>
                        <h3 className='h4 text-muted mb-2'>{filterOption === "all" ? "All" : "Filtered"} properties</h3>
                        <ul className='mb-md-0 p-0 fs-75 list-flexible'>
                            {(filterOption === "type" || propTypeSubFilter !== '') &&
                                (filterOption === "type") ?
                                <li>
                                    {filterValue} Properties
                                </li>
                                : (filterOption === 'combined' && propTypeSubFilter !== '') &&
                                <li>
                                    {propTypeSubFilter}
                                </li>
                            }
                            {(filterOption === "category" || propCategorySubFilter !== '') &&
                                (filterOption === "category") ?
                                <li>
                                    Properties {filterValue}
                                </li>
                                : (filterOption === 'combined' && propCategorySubFilter !== '') &&
                                <li>
                                    {propCategorySubFilter}
                                </li>
                            }
                            {(filterOption === "priceRange" || propPriceRangeSubFilter.length > 0) &&
                                (filterOption === "priceRange") ?
                                <li>
                                    <b>Price range</b>:
                                    RwF {Number(filterValue[0]).toLocaleString()} - RwF {Number(filterValue[1]).toLocaleString()}
                                </li>
                                : (filterOption === 'combined' && propPriceRangeSubFilter.length > 0) &&
                                <li>
                                    <b>Price range</b>:
                                    RwF {Number(propPriceRangeSubFilter[0]).toLocaleString()} - RwF {Number(propPriceRangeSubFilter[1]).toLocaleString()}
                                </li>
                            }
                            {filterOption === "bedrooms" &&
                                <li>
                                    <b>Bedrooms</b>: {filterValue}
                                </li>
                            }
                            {filterOption === "bathrooms" &&
                                <li>
                                    <b>Bathrooms</b>: {filterValue}
                                </li>
                            }
                            {/* {filterOption === "furnished" &&
                                <li>
                                    <b>Furnished</b> {filterCount && (
                                        <span className='ms-1'> ({filterCount}) </span>
                                    )}
                                </li>
                            }
                            {filterOption === "unfurnished" &&
                                <li>
                                    <b>Unfurnished</b> {filterCount && (
                                        <span className='ms-1'> ({filterCount}) </span>
                                    )}
                                </li>
                            } */}
                            {filterOption === "furnished" &&
                                <li>
                                    <b>Furnished</b>
                                </li>
                            }
                            {filterOption === "unfurnished" &&
                                <li>
                                    <b>Unfurnished</b>
                                </li>
                            }
                            {filterOption !== "all" &&
                                <li onClick={() => refreshProperties()} title='All properties' className='flex-align-center ptr bounceClick'>
                                    <ArrowClockwise weight="bold" className="me-1" /> Refresh
                                </li>
                            }
                        </ul>
                    </div>
                    {/* } */}
                </div>

                {/* Advanced filter */}
                <div className="modal fade" id="filterByAll" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="filterByAllLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content border-0 rounded-0" style={{ marginTop: "4rem" }}>
                            <div className="modal-header border-0">
                                <h5 className="justify-self-center modal-title text-black2" id="filterByAllLabel"> Advanced Search</h5>
                                <button type="button" className="btn-close me-0" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body pt-0">
                                {/* Description */}
                                <div className="alert alert-secondary border-0 rounded-0 text-justify text-gray-600 smaller">
                                    <span>
                                        Combine different filters to refine your search and discover exactly what you're looking for.
                                    </span>
                                </div>
                                {/* Filters */}
                                <div className='p-3 filter-options-all'>
                                    {/* Price */}
                                    <div>
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className='d-flex flex-column flex-sm-row flex-wrap align-items-center justify-content-between  mb-2'>
                                                <input type="number"
                                                    value={minPriceInputValue}
                                                    onChange={(e) => setMinPriceInputValue(e.target.value)} placeholder='Min Price (RWF)' className='col-12 col-sm-5 h-2_5rem rounded px-2 border border-2' />
                                                <span className='mx-2 fw-bold text-muted opacity-50'>-</span>
                                                <input type="number"
                                                    value={maxPriceInputValue}
                                                    onChange={(e) => setMaxPriceInputValue(e.target.value)} placeholder='Max Price (RWF)' className='col-12 col-sm-5 h-2_5rem rounded px-2 border border-2' />
                                            </div>
                                            <div className='flex-align-center justify-content-between'>
                                                <button type="reset" className='btn btn-sm flex-align-center mx-auto px-3 text-muted rounded-pill clickDown'
                                                    onClick={clearPriceRangeInput} >
                                                    Clear <X size={15} className='ms-1 opacity-50' />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <hr />
                                    {/* Type */}
                                    <ul className='mb-0 px-0 small row-gap-3 list-flexible'>
                                        {aboutProperties.allTypes
                                            .sort((a, b) =>
                                                a.localeCompare(b)
                                            )
                                            .map((val, index) => (
                                                <li key={index} className={`dropdown-item px-3 py-1 small flex-center rounded-pill ptr clickDown ${propTypeSubFilter === val ? 'border border-primaryColor border-2' : ''} filter-option-value`}
                                                    onClick={() => setPropTypeSubFilter(val)}
                                                >
                                                    {val}
                                                </li>
                                            ))
                                        }
                                        {propTypeSubFilter !== '' &&
                                            <li className={"dropdown-item ms-2 py-0 px-2 small ptr clickDown bg-danger border border-danger opacity-50 rounded-3 align-self-center filter-option-value"}
                                                onClick={() => setPropTypeSubFilter('')}
                                            >
                                                <X size={20} fill='var(--bs-light)' className='p-1' />
                                            </li>
                                        }
                                    </ul>
                                    <hr />
                                    {/* Category */}
                                    <ul className='mb-0 px-0 small row-gap-3 list-flexible'>
                                        {aboutProperties.allCategories
                                            .map((val, index) => (
                                                <li key={index} className={`dropdown-item px-3 py-1 small flex-center rounded-pill ptr clickDown ${propCategorySubFilter === val ? 'border border-primaryColor border-2' : ''} filter-option-value`}
                                                    onClick={() => setPropCategorySubFilter(val)}
                                                >
                                                    {val}
                                                </li>
                                            ))
                                        }
                                        {propCategorySubFilter !== '' &&
                                            <li className={"dropdown-item ms-2 py-0 px-2 small ptr clickDown bg-danger border border-danger opacity-50 rounded-3 align-self-center filter-option-value"}
                                                onClick={() => setPropCategorySubFilter('')}
                                            >
                                                <X size={20} fill='var(--bs-light)' className='p-1' />
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className='btn btn-sm me-3 text-primaryColorDark' data-bs-dismiss='modal'
                                    onClick={() => clearCombinedFilter()}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className='btn btn-sm bg-primaryColor flex-align-center px-3 text-muted rounded-pill clickDown'
                                    data-bs-dismiss={canUseCombinedFilter ? 'modal' : undefined}
                                    onClick={() => { submitCombinedFilter() }}
                                >
                                    Search <MagnifyingGlass size={17} className='ms-1' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties list */}
                <PropertyCard
                    filterOption={filterOption}
                    filterValue={filterValue}
                    resetFilters={refreshProperties}
                    sortStatus={
                        {
                            sorted: listIsSorted,
                            sortMethods: [
                                { value: 'sortByRentsLowHigh', status: sortByRentsLowHigh, },
                                { value: 'sortByRentsHighLow', status: sortByRentsHighLow, },
                                { value: 'sortBySalesLowHigh', status: sortBySalesLowHigh, },
                                { value: 'sortBySalesHighLow', status: sortBySalesHighLow, },
                                { value: 'sortByLastUpdated', status: sortByLastUpdated, },
                            ]
                        }
                    }
                />

                {/* Fixed icons */}
                <FixedActionButtons
                    icons={
                        [
                            {
                                icon: <MagnifyingGlass size={45} fill='var(--black2)' className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' onClick={() => setFloatFilterTools(!floatFilterTools)} />,
                                visible: showFilterIcon ? true : false
                            },
                            {
                                icon: <ArrowsClockwise size={45} fill='var(--black2)' className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' onClick={() => refreshProperties()} />,
                                visible: filterOption !== 'all' ? true : false
                            },
                            {
                                icon: <CaretDoubleUp size={40} fill='var(--black2)' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' />,
                                visible: showScrollTopIcon ? true : false
                            },
                        ]
                    }

                    className="d-md-none"
                />
            </section>
        </>
    );
}

export default Properties;