import React from 'react';
import Heading from '../../common/Heading';
import PropertyCard from '../../common/PropertyCard';

const FeaturedProps = () => {
    return (
        <>
            <section className='p-2 p-md-3'>
                <div className="px-0 container-fluid">
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
