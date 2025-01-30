import React from 'react'
import './workingHours.css'
import { useSettings } from '../../SettingsProvider';
import { Clock } from '@phosphor-icons/react';
import LoadingBubbles from '../LoadingBubbles';

const WorkingHours = ({ className, isStatic }) => {

    // Site common setting
    const {
        businessProfileSettings,
        loadingBusinessProfileSettings,
        errorLoadingBusinessProfileSettings,
    } = useSettings();

    return (
        <>
            <div className={`container px-2 px-md-4 ${!isStatic ? 'stick' : ''} ${className !== undefined ? className : ''} working-hours`}>
                <h2 className='font-variant-small-caps my-4 text-muted text-center'>Working Hours</h2>
                <div className='connection-line connection-line-horizontal mx-5 mx-sm-auto mb-4 col-sm-6' style={{ "--_measure": "1.2rem" }}></div>
                <div className='d-lg-flex justify-content-around'>
                    <div className="d-flex d-lg-grid flex-wrap align-items-center border-bottom pt-2 pb-3">
                        <div className="col-12 col-sm-6 col-xl-12 mb-2 px-3">
                            <div className='d-flex align-items-center px-2'>
                                <span className='fw-bold text-gray-600'>Monday</span>
                                <span className='connection-line connection-line-horizontal w-2rem mx-2 flex-shrink-0'></span>
                                <span className='fw-bold text-gray-600'>Friday</span>
                            </div>
                            <>
                                {loadingBusinessProfileSettings && (
                                    <LoadingBubbles />
                                )}
                                {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && (
                                    <div className='d-flex gap-2 px-2 text-nowrap text-gray-700 small'>
                                        <span className='flex-align-center start-time'><Clock size={22} weight='duotone' className='me-1 text-gray-500' />
                                            {
                                                businessProfileSettings.weekdaysOpen !== undefined ? businessProfileSettings.weekdaysOpen.slice(0, -3) : businessProfileSettings.weekdaysOpen
                                            } <span className="ms-1 opacity-50">UTC</span></span> - <span className='flex-align-center end-time'><Clock size={22} weight='duotone' className='me-1 text-gray-500' />
                                            {
                                                businessProfileSettings.weekdaysClose !== undefined ? businessProfileSettings.weekdaysClose.slice(0, -3) : businessProfileSettings.weekdaysClose
                                            } <span className="ms-1 opacity-50">UTC</span></span>
                                    </div>
                                )}
                            </>
                        </div>
                        <div className='ms-auto w-fit px-3 fs-5 fw-light text-gray-600'>Available</div>
                    </div>
                    <div className="d-flex d-lg-grid flex-wrap align-items-center border-bottom pt-2 pb-3">
                        <div className="col-12 col-sm-6 col-xl-12 mb-2 px-3">
                            <div className='d-flex align-items-center px-2'>
                                <span className='fw-bold text-gray-600'>Saturday</span>
                                <span className='connection-line connection-line-horizontal w-2rem mx-2 flex-shrink-0'></span>
                                <span className='fw-bold text-gray-600'>Sunday</span>
                            </div>
                            <>
                                {loadingBusinessProfileSettings && (
                                    <LoadingBubbles />
                                )}
                                {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && (
                                    <div className='d-flex gap-2 px-2 text-nowrap text-gray-700 small'>
                                        <span className='flex-align-center start-time'><Clock size={22} weight='duotone' className='me-1 text-gray-500' />
                                            {
                                                businessProfileSettings.weekendsOpen !== undefined ? businessProfileSettings.weekendsOpen.slice(0, -3) : businessProfileSettings.weekendsOpen
                                            } <span className="ms-1 opacity-50">UTC</span></span> - <span className='flex-align-center end-time'><Clock size={22} weight='duotone' className='me-1 text-gray-500' />
                                            {
                                                businessProfileSettings.weekendsClose !== undefined ? businessProfileSettings.weekendsClose.slice(0, -3) : businessProfileSettings.weekendsClose
                                            } <span className="ms-1 opacity-50">UTC</span></span>
                                    </div>
                                )}
                            </>
                        </div>
                        <div className='ms-auto w-fit px-3 fs-5 fw-light text-gray-600'>By Appointment</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkingHours
