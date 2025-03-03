import React, { useEffect, useRef, useState } from 'react';
import './whatsAppContactor.css';

import logo from "../../../components/images/logo.webp";
import { CaretDown, CaretUp, FacebookLogo, TwitterLogo, User, WhatsappLogo } from '@phosphor-icons/react';
import SocialMediaIcons from '../SocialMediaIcons';

const WhatsAppContactor = ({ show, className, toggler, onClose }) => {
    const cardRef = useRef();
    const [showMoreSocialMedia, setShowMoreSocialMedia] = useState(false);
    const toggleSocialMedia = () => setShowMoreSocialMedia(!showMoreSocialMedia);

    // Hide card
    const slideOutCard = () => {
        cardRef.current.classList.add('flyOutB');
        setShowMoreSocialMedia(false);
        setTimeout(() => {
            onClose();
        }, 400);
    }

    // Detect outside clicks
    const handleClickOutside = (e) => {
        if (cardRef.current && toggler.current) {
            if (
                !cardRef.current.contains(e.target) &&
                !toggler.current.contains(e.target)
            ) {
                slideOutCard();  // Hide the card
            }
        }
    };

    // Attach the click event listener
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);  // Cleanup
        };
    }, []);

    return (
        <>
            {show &&
                <div className={`position-fixed fixed-top inset-0 d-flex align-items-end justify-content-end px-2`}>
                    <div
                        ref={cardRef}
                        className={`blur-bg-10px overflow-auto mb-md-3 ${className !== undefined ? className : ''} whatsapp-contactor`}>
                        <div className='position-relative profile-illustration'>
                            <div className="dim-100 p-3 bg-no-repeat-cover cover-photo">
                                <div className='text-gray-300 text-end'>
                                    <h3 className='fs-2 mb-0'>Let's chat</h3>
                                    <p className='ms-auto smaller'>
                                        Connect with us and place some deals
                                    </p>
                                </div>
                            </div>
                            <div className='rounded-circle profile-photo'>
                                <img src={logo} alt="bg-image" className="dim-100 object-fit-cover rad-inherit bg-gray-400" />
                            </div>
                        </div>
                        <div className="p-2 pt-5 bg-light">
                            <div className='d-flex align-items-center mb-2 text-gray-700 ptr clickDown'
                                onClick={() => window.open('https://wa.me/250789305885?text=Hello%2C%20I%27m%20interested%20in%20your%20services.', '_blank')}
                            >
                                <User size={45} className="w-3rem me-2 rounded-circle profile-photo" />
                                <div className="d-grid flex-grow-1 pe-3">
                                    <div className='d-flex justify-content-between'>
                                        <span className='fw-bold text-gray-700'>Samuel</span>
                                        <span className='d-flex align-items-center fw-light text-gray-600 fs-75 chat-av-text'>Online</span>
                                    </div>
                                    <span className='smaller opacity-75'>Sam Real Estate</span>
                                </div>
                            </div>
                            <div className='flex-center my-3'>
                                {!showMoreSocialMedia ?
                                    <div className='badge text-gray-700 flex-center flex-column fw-normal ptr' title='Show more social media' onClick={toggleSocialMedia}>
                                        More
                                        <CaretDown className='ptr-none' />
                                    </div>
                                    :
                                    <div className='badge text-gray-700 flex-center flex-column fw-normal ptr' title='Show less social media' onClick={toggleSocialMedia}>
                                        Less
                                        <CaretUp className='ptr-none' />
                                    </div>
                                }
                            </div>
                            <div className={`collapsible-grid-y ${showMoreSocialMedia ? 'working' : ''}`} >
                                <div className="collapsing-content">
                                    <SocialMediaIcons strokeColor="var(--bs-gray-700)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default WhatsAppContactor;
