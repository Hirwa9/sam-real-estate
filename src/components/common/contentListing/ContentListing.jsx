import React from 'react';
import './contentListing.css';
const ContentListing = ({ title, content, icon, className }) => {
    return (
        <div className={`px-3 px-lg-4 py-4 ${className !== undefined ? className : ''} content-listing`}>
            <h6 className='h5 d-flex justify-content-between mb-2 text-grey fw-bold'>
                {title}
                {icon &&
                    <span className={`fa fa-${icon} mx-2 fs-3 opacity-50`}></span>
                }
            </h6>
            <div className='text-muted mb-3'>{content}</div>
        </div>
    )
}

export default ContentListing;
