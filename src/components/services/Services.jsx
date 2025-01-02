import React, { useRef, useState } from 'react';
import './services.css'
import PageInfo from '../common/header/PageInfo';
import img from '../images/services.jpg';
import Heading from '../common/Heading';
import FeaturedTypesCard from '../home/featured/FeaturedTypesCard';
import ContentListing from '../common/contentListing/ContentListing';
import BottomFixedCard from '../common/bottomFixedCard/BottomFixedCard';
import PropertySearcher from '../common/PropertySearcher';
import FixedActionButtons from '../common/fixedActionButtons/FixedActionButtons';
import { MagnifyingGlass, WhatsappLogo } from '@phosphor-icons/react';
import WhatsAppContactor from '../common/whatsAppContactor/WhatsAppContactor';

const Services = () => {
    const propertySearcherTogglerRef = useRef();
    const whatsappTogglerRef = useRef();
    const [showPropertySearcher, setShowPropertySearcher] = useState(false);
    const [showWhatsAppContactor, setShowWhatsAppContactor] = useState(false);

    return (
        <>
            <section className='mb-4 services'>
                <PageInfo name="Our Services" title="Services - Find Your Dream Home With Us" cover={img} className="mb-0" />
                {/* Service - Real Estate Listings */}
                <div className="mb-5 container-fluid featured ">
                    <Heading
                        title="Real Estate Listings"
                        subtitle="Explore a wide range of properties, from luxurious estates to affordable homes. Our detailed listings provide high-quality photos, property descriptions, and essential information to help you make informed decisions"
                        hType="h2"
                    />
                    <FeaturedTypesCard />
                    <h3 className="h5 text-center mb-4 fw-bold">Services provided</h3>
                    <div className="row mx-0 justify-content-lg-evenly">
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Residential, Office & Commercial Properties"
                                content="Explore a variety of properties tailored to meet your needs, whether you're looking for a family home, office space, or commercial property. We offer a broad range of options to suit all budgets and preferences, ensuring you find the perfect space for living, working, or business expansion. Our team will guide you through every step, providing detailed insights to help you make informed decisions."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Apartment Rentals & Sales"
                                content="Whether you're looking to rent or buy an apartment, we offer a curated selection of modern, well-located apartments to fit your lifestyle. From luxury penthouses to cozy studio apartments, we make the process of finding your next home seamless and enjoyable, with expert guidance to assist in every step from viewings to finalizing contracts."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Land and Lot Listings"
                                content="Looking for land to build your dream home or invest in commercial projects? We provide exclusive listings of available plots of land and lots, from residential sites to prime commercial locations. With our extensive knowledge of the market, we help you navigate zoning laws and property regulations, ensuring a smooth transaction."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                    </div>
                </div>

                {/* Service - Home Valuation */}
                <div className="mb-5 container-fluid">
                    <Heading
                        title="Home Valuation"
                        subtitle="Know the Value of Your Home Get a free, no-obligation home valuation today. Our experienced real estate professionals will provide you with an accurate market assessment, helping you make the best decision whether buying or selling"
                        hType="h2"
                    />
                    <h3 className="h5 text-center mb-4 fw-bold">Services provided</h3>
                    <div className="row mx-0 justify-content-lg-evenly">
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Comparative Market Analysis (CMA)"
                                content="Curious about the market value of your property? Our Comparative Market Analysis service offers a detailed evaluation of your property's worth based on recent sales, local market trends, and property conditions. This essential service helps you make smart decisions, whether you're buying, selling, or investing in real estate."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="In-Depth Property Reports"
                                content="Our In-Depth Property Reports provide comprehensive insights into the properties you are interested in. We gather detailed information on property history, market trends, neighborhood development, and potential investment returns. Whether you're a buyer or investor, these reports give you a competitive edge in making informed decisions."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Price Trend Insights"
                                content="Stay ahead of the curve with our Price Trend Insights. We analyze the latest market trends to help you understand the price fluctuations in your area of interest. By keeping you informed about real estate market movements, we empower you to make timely and strategic decisions on buying or selling property."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                    </div>
                </div>

                {/* Service - Virtual Tours */}
                <div className="mb-5 container-fluid">
                    <Heading
                        title="Virtual Tours"
                        subtitle="Experience Properties from Anywhere We offer virtual tours of properties, allowing you to explore homes from the comfort of your own space. See every detail and layout before deciding to visit in person"
                        hType="h2"
                    />
                    <h3 className="h5 text-center mb-4 fw-bold">Services provided</h3>
                    <div className="row mx-0 justify-content-lg-evenly">
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Gallery Walkthroughs"
                                content="Experience properties like never before with our immersive Gallery Walkthroughs. We provide high-resolution photo galleries of each property, showcasing every detail from room layouts to finishes. This virtual experience allows you to explore multiple properties from the comfort of your home, giving you a comprehensive understanding of what each space has to offer."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Video Footage for Larger Properties"
                                content="For larger properties, our service includes professional video footage that highlights the scale and beauty of the space. These video tours offer a dynamic and in-depth view of the property's layout, key features, and surroundings, making it easier for you to visualize the full potential of the estate."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 mb-4 px-0 px-sm-2">
                            <ContentListing
                                title="Location Map View"
                                content="Discover properties with pinpoint accuracy through our Location Map View feature. Each listing includes an interactive map showcasing the exact GPS location of the property. Navigate the surrounding areas, explore nearby amenities, and get a clear understanding of the property's neighborhood—all from an embedded, user-friendly map interface."
                                icon="tag"
                                className="h-100 border-start border-end border-1 rad-0 small-content"
                            />
                        </div>
                    </div>
                </div>
            </section>

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
                onClose={() => setShowPropertySearcher(false)}
                className="pb-3"
            />
            {/* WhatsApp contactor */}
            <WhatsAppContactor show={showWhatsAppContactor} toggler={whatsappTogglerRef} onClose={() => setShowWhatsAppContactor(false)} />
        </>
    )
}

export default Services;
