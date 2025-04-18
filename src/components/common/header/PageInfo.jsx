import React from 'react'

const PageInfo = ({ name, title, cover, className }) => {
    return (
        <>
            <div className={`position-relative ${className !== undefined ? className : ''} page-info`}
                style={{
                    backgroundImage: `linear-gradient(rgba(17, 40, 72, 0.629), rgba(17, 40, 72, 0.629)), url('${cover}')`
                }}>
                <div className="container pt-5">
                    <span>{name}</span>
                    <h1>{title}</h1>
                </div>
            </div>
        </>
    )
}

export default PageInfo;
