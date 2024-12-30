import React from 'react';

const LoadingBubbles = ({ className, icon }) => {
    return (
        <div className={`flex-column flex-center px-3 py-5 text-muted  ${className !== undefined ? className : ''} `}>
            {icon && icon}
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default LoadingBubbles;