import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./hero.css";
import Heading from "../../common/Heading";
import { aboutProperties } from "../../data/Data";
import { Bed, Building, CaretDoubleRight, CaretDown, CaretRight, MapPinArea, MoneyWavy } from "@phosphor-icons/react";
import useCustomDialogs from "../../hooks/useCustomDialogs";
import MyToast from "../../common/Toast";
import SearchInput from 'react-search-input';
import { PropertiesContext } from "../../../App";
import SearchSuggestions from "../../common/SearchSuggestions";

const Hero = () => {
    // Custom hooks
    const {
        // Toast
        showToast,
        toastMessage,
        toastType,
        toast,
        resetToast,
    } = useCustomDialogs();

    const navigate = useNavigate();

    /**
     * Data
    */

    // __Properties
    const { propertiesContext, loadingProperties, errorLoadingProperties } = useContext(PropertiesContext);

    const propertyLocations = useMemo(() => (
        propertiesContext
            .filter(property => property?.listed)
            .map(property => property?.location)
    ), [propertiesContext]);


    // Currency value
    const currencyValuesRef = useRef();
    currencyValuesRef.current = Object.keys(aboutProperties?.priceRanges);

    // const [currency, setCurrency] = useState(currencyValuesRef.current[0]);
    // All input values
    const [formData, setFormData] = useState({
        searchValue: '',
        propertyType: '',
        currency: currencyValuesRef.current[0],
        priceRange: '',
        bedrooms: ''
    });

    // Price range selection based on currency
    const priceRangeSelection = useMemo(() => {
        return formData.currency === currencyValuesRef.current[0]
            ? aboutProperties?.priceRanges?.[currencyValuesRef.current[0]]
            : aboutProperties?.priceRanges?.[currencyValuesRef.current[1]];
    }, [formData.currency]);


    // General handleChange function
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Show location suggestions
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [matchLocations, setMatchLocations] = useState([]);

    useEffect(() => {
        if (formData.searchValue !== '') {
            const uniqueLocations = new Set();
            setMatchLocations(propertyLocations.filter(location => {
                const isMatch = location.toLowerCase().includes(formData.searchValue.toLowerCase());
                if (isMatch && !uniqueLocations.has(location.toLowerCase())) {
                    uniqueLocations.add(location.toLowerCase());
                    return true;
                }
                return false;
            }));
        }
    }, [propertyLocations, formData.searchValue]);

    // Handle search
    const handleSearch = () => {
        const { searchValue, propertyType, priceRange, currency, bedrooms } = formData;
        // Check for at least one valid search criteria
        if (!searchValue && !propertyType && !priceRange && !bedrooms) {
            return toast({ message: 'Please fill in at least one search criteria', type: 'gray-700' });
        }
        // Navigate to properties page with search query
        const query = new URLSearchParams({
            location: searchValue,
            type: propertyType,
            price: priceRange,
            currency: currency,
            bedrooms: bedrooms
        }).toString();
        navigate(`/properties/search?${query}`);
    };

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={resetToast} />
            <section className="d-flex flex-column hero">
                <div className="mt-auto container">
                    <Heading
                        title='Search your next home'
                        subtitle='Find new and featured properties located in your local city'
                        hType="h1"
                        className="mb-5 mb-md-0 mt-0 px-2 px-sm-0 pb-md-5"
                        titleClassName="mb-4"
                        subtitleClassName="w-fit mx-auto px-4 px-md-5 py-3 text-light fs-4 fw-semibold"
                    />
                    <div className="position-relative mx-2 mx-md-0 mb-3 mb-md-5 px-2 py-3 px-md-3 p-lg-4 bg-bodi blur-bg-2px text-gray-700 property-filter">
                        <div className="d-flex flex-column flex-xl-row">
                            <div className="col-xl-10 d-md-flex flex-wrap align-items-center justify-content-between">
                                <div className="d-grid p-2 pe-lg-3 col-md-6 box">
                                    <span className="flex-align-center mb-2 fw-bold small"><MapPinArea weight='bold' className='me-2 opacity-50' />Location</span>
                                    <div className="position-relative">
                                        <SearchInput
                                            className="p-2 border border-0 w-100 search-input"
                                            placeholder="City / Street"
                                            value={formData.searchValue}
                                            onChange={(val) => {
                                                setFormData({ ...formData, searchValue: val });
                                                setShowLocationSuggestions(true);
                                            }}
                                        />
                                        {!loadingProperties && !errorLoadingProperties &&
                                            (formData.searchValue !== '' && matchLocations.length !== 0 && showLocationSuggestions) && (
                                                <SearchSuggestions array={matchLocations} setData={setFormData} data={formData} callBack={() => setShowLocationSuggestions(false)} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="d-grid p-2 ps-lg-3 col-md-6 box">
                                    <span className="flex-align-center mb-2 fw-bold small"><Building weight='bold' className='me-2 opacity-50' /> Property type</span>
                                    <select id="filterParametersType" className="p-2 border border-0 w-100 ptr"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}>
                                        <option value="" disabled>Property type</option>
                                        {aboutProperties.allTypes
                                            .sort((a, b) =>
                                                a.localeCompare(b)
                                            )
                                            .map((val, index) => (
                                                <option key={index} value={val} className='dropdown-item p-2 px-3 small'>
                                                    {val}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="d-grid p-2 pe-lg-3 col-md-6 box">
                                    <span className="flex-align-center mb-2 fw-bold small"><MoneyWavy weight='bold' className='me-2 opacity-50' />
                                        Price range
                                        <span className="d-flex align-content-center justify-content-center gap-3 border border-top-0 border-bottom-0 border-bg-secondary border-opacity-25 ms-3 px-2 py-1">
                                            <span
                                                className={`small ${formData.currency === currencyValuesRef.current[0] ? 'text-primary px-2 bg-primary-subtle rounded-pill' : 'text-gray-500'} ptr`}
                                                onClick={() => setFormData({ ...formData, currency: currencyValuesRef.current[0] })}
                                            >
                                                {currencyValuesRef.current[0].toUpperCase()}
                                            </span>
                                            <span
                                                className={`small ${formData.currency === currencyValuesRef.current[1] ? 'text-primary px-2 bg-primary-subtle rounded-pill' : 'text-gray-500'} ptr`}
                                                onClick={() => setFormData({ ...formData, currency: currencyValuesRef.current[1] })}
                                            >
                                                {currencyValuesRef.current[1].toUpperCase()}
                                            </span>
                                        </span>
                                    </span>
                                    <select id="filterParametersPriceRange" className="p-2 border border-0 w-100 ptr"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleChange}>
                                        <option value="" disabled>Price range ({formData.currency.toUpperCase()})</option>
                                        {priceRangeSelection
                                            .map((val, index) => (
                                                <option key={index} value={val.min.replaceAll(',', '') + 'and' + val.max.replaceAll(',', '')}
                                                    className='dropdown-item p-2 px-3 small'>
                                                    {`${val.min} ${formData.currency.toUpperCase()} - ${val.max} ${formData.currency.toUpperCase()}`}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="d-grid p-2 ps-lg-3 col-md-6 box">
                                    <span className="flex-align-center mb-2 fw-bold small"><Bed weight='bold' className='me-2 opacity-50' />Bedrooms</span>
                                    <select id="filterParametersBedrooms" className="p-2 border border-0 w-100 ptr"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}>
                                        <option value="" disabled>Bedrooms</option>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <option key={index} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-fit col-xl-2 mx-auto my-3 d-flex align-items-center gap-2 ps-3 fw-bold confirm-search ptr clickDown shadow-sm" onClick={() => handleSearch()}>
                                <span>Search</span>
                                <span className="py-2 rounded-pill text-inherit"><CaretDoubleRight weight='bold' size={18} /></span>
                            </div>
                        </div>
                        <nav className="navbar navbar-expand-md px-2">
                            <ul className="list-unstyled d-flex flex-wrap row-gap-2 m-0 pt-3 fw-bold small">
                                <li className="px-2 border-start border-secondary border-opacity-50">
                                    <Link to="/properties/rent" className="text-decoration-none text-gray-700">Rentals <CaretRight className="ms-1" /></Link>
                                </li>
                                <li className="px-2 border-start border-secondary border-opacity-50">
                                    <Link to="/properties/sale" className="text-decoration-none text-gray-700">Sales <CaretRight className="ms-1" /></Link>
                                </li>
                                <li className="px-2 border-start border-secondary border-opacity-50">
                                    <Link to="/properties/_furnished" className="text-decoration-none text-gray-700">Furnished <CaretRight className="ms-1" /></Link>
                                </li>
                                <li className="px-2 border-start border-secondary border-opacity-50">
                                    <Link to="/properties/_unfurnished" className="text-decoration-none text-gray-700">Unfurnished <CaretRight className="ms-1" /></Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
            <section className='container mt-5 py-3 text-gray-600 clip-text-gradient site-description'>
                <CaretDown size={40} fill="#66825d" className="d-block mx-auto mb-4" style={{ color: "#66825d" }} />
                <p className="col-md-9 col-xl-6 mx-auto px-3 fs-95 text-justify">
                    Welcome to our real estate platform, <strong>your trusted destination for finding quality properties in Kigali, Rwanda</strong>. <br /><br /> Whether you're looking for residential, office, or commercial spaces, our curated listings connect you with options that meet your unique needs. <br /><br />
                    <span className="d-block text-center">
                        Let us guide you to your ideal property solution
                        <span className="d-none d-sm-inline">, with a focus on quality, convenience, and satisfaction.</span>
                    </span>
                </p>
                <CaretDown size={40} fill="#838340" className="d-block mx-auto mt-4" style={{ color: "#838340" }} />
            </section>
        </>
    );
}

export default Hero;