import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./awards.css"
import { PropertiesContext } from "../../../App";
import { awards } from "../../data/Data";
import Heading from "../../common/Heading";
import { ArrowClockwise } from "@phosphor-icons/react";
import LoadingBubbles from "../../common/LoadingBubbles";
import FetchError from "../../common/FetchError";
import CountUp from 'react-countup';
import { BASE_URL } from "../../../api/api";
// import Heading from "../../common/Heading";

const Awards = () => {

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [errorLoadingReviews, setErrorLoadingReviews] = useState(null);
    const [refreshReviews, setRefreshReviews] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const response = await fetch(`${BASE_URL}/reviews`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            // Filter only visible reviews
            const visibleReviews = data.filter(review => review.isVisible);
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
    const [registeredUsers, setRegisteredUsers] = useState(0);

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
        } else {
            setPropertiesCount(0); // Reset PropertiesCount if there's an error
        }
    }, [propertiesContext, errorLoadingProperties, propertiesLikes]);

    // Dynamic countup

    const [startCount, setStartCount] = useState(false); // State to start CountUp
    const contentRef = useRef(null); // Ref for the "properties" section

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCount(true); // Start counting when the element is in view
                }
            },
            { threshold: 0.55 } // Trigger when 50% of the element is visible
        );

        const observable = contentRef.current;
        if (observable) {
            observer.observe(observable);
        }

        return () => {
            if (observable) {
                observer.unobserve(observable);
            }
        };
    }, []);

    if (!loadingProperties && !errorLoadingProperties && totalProperties === 0) return null

    return (
        <>
            <section className="p-3 striped-bg awards">
                <div className="container">
                    <Heading
                        title={<>Over Happy Users Being With Us<br />Still They Love Our Services</>}
                        subtitle="Proud users"
                        hType="h6"
                        className="mb-0"
                    />
                    {/* Loading */}
                    {loadingProperties && <LoadingBubbles />}
                    {/* Error */}
                    {!loadingProperties && errorLoadingProperties && (
                        <FetchError
                            errorMessage="Failed to load properties. Click the button to try again"
                            refreshFunction={() => fetchProperties()}
                            className="mb-5 mt-4"
                        />
                    )}
                    {/* Available content */}
                    {!loadingProperties && !errorLoadingProperties && totalProperties > 0 &&
                        <>
                            <div className="d-md-flex flex-wrap justify-content-around" ref={contentRef}>
                                {awards.map((val, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="d-flex flex-column p-3 p-md-5 box"
                                        >
                                            <div className="d-inline-block mx-auto icon">
                                                {val.icon}
                                            </div>
                                            {val.name === "properties" && (
                                                <div className="h1 fw-bold text-center my-4">
                                                    {startCount && (
                                                        <CountUp start={propertiesCount - 10} end={propertiesCount} duration={5} />
                                                    )}
                                                </div>
                                            )}
                                            {val.name === "reviews" && (
                                                <>
                                                    {loadingReviews ? (
                                                        <LoadingBubbles />
                                                    ) : errorLoadingReviews ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary d-block mx-auto border border-secondary border-opacity-25"
                                                            onClick={() => fetchReviews()}
                                                        >
                                                            Retry
                                                        </button>
                                                    ) : (
                                                        <div className="h1 fw-bold text-center my-4">
                                                            {startCount && (
                                                                <CountUp end={reviews.length} duration={5} />
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {val.name === "insights" && (
                                                <div className="h1 fw-bold text-center my-4">
                                                    {startCount && (
                                                        <CountUp start={propertiesLikes - 10} end={propertiesLikes} duration={5} />
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-center small text-capitalize">{val.name}</p>
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