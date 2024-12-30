import React, { useContext } from "react";
import "./location.css";
import { PropertiesContext } from "../../../App";
import Heading from "../../common/Heading";
import { aboutProperties, sectorsNames } from "../../data/Data";
import { ArrowRight, CaretRight } from '@phosphor-icons/react';
import LoadingBubbles from "../../common/LoadingBubbles";

const Location = () => {
    // Get fetched properties
    const { propertiesContext, loadingProperties } = useContext(PropertiesContext);

    if (loadingProperties) return <LoadingBubbles />;

    // Step 1: Group properties by sectors (case-insensitive substring check)
    const groupedBySector = propertiesContext
        .filter(property => (property.listed && !property.closed)) // Only live (listed and not closed) properties
        .reduce((acc, property) => {
            const { location, type } = property;

            // Find the sector that matches the location
            const sector = sectorsNames.find((sectorName) =>
                location.toLowerCase().includes(sectorName.toLowerCase())
            );

            if (sector) {
                if (!acc[sector]) {
                    acc[sector] = { counts: {}, images: {} };
                    aboutProperties.allTypes.forEach((type) => (acc[sector].counts[type] = 0));
                }

                // Increment the count for this property type
                acc[sector].counts[type] = (acc[sector].counts[type] || 0) + 1;

                // Store the first image for each type if not already set
                if (!acc[sector].images[type]) {
                    acc[sector].images[type] = property.cover;
                }
            }

            return acc;
        }, {});

    // Step 2: Prepare data for rendering
    const sectorData = Object.entries(groupedBySector)
        .filter(([_, data]) => {
            // Only include sectors with at least 3 non-zero property types
            const nonZeroTypes = Object.values(data.counts).filter((count) => count > 0);
            return nonZeroTypes.length >= 3;
        })
        .map(([sector, data]) => {
            // Find the property type with the highest count
            const topType = Object.keys(data.counts).reduce((a, b) =>
                data.counts[a] > data.counts[b] ? a : b
            );

            return {
                sector,
                counts: data.counts,
                cover: data.images[topType],
            };
        })
        .slice(0, 6); // Slice to display only the top 6 sectors

    // Step 3: Do not render the component if no data exists
    if (sectorData.length === 0) return null;

    return (
        <>
            <section className="location">
                <div className="container-fluid">
                    <Heading
                        title="Explore By Location"
                        subtitle="Discover properties in your desired locations. Our detailed listings provide comprehensive information to help you find the perfect home or investment opportunity."
                        hType="h2"
                    />
                    <div className="d-sm-flex flex-wrap justify-content-around">
                        {sectorData.map((item, index) => (
                            <div key={index} className="col-sm-6 col-lg-4 mb-4 p-sm-2">
                                <div className="position-relative h-100 overflow-hidden box">
                                    <img
                                        src={item.cover}
                                        alt={item.sector}
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                    <div className="overlay p-3 py-5 m-3">
                                        <h5 className="fw-bold">Some properties in {item.sector}</h5>
                                        <p className="flex-center flex-wrap row-gap-2 align-items-center small">
                                            {Object.entries(item.counts)
                                                .filter(([_, count]) => count > 0)
                                                .slice(0, 3)
                                                .map(([type, count], i) => (
                                                    <span key={i} className="opacity-75 me-3">
                                                        {count} {type}{count > 1 ? 's' : ''}
                                                    </span>
                                                ))}
                                        </p>
                                        <a
                                            href={`/properties/search_query=${item.sector}`}
                                            className="btn btn-sm d-block w-fit mx-auto my-3 px-4 bg-white2 text-light fw-semibold rounded-0"
                                        >
                                            Explore more <CaretRight weight="bold" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* See More Link */}
                    <a
                        href="/properties/all"
                        className="d-block w-fit ms-auto me-4 me-md-auto my-3 my-md-5 text-decoration-none see-more-link"
                    >
                        See more <ArrowRight weight="bold" />
                    </a>
                </div>
            </section>
        </>
    );
};

export default Location;