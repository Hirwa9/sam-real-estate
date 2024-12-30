import React, { useRef, useState } from 'react';
import DividerText from './DividerText';
import { useNavigate } from 'react-router-dom';
import { handleBedroomSelection, handleBuildingStatusSelection, handlePriceRangeSelection, handleTypeSelection } from '../../scripts/myScripts';
import { aboutProperties } from '../data/Data';
import { Bed, Building, MagnifyingGlass, MoneyWavy, Shovel } from '@phosphor-icons/react';

const PropertySearcher = ({ className, id, iconed, callback }) => {
    /**
     * Generally Finding more properties
     */

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
            ...formData, // Previous state
            [name]: value
        });
    };

    // Search by input
    const handleSearch = () => {
        const searchString = formData.propertySearcher;
        if (searchString && searchString !== '' && searchString.length > 3) {
            const query = "search_query=" + searchString;
            navigate(`/properties/${query}`);
            callback && callback();
        }
    };

    return (
        <div className={`${className !== undefined ? className : ''}`}>
            <DividerText text="🔍 Search Properties" className="mx-3 mb-3 text-gray-700" />
            <div>
                <div className="p-2 mb-2">
                    <div className="d-flex column-gap-2">
                        <input ref={searcherRef} type="text" name="propertySearcher" id="" placeholder="Enter keyword" className="px-3 border border-3 w-100 h-3rem rounded-4" value={formData.propertySearcher} onChange={handleChange} onKeyUp={(e) => { (e.key === "Enter") && handleSearch() }} />
                        <button className="btn bg-secondary bg-opacity-25 flex-center rounded-4 clickDown" onClick={() => handleSearch()}><MagnifyingGlass weight='bold' fill='var(--black2)' size={20} /></button>
                    </div>
                </div>
                <div className='mb-2 p-2 rounded-3 shadow-sm'>
                    <div className='flex-align-center px-2 py-1'>
                        {iconed && <Building weight='bold' className='me-1 opacity-50' />}
                        <select id="filterTypes" className="form-select ps-1 py-0 border-0 rounded-0 ptr"
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
                    <label htmlFor='filterTypes' className='m-0 px-2 fs-75'>
                        Search properties based on their types (i.e; houses, plots, apartments, ...)
                    </label>
                </div>
                <div className='mb-2 p-2 rounded-3 shadow-sm'>
                    <div className='flex-align-center px-2 py-1'>
                        {iconed && <Bed weight='bold' className='me-1 opacity-50' />}
                        <select id="filterBedrooms" className="form-select ps-1 py-0 border-0 rounded-0 ptr"
                            defaultValue=""
                            onChange={handleBedroomSelection}>
                            <option value="" disabled>Bedrooms</option>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <option key={index} value={index + 1}>{index + 1}</option>
                            ))}
                        </select>
                    </div>
                    <label htmlFor='filterBedrooms' className='m-0 px-2 fs-75'>
                        Search properties informed about their bed/living rooms availability
                    </label>
                </div>
                <div className='mb-2 p-2 rounded-3 shadow-sm'>
                    <div className='flex-align-center px-2 py-1'>
                        {iconed && <MoneyWavy weight='bold' className='me-1 opacity-50' />}
                        <select id="filterPriceRange" className="form-select ps-1 py-0 border-0 rounded-0 ptr"
                            defaultValue=""
                            onChange={handlePriceRangeSelection}>
                            <option value="" disabled>Price range</option>
                            {aboutProperties.priceRanges
                                .map((val, index) => (
                                    <option key={index} value={val.min.replaceAll(',', '') + 'and' + val.max.replaceAll(',', '')}
                                        className='dropdown-item p-2 px-3 small'>
                                        {val.min} - {val.max}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <label htmlFor='filterPriceRange' className='m-0 px-2 fs-75'>
                        Search properties within a specific range of price
                    </label>
                </div>
                <div className='mb-2 p-2 rounded-3 shadow-sm'>
                    <div className='flex-align-center px-2 py-1'>
                        {iconed && <Shovel weight='bold' className='me-1 opacity-50' />}
                        <select id="filterBuildingStatus" className="form-select ps-1 py-0 border-0 rounded-0 ptr"
                            defaultValue=""
                            onChange={handleBuildingStatusSelection}>
                            <option value="" disabled>Building Status</option>
                            <option value="furnished" className='dropdown-item p-2 px-3 small'>
                                Furnished
                            </option>
                            <option value="unfurnished" className='dropdown-item p-2 px-3 small'>
                                Unfurnished
                            </option>
                        </select>
                    </div>
                    <label htmlFor='filterBuildingStatus' className='m-0 px-2 fs-75'>
                        Search properties according to their furnishment status
                    </label>
                </div>
            </div>
        </div>
    )
}

export default PropertySearcher;
