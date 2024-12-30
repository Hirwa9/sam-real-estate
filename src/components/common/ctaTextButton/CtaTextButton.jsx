import React from 'react';
import './ctaTextButton.css';

const CtaTextButton = ({ text, action, actionText, fallback, icon, type, textFallbackColor }) => {
    type = type || 'dark';
    let textColor;

    // Adjust colors
    switch (type) {
        case 'light':
        case 'warning':
        case 'yellow':
        case 'info':
        case 'gray-100':
        case 'gray-200':
        case 'gray-300':
        case 'gray-400':
        case 'gray-500':
            textColor = 'dark';
            break;
        default:
            textColor = 'light';
            break;
    }

    return (
        <div className={`mt-4 d-flex align-items-center justify-content-between border border-${type} overflow-hidden cta-text-button`} >
            <span className={`flex-grow-1 px-2 py-1 text-${textFallbackColor ? textFallbackColor : type} smaller`}>
                {text}
            </span>
            <span className={`flex-center ms-2 py-2 pe-4 small bg-${type} text-${textColor} text-decoration-none text-nowrap ptr bounceClick action-button`}
                onClick={() => { action(); fallback && fallback() }}>{actionText} {icon && icon}
            </span>
        </div>
    )
}

export default CtaTextButton;
