import React, { useContext, useEffect, useMemo, useState } from "react";
import "./featured.css"
import { featured } from "../../data/Data";
import { Link } from "react-router-dom";
import { PropertiesContext } from "../../../App";

const FeaturedTypesCard = () => {
    // Get fetched properties
    const { propertiesContext, loadingProperties, errorLoadingProperties } = useContext(PropertiesContext);
    const [typesCount, setTypesCount] = useState([]);
    const listedProperties = useMemo(() => (
        propertiesContext.filter(property => property.listed)
    ), [propertiesContext]);

    // Update typesCount when propertiesContext or errorLoadingProperties changes
    useEffect(() => {
        if (!errorLoadingProperties) {
            // Calculate types and their counts
            const types = listedProperties
                .map(item => item.type)
                .filter((type, index, self) => self.indexOf(type) === index);

            const countsObj = types.map(type => ({
                type,
                count: listedProperties.filter(item => item.type === type).length,
            }));

            setTypesCount(countsObj);
        } else {
            setTypesCount([]); // Reset typesCount if there's an error
        }
    }, [listedProperties, errorLoadingProperties]);

    return (
        <>
            <div className="container position-relative d-flex flex-wrap justify-content-around column-gap-2 my-3 featured-types">
                {featured.map((item, index) => {
                    const availableProps = typesCount.find(el => el.type === item.name.slice(0, -1));
                    const count = availableProps ? availableProps.count : 0;
                    return (
                        <div key={index} className="mb-3 p-3 ptr rounded clickDown box">
                            <Link to={item.path} className="text-decoration-none text-muted">
                                <img src={item.cover} alt="featured" className="m-auto" />
                                <div className="text-center small">
                                    <div className="small fw-bold">{item.name}</div>
                                    {!loadingProperties && !errorLoadingProperties ?
                                        <label className="text-truncate">
                                            {count} {(count > 1 || count === 0) ? 'properties' : 'property'}
                                        </label>
                                        :
                                        <label className="w-100 bg-black4 p-2 rounded-pill loading-skeleton"></label>
                                    }
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </>
    );
}


export default FeaturedTypesCard;