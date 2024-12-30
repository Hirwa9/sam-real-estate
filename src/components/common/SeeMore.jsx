import React from 'react';

const SeeMore = ({ text, path, color, className }) => {
    return (
        <>
            <a href={path} className={`btn btn-${color} d-block ${className !== undefined ? className : ''} w-fit border rounded-pill`}>
                {text}
            </a>
        </>
    );
}

export default SeeMore;
