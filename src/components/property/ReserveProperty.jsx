import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../common/loginForm/LoginForm';
import { Axios, BASE_URL } from '../../api/api';
import LoadingIndicator from '../common/LoadingIndicator';
import useCustomDialogs from '../hooks/useCustomDialogs';
import { useAuth } from '../AuthProvider';

const ReserveProperty = ({ propertyId }) => {
    // Custom hooks
    const {
        // Toast
        toast,

    } = useCustomDialogs();
    // Auth check
    const { isAuthenticated, checkAuthOnMount, user } = useAuth();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    // Check login status on component mount
    useEffect(() => {
        checkAuthOnMount();
    }, []);

    // Reserve property
    const [isWaitingFetchAction, setIsWaitingFetchAction] = useState(false);
    const [reserverError, setReserverError] = useState('');

    const handleReserveProperty = async () => {
        if (!isAuthenticated) return setShowLogin(true); // Auth
        try {
            setIsWaitingFetchAction(true);
            const response = await Axios.post(`/property/${propertyId}/reserve`, { userId: user.id });
            if (response.status === 200) {
                // On success, redirect to user dashboard
                toast({ message: 'Property reserved successfully!', type: 'dark' });
                navigate(`/user/${user.id}`);
            } else {
                setReserverError(response.data.message || 'Error reserving property');
                toast({ message: reserverError, type: 'warning' });
            }
        } catch (err) {
            setReserverError('Error reserving property');
        } finally {
            setIsWaitingFetchAction(false);
        }
    };

    return (
        <>
            {/* Ongoing/unsettled fetch indicator */}
            {isWaitingFetchAction && (
                <div className='position-fixed fixed-top inset-0 bg-black3 flex-center py-md-3 px-lg-5 inx-high'>
                    <LoadingIndicator loaderColor="gray-200" />
                </div>
            )}
            <div>
                <button className="btn w-100 btn-success d-block mb-3 fw-light clickDown" onClick={handleReserveProperty}>
                    Reserve Property
                </button>

                {showLogin && <LoginForm setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />}
                {reserverError && <p className="text-danger">{reserverError}</p>}
            </div>
        </>
    );
};

export default ReserveProperty;
