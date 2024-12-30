import React, { useRef, useState } from 'react';
import Back from '../common/header/Back';
import img from '../images/about.jpeg';
// import Heading from '../common/Heading';

import './about.css';
import Team from '../home/team/Team';
import Testimonials from '../common/Testimonials';
import FixedActionButtons from '../common/fixedActionButtons/FixedActionButtons';
import BottomFixedCard from '../common/bottomFixedCard/BottomFixedCard';
import PropertySearcher from '../common/PropertySearcher';
import { ArrowRight, MagnifyingGlass, WhatsappLogo } from '@phosphor-icons/react';
import Heading from '../common/Heading';
import WhatsAppContactor from '../common/whatsAppContactor/WhatsAppContactor';
import ContentListing from '../common/contentListing/ContentListing';
import Reviews from '../common/Reviews';

const About = () => {
    const propertySearcherTogglerRef = useRef();
    const whatsappTogglerRef = useRef();
    const [showPropertySearcher, setShowPropertySearcher] = useState(false);
    const [showWhatsAppContactor, setShowWhatsAppContactor] = useState(false);


    return (
        <>
            <section className='about'>
                <Back name="About Us" title="About Us - Who We Are" cover={img} />
                <div className="d-lg-flex my-4 container">
                    <div className='col-lg-6 mb-4 mb-lg-0'>
                        <Heading
                            title="Our Agency Story"
                            subtitle="Check out our company story and work process."
                            hType="h2"
                            className="mt-0 mb-0"
                        />
                        <p className='pe-lg-4'>
                            Discover the story behind our agency and our commitment to delivering exceptional real estate services in Kigali and more different places in Rwanda.
                        </p>
                        <p className='pe-lg-4'>
                            We believe in transparency, professionalism, and a client-centered approach, guiding you through every step of the property journey. We are dedicated to making property ownership, rentals, and investment simple and accessible.
                        </p>
                        <p className='pe-lg-4'>With a deep understanding of the real estate market, we provide expert insights and personalized support, ensuring you find the perfect space to suit your needs. <br />

                            Explore our services and see how we're building trust, one property at a time.
                        </p>
                        <a href="/services" className="btn btn-outline-dark border-0 flex-center w-fit mx-auto mb-3 px-5 py-2 rounded-pill small shadow">
                            Our Services <ArrowRight className='ms-1' />
                        </a>
                    </div>
                    <div className='col-lg-6'>
                        <img src="/images/real_estate_illustration.jpg" alt="" className='h-100 object-fit-cover peak-borders-lr' style={{ objectPosition: "20% center" }} />
                    </div>
                </div>
            </section>

            <section>
                <div className='container-fluid px-xl-5 d-lg-flex justify-content-center clip-text-gradient'>
                    <div className="col-lg-6 mb-4 px-0 px-sm-2">
                        <ContentListing
                            title="Our Mission"
                            content="Our mission is to redefine the real estate experience in Kigali by putting our clients' needs first. We aim to make property transactions straightforward and stress-free, providing reliable guidance and support at every stage. Whether you're looking to buy, sell, or rent, our team is committed to helping you make informed decisions with confidence and ease."
                            icon="flag"
                            className="h-100 border-start border-end border-1 rad-0 text-justify"
                        />
                    </div>
                    <div className="col-lg-6 mb-4 px-0 px-sm-2">
                        <ContentListing
                            title="Our Vision"
                            content="Our vision is to be Kigali's most trusted real estate agency, known for excellence, integrity, and community focus. We strive to build long-lasting relationships with our clients and contribute positively to the city's growth. By setting the standard for customer service and innovation, we aim to inspire and empower individuals to achieve their real estate dreams."
                            icon="compass"
                            className="h-100 border-start border-end border-1 rad-0 text-justify"
                        />
                    </div>
                </div>
            </section>

            {/* Team member(s) */}
            <Team id="ourTeam" />

            {/* Testimonials */}
            <Testimonials />

            {/* Reviews */}
            <Reviews />

            {/* Fixed icons */}
            <FixedActionButtons
                icons={
                    [
                        {
                            icon: <MagnifyingGlass size={45} fill='var(--black2)' ref={propertySearcherTogglerRef} className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' onClick={() => setShowPropertySearcher(true)}
                            />,
                            title: "Search properties",
                            visible: true
                        },
                        {
                            icon: <WhatsappLogo size={45} weight='light' fill='var(--bs-light)' ref={whatsappTogglerRef} className='rounded-4 p-2 bg-success border border-2 border-success ptr shadow-sm' onClick={() => setShowWhatsAppContactor(true)}
                            />,
                            title: "Let's chat",
                            visible: true
                        },
                    ]
                }
            />

            {/* Property searcher card */}
            <BottomFixedCard
                show={showPropertySearcher}
                content={[
                    <PropertySearcher iconed callback={() => setShowPropertySearcher(false)} />
                ]}
                toggler={propertySearcherTogglerRef}
                blurBg
                onClose={() => setShowPropertySearcher(false)}
                className="pb-3" />
            {/* WhatsApp contactor */}
            <WhatsAppContactor show={showWhatsAppContactor} toggler={whatsappTogglerRef} onClose={() => setShowWhatsAppContactor(false)} />
        </>
    )
}

export default About;
