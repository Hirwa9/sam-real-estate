import React, { useContext, useEffect, useMemo, useState } from "react";
import "./awards.css"
import { PropertiesContext } from "../../../App";
import { awards } from "../../data/Data";
import Heading from "../../common/Heading";
import { ArrowClockwise } from "@phosphor-icons/react";
import LoadingBubbles from "../../common/LoadingBubbles";
// import Heading from "../../common/Heading";

const Awards = () => {

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [errorLoadingReviews, setErrorLoadingReviews] = useState(null);
    const [refreshReviews, setRefreshReviews] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const response = await fetch('http://localhost:5000/reviews');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            // Filter only visible reviews
            const visibleReviews = data.filter(review => review.isVisible === 1);
            setReviews(visibleReviews);
            setErrorLoadingReviews(null);
            setRefreshReviews(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setErrorLoadingReviews(error);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Fetch reviews
    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (refreshReviews) {
            fetchReviews();
            setRefreshReviews(false);
        }
    }, [refreshReviews]);

    // Get fetched properties
    const { propertiesContext, loadingProperties, errorLoadingProperties, fetchProperties } = useContext(PropertiesContext);

    const allProperties = useMemo(() => (
        propertiesContext
    ), [propertiesContext]);
    const totalProperties = allProperties.length;

    const [propertiesCount, setPropertiesCount] = useState(0);
    const [propertiesLikes, setPropertiesLikes] = useState(0);

    // Update PropertiesCount when propertiesContext or errorLoadingProperties changes
    useEffect(() => {
        if (!errorLoadingProperties) {
            // Calculate all properties count
            setPropertiesCount(propertiesContext.length);
            // Calculate all properties likes count
            const likes = propertiesContext
                .map(item => item.likes)
                .filter(like => like !== null);

            let totalLikes = 0;
            // likes.forEach(like => {
            //     console.log(typeof (Array(JSON.parse(JSON.parse(like)))));

            //     console.log(JSON.parse(like));
            //     console.log(Array(JSON.parse(JSON.parse(like))).length);
            // });

            try {
                totalLikes = likes.reduce((sum, like) => {
                    let parsedLike = JSON.parse(like);  // First parse
                    // Parse again if value type is still a string
                    if (typeof parsedLike === "string") {
                        parsedLike = JSON.parse(parsedLike);
                    }
                    return sum + Array(parsedLike).length; // Count if it's an array
                }, 0);
            } catch (error) {
                console.error("Error parsing likes:", error);
            }

            setPropertiesLikes(totalLikes);

            // console.log(likes);
            console.log(propertiesLikes);

        } else {
            setPropertiesCount(0); // Reset PropertiesCount if there's an error
        }
    }, [propertiesContext, errorLoadingProperties, propertiesLikes]);

    if (!loadingProperties && !errorLoadingProperties && totalProperties === 0) return null

    return (
        <>
            <section className="p-3 awards">
                <div className="container">
                    <Heading
                        title={<>Over Happy Users Being With Us<br />Still They Love Our Services</>}
                        subtitle="Our awards"
                        hType="h6"
                        className="mb-0"
                    />
                    {/* Loading */}
                    {loadingProperties && <LoadingBubbles />}
                    {/* Error */}
                    {!loadingProperties && errorLoadingProperties &&
                        <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4 mx-auto mb-5 mt-4 p-3 rounded error-message">
                            <img src="/images/fetch_error_image.jpg" alt="Error" className="w-4rem h-4rem mx-auto mb-2 opacity-50" />
                            <p className="text-center text-muted small">Failed to load properties. Click the button to try again</p>
                            <button className="btn btn-sm btn-outline-secondary d-block mx-auto border border-secondary border-opacity-25" onClick={fetchProperties}>
                                <ArrowClockwise weight="bold" size={18} className="me-1" /> Retry
                            </button>
                        </div>
                    }
                    {/* Available content */}
                    {!loadingProperties && !errorLoadingProperties && totalProperties > 0 &&
                        <>
                            <div className="d-md-flex flex-wrap justify-content-around">
                                {awards.map((val, index) => {
                                    return (
                                        <div key={index} className="d-flex flex-column p-3 p-md-5 box">
                                            <div className="d-inline-block mx-auto icon">
                                                {/* <span className={val.icon}></span> */}
                                                {val.icon}
                                            </div>
                                            {val.name === "Properties" &&
                                                <div className="h1 fw-bold text-center my-4">{propertiesCount}</div>
                                            }
                                            {val.name === "Reviews" && (
                                                <>
                                                    {
                                                        loadingReviews ?
                                                            (
                                                                <LoadingBubbles />
                                                            )
                                                            : errorLoadingReviews ? (
                                                                <button className="btn btn-sm btn-outline-secondary d-block mx-auto border border-secondary border-opacity-25" onClick={() => fetchReviews()}>
                                                                    <ArrowClockwise weight="bold" size={18} className="me-1" />
                                                                </button>
                                                            )
                                                                : (
                                                                    <div className="h1 fw-bold text-center my-4">{reviews.length}</div>
                                                                )
                                                    }
                                                </>
                                            )
                                            }
                                            <p className="text-center small">{val.name}</p>
                                        </div>
                                    );
                                })}
                            </div>

                        </>
                    }
                </div>
            </section>
        </>
    );
}

export default Awards;