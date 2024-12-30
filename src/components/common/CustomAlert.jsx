import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
    type = type || 'light'; // Default type
    return (
        <div className="custom-alert">
            <div className={`col-11 col-sm-8 col-md-6 col-lg-4 my-item item-${type} custom-alert custom-alert-content`}>
                <p className="p-3 small">
                    {message}
                </p>
                <button onClick={onClose}>Ok</button>
            </div>
        </div>
    );
};

export default CustomAlert;
