import React, { useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import "./header.css";
import {
    Link,
    useLocation,
} from "react-router-dom";
import { AuthenticationContext } from "../../../App";
import { nav } from "../../data/Data";
import logo from "../../../components/images/logo.jpg";
import SocialMediaIcons from '../SocialMediaIcons';
import { ArrowsLeftRight, CaretRight, City, Code, ListStar, User } from "@phosphor-icons/react";
import BottomFixedCard from "../bottomFixedCard/BottomFixedCard";
import ReviewForm from "../reviewForm/ReviewForm";
import CompareProperties from "../compareProperties/CompareProperties";
/* globals $ */

const Header = () => {
    // Auth check
    const { isLoggedIn, checkAuthentication } = useContext(AuthenticationContext);
    useEffect(() => {
        !isLoggedIn && checkAuthentication();
    }, [isLoggedIn, checkAuthentication]);

    /**
     * Small device navbar
     */

    const smNavbarRef = useRef();
    const smNavbarTogglerRef = useRef();

    const [navList, setNavList] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [isSmNavCollapsed, setIsSmNavCollapsed] = useState(true);

    // Hide navbar
    const hideSmNavbar = useCallback(() => {
        if (!isSmNavCollapsed) {
            smNavbarRef.current.classList.add('slideOutL');
            setTimeout(() => {
                setIsSmNavCollapsed(true); // Close navbar
                smNavbarRef.current.classList.remove('slideOutL');
            }, 400);
        }
    }, [isSmNavCollapsed]);

    // Handle clicks outside the navbar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (smNavbarRef.current && smNavbarTogglerRef.current) {
                if (
                    !smNavbarRef.current.contains(e.target) &&
                    !smNavbarTogglerRef.current.contains(e.target)
                ) {
                    hideSmNavbar(); // Attempt to hide navbar
                }
            }
        };

        // Attach "click outside" event listener
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside); // Clean up
        };
    }, [hideSmNavbar]);

    const reviewAdderTogglerRef = useRef();
    const [clientAddReview, setClientAddReview] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(false);
    const [dontCloseCard, setDontCloseCard] = useState([]);

    useEffect(() => {
        if (refreshReviews) {
            console.log('Added a review');
            setRefreshReviews(false);
        }
    }, [refreshReviews]);

    // Toggle header visibility
    var initialScrollY = window.scrollY;
    document.addEventListener('scroll', function () {
        var finalScrollY = window.scrollY;
        if (finalScrollY > initialScrollY + 41.6) {
            setHeaderVisible(false);
        } else if (finalScrollY < initialScrollY) {
            setHeaderVisible(true);
        }
        initialScrollY = finalScrollY; // Reset/equalize positions
    });

    /**
     * Active path
     */

    let location = useLocation();
    const [isPending, startTransition] = useTransition();
    const [activeHeaderLink, setActiveHeaderLink] = useState(location.pathname);

    // Update active link when location changes
    useEffect(() => {
        startTransition(() => {
            setActiveHeaderLink(location.pathname);
        });
    }, [location.pathname, startTransition]);

    // Property comparing
    const [showPropCompare, setShowPropCompare] = useState(false);

    return (
        <>
            {/* Loading indicator */}
            {isPending &&
                <span className="page-loader inx-max ptr-none"></span>
            }

            <header className={headerVisible === true ? "" : "dom-scrolling-down"}>
                <nav className="navbar navbar-expand-md px-2">
                    <div className="logo me-5">
                        <img src={logo} alt="logo" className="rounded-circle logo"></img>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {nav.map((list, index) => {
                                return (
                                    <li key={index} className={`nav-item px-2 py-1 ${activeHeaderLink === list.path ? "active" : ""} ${((activeHeaderLink.includes('property/') || activeHeaderLink.includes('properties/')) && list.path.includes('properties/')) ? 'active' : ''} text-uppercase small`}
                                        onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); }}>
                                        <Link to={list.path}>{list.text}</Link>
                                        {list.subLinks && (
                                            <ul className="dropdown-menu py-4 shadow">
                                                {list.subLinks.map((subLink, subIndex) => (
                                                    <li key={subIndex} className="d-flex align-items-center fw-light small">
                                                        <Link to={subLink.path} className="dropdown-item text-black2">
                                                            <CaretRight className='me-1' />
                                                            {subLink.text}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="nav navbar-nav navbar-end ms-auto align-items-center">
                            <li className={`nav-item px-2 py-1 text-gray-700 ptr clickDown`} title="Comparison" onClick={() => setShowPropCompare(true)}>
                                <ArrowsLeftRight size={23} />
                            </li>
                            {isLoggedIn ? (
                                <h6 className="m-0">
                                    <span className="mb-1 small" style={{ fontSize: "70%" }}>My List</span>
                                    <span className="badge w-fit ms-2 p-1 border border-opacity-50 border-success text-success">2</span>
                                </h6>
                            ) : (
                                <li className={`nav-item px-2 py-1 ${activeHeaderLink === '/login' ? "active" : ""} text-uppercase small`} >
                                    <Link to="/login">Sign in</Link>
                                </li>
                            )}
                        </div>
                    </div>
                    <div ref={smNavbarTogglerRef} className="d-md-none toggle" onClick={() => setIsSmNavCollapsed(false)}>
                        {/* <div ref={smNavbarTogglerRef} className="d-md-none toggle"> */}
                        <button className="btn text-gray-600 border shadow" title="Menu" onClick={() => setNavList(!navList)}>
                            <City size={25} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Small screen navbar */}
            {!isSmNavCollapsed &&
                <div className={`position-fixed fixed-top inset-0 inx-max small d-md-none`}>
                    <div ref={smNavbarRef} className="position-relative d-flex h-100 inx-inherit smNavbar-wrapper">
                        {/* <div ref={smNavbarRef} className="position-relative d-flex inx-inherit smNavbar-wrapper"> */}
                        {/* Nav */}
                        <div className="d-flex flex-column h-100 w-100 pb-2 inx-inherit" id='smNavbar'>
                            <div className="inx-inherit d-flex align-items-center mb-4 p-3 pb-4 peak-borders-b bg-primaryColor smNavbar-header">
                                <div className="logo me-auto">
                                    <img src={logo} alt="logo" className="rounded-circle logo"></img>
                                </div>
                                <a href="/login" className="flex-center w-2rem ratio-1-1 border border-dark border-opacity-50 text-dark rounded-circle"> <User size={20} /></a>
                                <button className="btn d-block ms-auto ratio-1-1 bounceClick w-2_5rem border-0 clickDown closerX closerX-black2" onClick={() => hideSmNavbar()} style={{ scale: "0.8" }}>
                                </button>
                            </div>
                            <ul className="list-unstyled mb-0 nav-links">
                                {nav.map((list, index) => {
                                    return (
                                        <li key={index} className={`nav-item px-3 h-3rem text-uppercase ${activeHeaderLink === list.path ? "active" : ""} ${((activeHeaderLink.includes('property/') || activeHeaderLink.includes('properties/')) && list.path.includes('properties/')) ? 'active' : ''}`}
                                            onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); hideSmNavbar() }}>
                                            <Link to={list.path}>{list.text}</Link>
                                        </li>
                                    )
                                })}
                            </ul>
                            <hr className="col-8 ms-3 my-3 border-white2" />
                            <ul className="list-unstyled nav-links mb-5">
                                <li className={`nav-item ${activeHeaderLink === '/FAQs' ? "active" : ""} px-3 h-2_5rem text-uppercase`} onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); hideSmNavbar() }}>
                                    <Link to={'/FAQs'}>Faqs</Link>
                                </li>
                                <li className={`nav-item ${activeHeaderLink === '/terms' ? "active" : ""} px-3 h-2_5rem text-uppercase`} onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); hideSmNavbar() }}>
                                    <Link to={'/terms'}>Terms</Link>
                                </li>
                                <li className={`nav-item ${activeHeaderLink === '/login' ? "active" : ""} px-3 h-2_5rem text-uppercase mt-4 clickDown`} onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); hideSmNavbar() }}>
                                    <Link to={'/login'} className="btn btn-sm bg-gray-700 text-gray-400 bg-opacity-25 border-0 flex-center py-3 clip-path-tl-br-corner">Login</Link>
                                </li>
                            </ul>

                            <div className="mt-auto ">
                                <SocialMediaIcons />
                                <div className="p-3 text-gray-600 fw-light small">
                                    <i className='far fa-copyright'></i> {new Date().getFullYear()} <span className="fw-bold"> samrealtol</span>. All rights reserved. <br />
                                    <Code weight='light' size={18} className='mb-1' /> Powered by <a href="https://hirwa9.github.io/" className="text-gray-600 fw-bold" target='_blank' rel='noreferrer'>HirwaSofts</a>.
                                </div>
                            </div>
                        </div>

                        {/* Floating nav icons */}
                        <div className="r-middle d-grid gap-2 inx-inherit" style={{ translate: '30% 0' }}>
                            <div className="p-2 bg-gray-900 text-gray-300 border border-2 border-secondary border-opacity-25 rounded-circle ptr bounceClick" title="Compare properties"
                                onClick={() => { hideSmNavbar(); setShowPropCompare(true) }}
                            >
                                <ArrowsLeftRight size={23} />
                            </div>
                            <div ref={reviewAdderTogglerRef} className="p-2 bg-gray-900 text-gray-300 border border-2 border-secondary border-opacity-25 rounded-circle ptr bounceClick" title="Add a review"
                                onClick={() => { hideSmNavbar(); setClientAddReview(true) }}
                            >
                                <ListStar size={23} />
                            </div>
                            {/* <div className="p-2 bg-gray-900 text-gray-300 border border-2 border-secondary border-opacity-25 rounded-circle ptr bounceClick" title="Notifications">
                                <BellRinging size={23} />
                            </div> */}
                        </div>

                    </div>
                </div>
            }

            {/* Tooglable components */}

            {/* Review adding form */}
            {
                <BottomFixedCard
                    show={clientAddReview}
                    content={[
                        <ReviewForm
                            setRefreshReviews={setRefreshReviews}
                            setDontCloseCard={setDontCloseCard}
                            onClose={() => setClientAddReview(false)}
                        />
                    ]}
                    toggler={reviewAdderTogglerRef}
                    closeButton
                    onClose={() => { setClientAddReview(false); setIsSmNavCollapsed(false); }}
                    className="pb-3"
                    avoidCloseReasons={dontCloseCard}
                />
            }

            {/* Property comparison */}
            <CompareProperties show={showPropCompare} onClose={() => setShowPropCompare(false)} />
        </>
    );
}

export default Header;