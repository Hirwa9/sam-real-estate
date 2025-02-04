import React, { useEffect, useRef, useState } from 'react';
import { ArrowClockwise, CaretDown, HandWaving, ListStar, Plus, Star, UserCircle } from '@phosphor-icons/react';
import BottomFixedCard from './bottomFixedCard/BottomFixedCard';
import ReviewForm from './reviewForm/ReviewForm';
import FetchError from './FetchError';
import { BASE_URL } from '../../api/api';

const ReviewCard = () => {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [errorLoadingReviews, setErrorLoadingReviews] = useState(null);
    const [limit, setLimit] = useState(8);

    const reviewAdderTogglerRef = useRef();
    const [clientAddReview, setClientAddReview] = useState(false);
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

    // Fetch reviews from the API
    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (refreshReviews) {
            fetchReviews();
            setRefreshReviews(false); // Reset after fetching to allow future triggers
        }
    }, [refreshReviews]);

    const [dontCloseCard, setDontCloseCard] = useState([]);

    return (
        <>
            {/* Loading */}
            {loadingReviews &&
                <div className="container-fluid d-sm-flex flex-wrap px-2 px-md-4 py-5 overflow-visible loading-skeleton">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="col-sm-6 col-lg-4 mb-4 px-sm-3">
                            <div className="position-relative d-flex flex-column bg-bodi text-gray-500 isolate review-item">
                                <div className="flex-align-center mb-2">
                                    <UserCircle size={30} weight="fill" className="me-2" />
                                    <div className='w-50 p-2 bg-gray-400 rounded-pill'></div>
                                </div>

                                <div className="flex-align-center mb-2 ps-1">
                                    <div className="w-50 me-3 p-2 bg-gray-400 rounded-pill"></div>
                                    <div className="w-25 p-2 bg-gray-400 rounded-pill"></div>
                                </div>

                                <div className="flex-grow-1 p-2 smaller border border-2 rounded-3 shadow-sm">
                                    <div className="mb-2 p-1 bg-gray-400 w-100"></div>
                                    <div className="mb-2 p-1 bg-gray-400 w-100"></div>
                                    <div className="p-1 bg-gray-400 w-80"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {/* Error */}
            {!loadingReviews && errorLoadingReviews && (
                <FetchError
                    errorMessage="Couldn't get reviews. Click the button below to retry"
                    refreshFunction={() => fetchReviews()}
                    className="mb-5 mt-4"
                />
            )}
            {/* Zero content */}
            {!loadingReviews && !errorLoadingReviews && reviews.length === 0 &&
                <div className="col-sm-8 col-md-6 mx-auto mb-5 px-3 info-message">
                    <ListStar size={80} className="text-center w-100 mb-3 opacity-50" style={{ animation: 'wobbleBottom 10s infinite' }} />
                    <p className="text-muted small">
                        No reviews yet. You will see our site reviews here as they come in.
                    </p>
                    <button ref={reviewAdderTogglerRef} type="button" className='btn btn-sm btn-outline-secondary border-secondary border-opacity-25 w-100 rounded-pill clickDown'
                        onClick={() => setClientAddReview(true)}
                    >
                        Add one <Plus size={15} className='ms-1' />
                    </button>
                </div>
            }
            {!loadingReviews && !errorLoadingReviews && reviews.length > 0 &&
                <div className="container-fluid d-sm-flex flex-wrap px-2 px-md-4 py-5 overflow-visible">
                    {reviews
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, limit)
                        .map(review => (
                            <div key={review.id} className="col-sm-6 col-lg-4 mb-4 px-sm-3">
                                <div className="position-relative d-flex flex-column bg-bodi text-gray-700 isolate review-item">
                                    {/* Reviewer name */}
                                    <div className="flex-align-center mb-2">
                                        <UserCircle size={30} weight="fill" className="me-2 text-gray-500" />
                                        <span>{review.reviewerName}</span>
                                    </div>

                                    {/* Rating stars and review date */}
                                    <div className="flex-align-center mb-2 ps-1">
                                        <div className="flex-align-center me-3">
                                            {[...Array(5)].map((_, index) => (
                                                <Star
                                                    key={index}
                                                    size={15}
                                                    weight={index < review.rating ? 'fill' : 'regular'}
                                                    className="me-2"
                                                />
                                            ))}
                                        </div>
                                        <span className="smaller" style={{ lineHeight: 1 }}>
                                            {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* Review content */}
                                    <p className="flex-grow-1 p-2 smaller border border-2 rounded-3">
                                        {review.reviewContent}
                                    </p>
                                </div>
                            </div>
                        ))}
                    {limit < reviews.length &&
                        <div className="col-sm-6 col-lg-4 mb-4 px-sm-3">
                            <button type="button" className='btn btn-sm btn-outline-secondary border-secondary border-opacity-25 w-100 rounded-pill clickDown'
                                onClick={() => setLimit(limit + 8)}
                            >
                                See more <CaretDown />
                            </button>
                        </div>
                    }
                    <div className="col-sm-7 col-lg-5 mx-auto mb-4 px-sm-3">
                        <div className="position-relative d-flex flex-column bg-bodi text-gray-700 isolate review-item">
                            <div className="flex-align-center mb-2">
                                <UserCircle size={30} weight="fill" className="me-2 text-gray-500" />
                                <span>Someone</span>
                            </div>
                            <div className="flex-align-center mb-2 ps-1">
                                <div className="flex-align-center me-3">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            size={15}
                                            weight={index < 4 ? 'fill' : 'regular'}
                                            className="me-2"
                                        />
                                    ))}
                                </div>
                                <span className="smaller" style={{ lineHeight: 1 }}>
                                    {new Date().toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className="flex-grow-1 p-2 smaller bg-gray-900 text-gray-200 rounded-3">
                                <HandWaving size={20} /><HandWaving size={20} /> Tell us how you feel about our services. <br /><br />
                                <button ref={reviewAdderTogglerRef} type="button" className='btn btn-sm btn-outline-light border-light border-opacity-25 w-100 rounded-pill clickDown'
                                    onClick={() => setClientAddReview(true)}
                                >
                                    Submit a review <ListStar size={15} className='ms-1' />
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            }

            {/* Review adding form */}
            <BottomFixedCard
                show={clientAddReview}
                content={[
                    <ReviewForm
                        setDontCloseCard={setDontCloseCard}
                        setRefreshReviews={setRefreshReviews}
                        onClose={() => { setClientAddReview(false); }}
                    />
                ]}
                toggler={reviewAdderTogglerRef}
                onClose={() => setClientAddReview(false)}
                className="pb-3"
                avoidCloseReasons={dontCloseCard}
            />
        </>
    );
};

export default ReviewCard;