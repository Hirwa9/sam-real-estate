import React, { useEffect, useRef, useState } from 'react';
import './reviewForm.css';
import MyToast from '../Toast';
import { Smiley, SmileyMeh, SmileyMelting, SmileySad, SmileySticker, Star } from '@phosphor-icons/react';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';
import useCustomDialogs from '../../hooks/useCustomDialogs';
/* globals $ */

const ReviewForm = ({ onClose, setDontCloseCard, setRefreshReviews }) => {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,

        // Confirm Dialog
        showConfirmDialog,
        confirmDialogMessage,
        confirmDialogAction,
        confirmDialogType,
        confirmDialogActionWaiting,
        setConfirmDialogActionWaiting,
        customConfirmDialog,
        resetConfirmDialog,
    } = useCustomDialogs();

    // Handle input UI changes
    const handleChange = (e) => {
        const target = e.target;
        if (target.value !== undefined && target.value !== '') {
            $(target).addClass('has-data');
        } else {
            $(target).removeClass('has-data');
        }
    };

    /**
     * Submit review
     */

    const [reviewerName, setReviewerName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(4);
    const [reviewContent, setReviewContent] = useState('');
    const [canAddReview, setCanAddReview] = useState(false);

    const resetForm = () => {
        setReviewerName('');
        setEmail('');
        setRating(5);
        setReviewContent('');
        setCanAddReview(false);
    };

    const [isWaitingAddReview, setIsWaitingAddReview] = useState(false);
    // const [forceCreateReview, setForceCreateReview] = useState(false);

    // Check if all required fields are filled
    useEffect(() => {
        setCanAddReview(
            reviewerName.trim() !== '' &&
            email.trim() !== '' &&
            rating > 0 &&
            reviewContent.trim() !== '' &&
            reviewContent.trim().length >= 20
        );
    }, [reviewerName, email, rating, reviewContent]);

    // Check if a review exists
    const checkIfReviewExists = async (email) => {
        const response = await fetch(`http://localhost:5000/review/check?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('Error checking review existence');
        return response.json();
    };

    // Create a new review
    const createReview = async (review) => {
        const response = await fetch('http://localhost:5000/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error creating review');
        }
        return response.json();
    };

    // Force create a new review
    const forceCreateReviewRef = useRef(false);
    const createForcedReview = async (e) => {
        forceCreateReviewRef.current = true;
        await handleSubmitReview(e);
    };

    // Main handleSubmitReview function
    const handleSubmitReview = async (e) => {
        if (e) e.preventDefault();

        try {
            setIsWaitingAddReview(true);

            // Check if the reviewer email exists
            const checkData = await checkIfReviewExists(email);

            if (checkData.exists && !forceCreateReviewRef.current) {
                customConfirmDialog(
                    {
                        message: 'You already have a review. Would you like to add another?',
                        action: createForcedReview
                    }
                );
                return;
            }

            const review = { reviewerName, email, rating, reviewContent, force: forceCreateReviewRef.current };
            const data = await createReview(review);

            resetForm();
            resetConfirmDialog();
            toast({ message: data.message, type: 'dark' });
            forceCreateReviewRef.current = false; // Reset the flag
            setTimeout(() => {
                setRefreshReviews(true);
                onClose();
            }, 3500);

        } catch (error) {
            console.error('Error:', error.message);
            toast({ message: error.message || 'Something went wrong. Please try again.', type: 'warning' });
        } finally {
            setIsWaitingAddReview(false);
        }
    };

    // Prevent closing the card/form
    useEffect(() => {
        const reasonsToTrack = [
            { name: 'isWaitingAddReview', state: isWaitingAddReview },
            { name: 'confirmDialogActionWaiting', state: confirmDialogActionWaiting },
        ];

        setDontCloseCard(prev => {
            // Add component reasons and then remove false ones
            const activeReasons = [...prev, ...reasonsToTrack]
                .filter((reason) => reason.state)
                .map((reason) => ({ name: reason.name, value: true }));
            return [...activeReasons];
        });
    }, [isWaitingAddReview, confirmDialogActionWaiting, setDontCloseCard]);

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            <ConfirmDialog
                show={showConfirmDialog}
                message={confirmDialogMessage}
                type={confirmDialogType}
                action={() => { confirmDialogAction(); setConfirmDialogActionWaiting(true); }}
                actionIsWaiting={confirmDialogActionWaiting}
                closeText="Not now"
                onClose={resetConfirmDialog}
            />

            <div className="text-muted">
                <h3 className="h6 mb-3 text-center fw-bold text-uppercase">Submit a Review</h3>
                {/* <h3 className="h6 mb-3 text-center fw-bold text-uppercase">How do you feel about us?</h3> */}
                <p className='text-center px-3 fs-75 clip-text-gradient'>
                    We value every visitor's opinion. Whether you're just browsing or considering a real estate transaction, leave a review to help us improve and serve you better
                </p>
                <form onSubmit={handleSubmitReview} className="review-form">
                    {/* Reviewer rating */}
                    <div className="mb-3">
                        <label className="form-label w-100 text-center fw-bold fs-4 text-gray-600">Rating</label>
                        <div className="d-flex justify-content-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Star
                                    key={num}
                                    size={35}
                                    weight={num <= rating ? 'fill' : 'regular'}
                                    className="me-2 text-primaryColorDark bounceClick ptr"
                                    onClick={() => setRating(num)}
                                />
                            ))}
                        </div>
                        <div className="d-flex justify-content-center gap-2">
                            <SmileySad
                                size={35}
                                weight={rating === 1 ? 'fill' : 'regular'}
                                className="me-2 p-2 text-gray-600"
                                onClick={() => setRating(1)}
                            />
                            <SmileyMeh
                                size={35}
                                weight={rating === 2 ? 'fill' : 'regular'}
                                className="me-2 p-2 text-gray-600"
                                onClick={() => setRating(2)}
                            />
                            <Smiley
                                size={35}
                                weight={rating === 3 ? 'fill' : 'regular'}
                                className="me-2 p-2 text-gray-600"
                                onClick={() => setRating(3)}
                            />
                            <SmileySticker
                                size={35}
                                weight={rating === 4 ? 'fill' : 'regular'}
                                className="me-2 p-2 text-gray-600"
                                onClick={() => setRating(4)}
                            />
                            <SmileyMelting
                                size={35}
                                weight={rating === 5 ? 'fill' : 'regular'}
                                className="me-2 p-2 text-gray-600"
                                onClick={() => setRating(5)}
                            />
                        </div>
                    </div>

                    {/* Reviewer name */}
                    <div className={`form-input-element`}>
                        <input
                            type="text"
                            id="reviewerName"
                            className="form-control form-control-lg no-css-validation"
                            value={reviewerName}
                            required
                            onChange={(e) => { handleChange(e); setReviewerName(e.target.value); }}
                            style={{ lineHeight: 1.5 }}
                        />
                        <label htmlFor="reviewerName" className="form-label">Name</label>
                    </div>

                    {/* Reviewer email */}
                    <div className={`form-input-element`}>
                        <input
                            type="email"
                            id="reviewerEmail"
                            className="form-control form-control-lg no-css-validation"
                            value={email}
                            required
                            onChange={(e) => { handleChange(e); setEmail(e.target.value); }}
                            style={{ lineHeight: 1.5 }}
                        />
                        <label htmlFor="reviewerEmail" className="form-label">Email</label>
                    </div>

                    {/* Reviewer content */}
                    <div className={`form-input form-input-element mb-3`}>
                        <label htmlFor="reviewContent" className="form-label visually__hidden" aria-hidden="true">Your Review</label>
                        <textarea
                            id="reviewContent"
                            className="form-control no-css-validation border-0 border-bottom border-3 rounded-0"
                            rows="3"
                            placeholder="Your comment"
                            value={reviewContent}
                            required
                            onChange={(e) => { handleChange(e); setReviewContent(e.target.value); }}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 px-5 rounded-pill clickDown" disabled={!canAddReview}>
                        {!isWaitingAddReview ?
                            <>Submit</>
                            : <>Sending review <span className="spinner-grow spinner-grow-sm ms-2"></span></>
                        }
                    </button>
                </form>
            </div>
        </>
    );
};

export default ReviewForm;