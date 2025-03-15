import React, { useEffect, useRef, useState } from "react";
// Informative components
import Hero from "./hero/Hero";
import FeaturedTypes from "./featured/FeaturedTypes";
import Recent from "./recent/Recent";
import Awards from "./awards/Awards";
import Location from "./location/Location";
import Team from "./team/Team";

// Tools
import FixedActionButtons from "../common/fixedActionButtons/FixedActionButtons";
import BottomFixedCard from "../common/bottomFixedCard/BottomFixedCard";
import PropertySearcher from "../common/PropertySearcher";
import { CaretDoubleUp, MagnifyingGlass, WhatsappLogo } from "@phosphor-icons/react";
import WhatsAppContactor from "../common/whatsAppContactor/WhatsAppContactor";
import FeaturedProps from "./featured/FeaturedProps";

const Home = () => {

    const propertySearcherTogglerRef = useRef();
    const whatsappTogglerRef = useRef();
    const [showPropertySearcher, setShowPropertySearcher] = useState(false);
    const [showScrollTopIcon, setShowScrollTopIcon] = useState(false);
    const [showWhatsAppContactor, setShowWhatsAppContactor] = useState(false);

    // Toggle showScrollTopIcon visibility
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > (window.outerHeight * 2)) {
                setShowScrollTopIcon(true);
            } else {
                setShowScrollTopIcon(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Hero />
            <FeaturedTypes />
            <FeaturedProps />
            <Recent />
            <Awards />
            <Location />
            <Team />
            {/* <Price /> */}

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
                        {
                            icon: <CaretDoubleUp size={40} fill='var(--black2)' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' />,
                            title: "Back to top",
                            visible: showScrollTopIcon ? true : false
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
                className="pb-3"
            />
            {/* WhatsApp contactor */}
            <WhatsAppContactor show={showWhatsAppContactor} toggler={whatsappTogglerRef} onClose={() => setShowWhatsAppContactor(false)} />
        </>
    );
}

export default Home;