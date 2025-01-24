import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../SettingsProvider';

const BusinessLogoName = ({ className }) => {
    // Site common setting
    const {
        businessProfileSettings,
        errorLoadingBusinessProfileSettings,
        loadingBusinessProfileSettings,
    } = useSettings();
    return (
        <>
            {/* Loading */}
            {loadingBusinessProfileSettings && (
                <div className={`nav-item navbar-brand col-md-3 d-flex px-2 loading-skeleton ${className !== undefined ? className : ''}`}>
                    <div className="me-2 logo">
                        <div className="w-2_5rem h-2_5rem bg-gray-300 rounded-circle logo"></div>
                    </div>
                    <div className='fs-70 pt-1'>
                        <div className='rounded-pill bg-gray-300 mb-2 px-5 py-2'></div>
                    </div>
                </div>
            )}
            {/* Available content */}
            {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && (
                <div className={`nav-item navbar-brand col-md-3 d-flex p-0 ${className !== undefined ? className : ''}`}>
                    <div className="me-2 logo">
                        <Link to="/">
                            <img src={businessProfileSettings.logoUrl} alt="" className="rounded-circle logo"></img>
                        </Link>
                    </div>
                    <div className='fs-70 pt-1 text-gray-600 font-variant-small-caps'>
                        {businessProfileSettings.businessName}
                        <div className='connection-line connection-line-horizontal mx-2 mx-sm-auto mt-1 col-sm-8 opacity-25' style={{ "--_measure": "0.6rem" }}></div>
                    </div>
                </div>
            )}
        </>
    )
}

export default BusinessLogoName
