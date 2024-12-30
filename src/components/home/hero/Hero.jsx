import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./hero.css"
import Heading from "../../common/Heading";
import { aboutProperties } from "../../data/Data";
import { Bed, Building, CaretDown, CaretRight, MagnifyingGlass, MapPinArea, MoneyWavy } from "@phosphor-icons/react";

const Hero = () => {
    const searcherRef = useRef();
    const navigate = useNavigate();

    // All input values
    const [formData, setFormData] = useState({
        propertySearcher: '',
    });

    // General handleChange function
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Search by input
    const handleSearch = () => {
        const searchString = formData.propertySearcher;
        if (searchString && searchString !== '' && searchString.length > 3) {
            const query = "search_query=" + searchString;
            navigate(`/properties/${query}`);
        }
    };

    // Search by type selection
    const handleTypeSelection = (e) => {
        const selectedType = e.target.value;
        if (selectedType) {
            navigate(`/properties/${selectedType}`); // Navigate to the corresponding type
        }
    };

    // Search by price range selection
    const handlePriceRangeSelection = (e) => {
        const selectedRange = e.target.value;
        const query = "priceRange_" + selectedRange;
        if (selectedRange) {
            navigate(`/properties/${query}`); // Navigate to the corresponding type
        }
    };

    // Search by bedroom selection
    const handleBedroomSelection = (e) => {
        const selectedNumber = e.target.value;
        if (selectedNumber) {
            const query = "bedrooms_" + selectedNumber;
            navigate(`/properties/${query}`); // Navigate to the corresponding type
        }
    };

    return (
        <>
            <section className="d-flex flex-column hero">
                <div className="mt-auto container">
                    <Heading
                        title='Search your next home'
                        subtitle='Find new and featured properties located in your local city'
                        hType="h1"
                        className="mb-5 mb-md-0 mt-0 px-2 px-sm-0 pb-md-5"
                        titleClassName="mb-4"
                        subtitleClassName="w-fit mx-auto px-4 px-md-5 py-3 bg-bodi"
                    />
                    <div className="mb-3 px-2 pt-3 bg-bodi blur-bg-2px text-gray-700 property-filter">
                        <div className="d-md-flex flex-wrap align-items-center justify-content-between ">
                            <div className="d-grid p-2 col-md-6 col-lg-4 box">
                                <span className="flex-align-center mb-2 fw-bold small"><MapPinArea weight='bold' className='me-2 opacity-50' />Location</span>
                                <div className="d-flex">
                                    <input ref={searcherRef} type="text" name="propertySearcher" id="" placeholder="City / Street" className="p-2 border border-0 w-100" value={formData.propertySearcher} onChange={handleChange} onKeyUp={(e) => { (e.key === "Enter") && handleSearch() }} />
                                    <button className="btn mx-1 rounded-pill" onClick={() => handleSearch()}><MagnifyingGlass weight='bold' size={20} /></button>
                                </div>
                            </div>
                            <div className="d-grid p-2 col-md-6 col-lg-2 box">
                                <span className="flex-align-center mb-2 fw-bold small"><Building weight='bold' className='me-2 opacity-50' /> Property type</span>
                                <select id="filterParametersType" className="p-2 border border-0 w-100 ptr"
                                    defaultValue=""
                                    onChange={handleTypeSelection}>
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
                            <div className="d-grid p-2 col-md-6 col-lg-4 box">
                                <span className="flex-align-center mb-2 fw-bold small"><MoneyWavy weight='bold' className='me-2 opacity-50' />Price range</span>
                                <select id="filterParametersPriceRange" className="p-2 border border-0 w-100 ptr"
                                    defaultValue=""
                                    onChange={handlePriceRangeSelection}>
                                    <option value="" disabled>Price range (RWF)</option>
                                    {aboutProperties.priceRanges
                                        .map((val, index) => (
                                            <option key={index} value={val.min.replaceAll(',', '') + 'and' + val.max.replaceAll(',', '')}
                                                className='dropdown-item p-2 px-3 small'>
                                                {val.min} - {val.max}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="d-grid p-2 col-md-6 col-lg-2 box">
                                <span className="flex-align-center mb-2 fw-bold small"><Bed weight='bold' className='me-2 opacity-50' />Bedrooms</span>
                                <select id="filterParametersBedrooms" className="p-2 border border-0 w-100 ptr"
                                    defaultValue=""
                                    onChange={handleBedroomSelection}>
                                    <option value="" disabled>Bedrooms</option>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <option key={index} value={index + 1}>{index + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <nav className="navbar navbar-expand-md px-2 pb-4">
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