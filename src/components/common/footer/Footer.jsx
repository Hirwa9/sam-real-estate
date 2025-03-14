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
import { useSettings } from '../../SettingsProvider';

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

    const {
        businessProfileSettings,
        loadingBusinessProfileSettings,
        errorLoadingBusinessProfileSettings,
    } = useSettings();

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
            <svg id="wave" style={{ transform: "rotate(0deg)", translate: '0 1px', transition: "0.3s" }} viewBox="0 0 1440 140" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(28, 38, 54, 1)" offset="0%"></stop><stop stop-color="rgb(28, 38, 54)" offset="100%"></stop></linearGradient></defs><path style={{ transform: "translate(0, 0px)", opacity: 1 }} fill="url(#sw-gradient-0)" d="M0,14L96,28L192,0L288,112L384,126L480,70L576,98L672,14L768,84L864,126L960,42L1056,28L1152,84L1248,56L1344,70L1440,112L1536,42L1632,126L1728,70L1824,126L1920,98L2016,70L2112,98L2208,84L2304,14L2304,140L2208,140L2112,140L2016,140L1920,140L1824,140L1728,140L1632,140L1536,140L1440,140L1344,140L1248,140L1152,140L1056,140L960,140L864,140L768,140L672,140L576,140L480,140L384,140L288,140L192,140L96,140L0,140Z"></path><defs><linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(28, 38, 54, 1)" offset="0%"></stop><stop stop-color="rgba(28, 38, 54, 1)" offset="100%"></stop></linearGradient></defs><path style={{ transform: "translate(0, 50px)", opacity: 0.9 }} fill="url(#sw-gradient-1)" d="M0,14L96,56L192,0L288,0L384,42L480,112L576,112L672,28L768,70L864,0L960,14L1056,28L1152,28L1248,84L1344,0L1440,70L1536,84L1632,112L1728,84L1824,112L1920,28L2016,14L2112,84L2208,28L2304,56L2304,140L2208,140L2112,140L2016,140L1920,140L1824,140L1728,140L1632,140L1536,140L1440,140L1344,140L1248,140L1152,140L1056,140L960,140L864,140L768,140L672,140L576,140L480,140L384,140L288,140L192,140L96,140L0,140Z"></path></svg>

            {canRenderContactUs &&
                <section className='px-3 pb-4 position-relative inx-1 footerContact' style={{ paddingTop: '5rem' }}>
                    <div className="container">
                        <div className="d-md-flex justify-content-between send">
                            <div className="text">
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
                        <div>
                            <div>
                                {!loadingBusinessProfileSettings && !errorLoadingBusinessProfileSettings && businessProfileSettings && (
                                    <div className="d-flex gap-2">
                                        <img src="/images/logo.webp" alt="" className='mb-3 logo' />
                                        <div className="m-0">
                                            <p className='mb-0 fs-4 text-primaryColor'>{businessProfileSettings?.businessName}</p>
                                            <p className=' fs-70'>{businessProfileSettings?.motto}</p>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h3 className="h2">
                                        Subscribe to our newsletter
                                    </h3>
                                    <p className='text-white2 small'>
                                        Subscribe to receive updates, hot deals, tutorials, discounts sent straight in your inbox
                                    </p>
                                </div>
                            </div>
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
                                <div key={index} className="col-12 col-sm-5 col-md-3 px-4 px-sm-0 py-4 pt-lg-0 box">
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
            <div className="px-3 py-4 pt-lg-5 legal">
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
