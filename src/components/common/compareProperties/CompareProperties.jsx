import React, { useContext, useEffect, useMemo, useState } from 'react';
import './compareProperties.css';
import { ArrowsLeftRight, Building, BuildingApartment, CaretRight, Plus, X } from '@phosphor-icons/react';
import { PropertiesContext } from '../../../App';
import { formatDate } from '../../../scripts/myScripts';
import { useNavigate } from 'react-router-dom';
import LoadingBubbles from '../LoadingBubbles';


const CompareProperties = ({ show, onClose, ids }) => {

    // Get fetched properties
    const { propertiesContext, loadingProperties, errorLoadingProperties } = useContext(PropertiesContext);

    const listedProperties = useMemo(() => {
        return propertiesContext.filter(property => property.listed);
    }, [propertiesContext]);
    const totalProperties = listedProperties.length;

    // Comparison
    const [selectedCompareProperties, setSelectedCompareProperties] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState([]); // Tracks visible rows

    useEffect(() => {
        if (show) {
            const propsToCompare = localStorage.getItem('PropsToCompare');

            if (propsToCompare) {
                const selectedIds = JSON.parse(propsToCompare); // Get IDs from localStorage
                const matchProperties = listedProperties.filter(property =>
                    selectedIds.includes(property.id)
                );

                // Determine which details are visible (non-null for at least one property)

                const detailVisibility = {
                    type: false,
                    category: false,
                    location: false,
                    price: false,
                    payment: false,
                    area: false,
                    bedrooms: false,
                    bathrooms: false,
                    kitchens: false,
                    garages: false,
                    furnished: false,
                };

                matchProperties.forEach(property => {
                    if (property.type) detailVisibility.type = true;
                    if (property.category) detailVisibility.category = true;
                    if (property.location) detailVisibility.location = true;
                    if (property.price) detailVisibility.price = true;
                    if (property.payment) detailVisibility.payment = true;
                    if (property.area) detailVisibility.area = true;
                    if (property.bedrooms) detailVisibility.bedrooms = true;
                    if (property.bathrooms) detailVisibility.bathrooms = true;
                    if (property.kitchens) detailVisibility.kitchens = true;
                    if (property.garages) detailVisibility.garages = true;
                    if (property.furnished) detailVisibility.furnished = true;
                });

                setVisibleDetails(Object.keys(detailVisibility).filter(key => detailVisibility[key]));
                setSelectedCompareProperties(matchProperties);
            } else {
                const emptyList = [];
                localStorage.setItem('PropsToCompare', JSON.stringify(emptyList));
            }
        }
    }, [listedProperties, show]);

    // Reset the tool
    const resetComparison = () => {
        const emptyList = [];
        localStorage.setItem('PropsToCompare', JSON.stringify(emptyList));
        setSelectedCompareProperties(emptyList);
    };

    // Navigate to a property
    const navigate = useNavigate();
    const goToProperty = (id) => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (id) {
            navigate(`/property/${id}`); // Navigate to the property
        }
    };

    return (
        <>
            {show && (
                <div className="position-fixed fixed-top inset-0 bg-black2 py-md-4 property-compare">
                    <div className="container-md h-100 overflow-auto pb-3 px-1 px-sm-2 px-md-3 bg-white text-gray-700 shadow">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-2 pt-2 px-2 bg-bodi sticky-top">
                            <h6 className="m-0 fw-light"><BuildingApartment weight='fill' /> <ArrowsLeftRight className='opacity-75' /> <Building weight='fill' /> <span className='ms-2'>Property comparison</span></h6>
                            <X size={35} weight='bold' className='p-2 ptr clickDown' onClick={onClose} />
                        </div>

                        {/* Content */}
                        {selectedCompareProperties.length === 0 ?
                            <>
                                <div className="col-sm-8 col-md-6 info-message m-auto mt-5 px-3 rounded">
                                    <ArrowsLeftRight size={80} className="dblock text-center w-100 mb-3 opacity-50" />
                                    <p className="text-info-emphasis text-center small">
                                        Select multipe properties that you would like to compare.
                                    </p>
                                    <button className="w-100 btn btn-outline-secondary border-secondary border-opacity-25 rounded-pill" onClick={onClose} >Sure</button>
                                </div>
                            </>
                            :
                            <>
                                <div className="d-flex overflow-auto property-compare_content">
                                    {/* Comparison Criteria */}
                                    <div className="col-3 col-lg-2 border-end">
                                        <div className="w-100 h-2_5rem position-relative text-center py-2 bg-gray-700 text-gray-400">
                                            <ArrowsLeftRight size={23} />
                                            <span className='badge text-gray-400 position-absolute right-0 bottom-0 mb-1'>{selectedCompareProperties.length}</span>
                                        </div>
                                        {/* Property detail names */}
                                        <ul className="list-unstyled m-0 px-2 bg-gray-300 overflow-auto">
                                            {visibleDetails.map(detail => {
                                                const actualDetailName = detail
                                                    .replace(/([A-Z])/g, ' $1'); // Add space before each uppercase letter
                                                return (
                                                    <li key={detail} className="h-2_5rem small text-nowrap text-capitalize">
                                                        {actualDetailName}
                                                    </li>
                                                );
                                            })}
                                            <li className="h-2_5rem small text-capitalize">
                                                Listed on
                                            </li>
                                            <li className="h-2_5rem small text-capitalize">
                                                More
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Selected Properties */}
                                    <div className="col-9 col-lg-10 p-0">
                                        {/* Loading */}
                                        {loadingProperties && <LoadingBubbles icon={<Building size={50} className='loading-skeleton' />} />}

                                        {/* Comparison */}
                                        {!loadingProperties && !errorLoadingProperties && totalProperties > 0 &&
                                            <>
                                                <div className="d-flex flex-nowrap overflow-auto">
                                                    {/* Corresponding detail values for each property */}
                                                    {selectedCompareProperties.map((property, index) => {
                                                        const { name } = property;

                                                        return (
                                                            <div key={index} className="property-column">
                                                                <div className="card border-0 border-start border-2 rounded-0 shadow-sm">
                                                                    <div className="h-2_5rem card-header border-0 rounded-0 bg-gray-600 text-gray-200 text-truncate small" title={name || `Property ${index + 1}`}>
                                                                        {name || `Property ${index + 1}`}
                                                                    </div>
                                                                    <div className="card-body py-0">
                                                                        <ul className="list-unstyled m-0 text-muted">
                                                                            {visibleDetails.map(detail => (
                                                                                <li key={detail} className={`h-2_5rem text-nowrap ${detail === 'type' ? 'fw-bold' : ''} small`}>
                                                                                    {property[detail] !== null && property[detail] !== undefined
                                                                                        ? detail === 'price'
                                                                                            ? `${property[detail].toLocaleString()} RWF`
                                                                                            : detail === 'area'
                                                                                                ? `${property[detail]} m²`
                                                                                                : property[detail]
                                                                                        : <span className='opacity-50' >N/A</span>}
                                                                                </li>
                                                                            ))}
                                                                            <li className={`h-2_5rem text-nowrap small`}>
                                                                                {formatDate(property.createdAt, { longMonthFormat: true })}
                                                                            </li>
                                                                            <li className={`h-2_5rem text-nowrap text-primary small ptr clickDown`}
                                                                                title={property.name}
                                                                                onClick={() => { onClose(); goToProperty(property.id); }}
                                                                            >
                                                                                See more <CaretRight className='ms-1' />
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="d-flex justify-content-end align-items-center gap-2 mt-3 px-2">
                                    <button className="btn btn-sm text-secondary rounded-0 border-0 me-2 clickDown" onClick={resetComparison}>
                                        Clear list
                                    </button>
                                    <a href="/properties/all" className="btn btn-sm btn-outline-primary border-primary border-opacity-25 ms-3 px-4 rounded-pill clickDown"
                                        onClick={onClose}>
                                        Add more <Plus />
                                    </a>
                                </div>
                            </>
                        }
                    </div>
                </div>
            )}
        </>
    )
}

export default CompareProperties;
