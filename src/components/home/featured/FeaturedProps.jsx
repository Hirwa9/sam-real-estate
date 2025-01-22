import React from 'react';
import Heading from '../../common/Heading';
import PropertyCard from '../../common/PropertyCard';

const FeaturedProps = () => {
    return (
        <>
            <section>
                <div className="container">
                    <Heading
                        title="Our Featured Listing"
                        subtitle="Discover our top-tier featured properties. Stay ahead with the most desirable listings and receive expert support to make well-informed decisions, all backed by comprehensive details. Keep an eye on these prime opportunities before they're gone"
                        hType="h2"
                    />
                    <PropertyCard filterOption="featured" />
                </div>
            </section>
        </>
    );
}

export default FeaturedProps;
