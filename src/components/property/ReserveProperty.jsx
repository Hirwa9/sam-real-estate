import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../common/loginForm/LoginForm';
import axios from 'axios';

const ReserveProperty = ({ propertyId }) => {
    // Auth checks
    const [isAuthenticated, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [error, setError] = useState('');const navigate = useNavigate();
    

    // Check login status on component mount
    const checkAuthOnMount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token', { withCredentials: true });
            response.data.accessToken ?
                setIsLoggedIn(true)
                : setIsLoggedIn(false);
        } catch (error) {
            setIsLoggedIn(false); // If an error occurs, set as not logged in
        }
    }

    // Attempt to refresh the access token if it's expired
    useEffect(() => {
        checkAuthOnMount();
    }, []);

    const handleReserveProperty = async () => {
        if (!isAuthenticated) return setShowLogin(true); // Auth

        try {
            const response = await fetch(`http://localhost:5000/property/${propertyId}/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your token logic
                }
            });
            const result = await response.json();
            if (response.ok) {
                // Redirect or show a success message
                alert('Property reserved successfully!');
                navigate('/user/orders');
            } else {
                setError(result.message || 'Error reserving property');
            }
        } catch (err) {
            setError('Error reserving property');
        }
    };

    return (
        <div>
            <button className="btn w-100 btn-success d-block mb-3 fw-light clickDown" onClick={handleReserveProperty}>
                Reserve Property
            </button>

            {showLogin && <LoginForm setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default ReserveProperty;
