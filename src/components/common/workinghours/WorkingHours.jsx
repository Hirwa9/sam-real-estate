import React from 'react'
import './workingHours.css'

const WorkingHours = ({ className, isStatic }) => {
    return (
        <>
            <div className={`container px-2 px-md-4 ${!isStatic ? 'stick' : ''} ${className !== undefined ? className : ''} working-hours`}>
                <h2 className='font-variant-small-caps my-4 text-muted text-center'>Working Hours</h2>
                <div className='connection-line connection-line-horizontal mb-4 mx-5 mx-sm-auto col-sm-6' style={{ "--_measure": "1.2rem" }}></div>
                <div className='d-lg-flex justify-content-around'>
                    <div className="d-flex flex-wrap align-items-center border-bottom pt-2 pb-3">
                        <div className="col-12 col-sm-6 col-xl-12 mb-2 px-3">
                            <div className='d-flex align-items-center px-2'>
                                <span className='fw-bold text-gray-600'>Monday</span>
                                <span className='connection-line connection-line-horizontal w-2rem mx-2 flex-shrink-0'></span>
                                <span className='fw-bold text-gray-600'>Friday</span>
                            </div>
                            <div className='px-2 text-nowrap text-gray-700 small'>
                                <span className='start-time'>09 : 00 AM</span> - <span className='end-time'>05 :00 PM</span>
                            </div>
                        </div>
                        <div className='ms-auto w-fit px-3 fs-5 fw-light text-muted'>Available</div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center border-bottom pt-2 pb-3">
                        <div className="col-12 col-sm-6 col-xl-12 mb-2 px-3">
                            <div className='d-flex align-items-center px-2'>
                                <span className='fw-bold text-gray-600'>Saturday</span>
                                <span className='connection-line connection-line-horizontal w-2rem mx-2 flex-shrink-0'></span>
                                <span className='fw-bold text-gray-600'>Sunday</span>
                            </div>
                            <div className='px-2 text-nowrap text-gray-700 small'>
                                <span className='start-time'>09 : 00 AM</span> - <span className='end-time'>05 :00 PM</span>
                            </div>
                        </div>
                        <div className='ms-auto w-fit px-3 fs-5 fw-light text-muted'>By Appointment</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkingHours
