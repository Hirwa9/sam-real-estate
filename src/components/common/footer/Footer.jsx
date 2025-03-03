import React, { useRef, useState } from 'react';
import useCustomDialogs from '../../hooks/useCustomDialogs';
import { useLocation } from 'react-router-dom';
import './footer.css';
import { developerWebsiteLink, footer } from '../../data/Data';
import SocialMediaIcons from '../SocialMediaIcons';
import { Code, WarningCircle } from '@phosphor-icons/react';
import BottomFixedCard from '../bottomFixedCard/BottomFixedCard';
import SubscriptionForm from '../subscriptionForm/SubscriptionForm';
import MyToast from "../Toast";
import { isValidEmail } from '../../../scripts/myScripts';

function Footer() {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,
    } = useCustomDialogs();

    const excludedRoutes = ["/contact", "/login"];
    const contactUsLink = "/contact",
        location = useLocation(),
        canRenderContactUs = excludedRoutes.indexOf(location.pathname) === -1;

    // Toggle subscription form
    const subscInputRef = useRef();
    const subscTogglerRef = useRef();
    const [subscFormVisible, setSubscFormVisible] = useState(false);
    const [email, setEmail] = useState('');
    const toggleSubscriptionForm = () => {
        if (!isValidEmail(email)) {
            return toast({
                message: <><WarningCircle size={22} weight='fill' className='me-1 opacity-50' /> Enter a valid email address to continue</>,
                type: 'gray-700'
            });
        }
        subscInputRef.current.blur();
        setSubscFormVisible(true);
    };
    const clearSubscriptionEmail = () => {
        setEmail('');
    };

    const [dontCloseCard, setDontCloseCard] = useState([]);

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
            {canRenderContactUs &&
                <section className='px-3 py-5 position-relative inx-1 peak-borders-t footerContact'>
                    <div className="container">
                        <div className="d-md-flex justify-content-between send">
                            <div className="text text-gray-700">
                                <h2 className="h1">Do You Need Help With Anything?</h2>
                                <p>
                                    We will addres any questions you may have for greater clarity
                                </p>
                            </div>
                            <button className='btn btn-lg d-block mx-auto me-md-0 px-4 py-3 border-0 bg-light clip-path-tl-br-corner align-self-center'><a href={contactUsLink} className='text-decoration-none text-nowrap ms-3'>Contact Us Today</a></button>
                        </div>
                    </div>
                </section>
            }

            <footer className='pt-5'>
                <div className="d-lg-flex container">
                    <div className="between-5 boxmb-lg-5 box">
                        <div className="logo">
                            <img src="/images/logo.jpg" alt="" className='mb-3 rounded' />
                            <h3 className="h2">
                                Subscribe to our newsletter
                            </h3>
                            <p className='text-white2 small'>
                                Subscribe to receive updates, hot deals, tutorials, discounts sent straight in your inbox
                            </p>
                            <div className='col-12 col-md-8 col-lg-12 d-flex flex-column flex-md-row subscriber'>
                                <input ref={subscInputRef} type="email" name="subscriber_email" id="subscriberEmail" placeholder='Email address' className='border-0 px-3 flex-grow-1' value={email} onChange={(e) => { setEmail(e.target.value) }} onKeyUp={(e) => { (e.key === "Enter") && toggleSubscriptionForm() }} />
                                <button type="button" className='btn bg-primaryColor ms-md-auto py-2 text-dark fw-light rad-0 bounceClick' ref={subscTogglerRef} onClick={toggleSubscriptionForm}>Subscribe</button>
                            </div>
                            <BottomFixedCard
                                show={subscFormVisible}
                                content={[
                                    <SubscriptionForm
                                        email={email}
                                        onClose={() => { clearSubscriptionEmail(); setSubscFormVisible(false); }}
                                        setDontCloseCard={setDontCloseCard}
                                    />
                                ]}
                                toggler={subscTogglerRef}
                                onClose={() => setSubscFormVisible(false)}
                                avoidCloseReasons={dontCloseCard}
                                className="pb-4"
                            />
                        </div>
                    </div>
                    <div className='col-lg-7 d-sm-flex flex-wrap justify-content-between justify-content-lg-around px-md-4'>
                        {footer.map((val, index) => {
                            return (
                                <div key={index} className="col-12 col-sm-5 col-md-3 px-4 px-sm-0 py-4 box">
                                    <h4 className='h5 text-nowrap'>{val.title}</h4>
                                    <ul className='list-unstyled small text-white2'>
                                        {val.list.map((items, index) => (
                                            <li key={index} className="my-3"><a href={items.path} data-discover="true" className='text-decoration-none text-white2'>{items.text}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </footer>
            <div className="px-3 py-4 legal">
                <SocialMediaIcons />
                <div className='flex-center flex-wrap column-gap-2 align-items-center w-fit mx-auto fs-80 text-white2'>
                    <div className='mb-1 mb-sm-0'>
                        <i className='far fa-copyright'></i> {new Date().getFullYear()} SamRealEstate
                    </div>
                    <div>
                        <Code weight='bold' size={20} className='mb-1' /> Powered by <a
                            href={developerWebsiteLink} target='_blank' rel='noreferrer'
                            className='text-decoration-none text-white2'> HirwaSofts</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;
