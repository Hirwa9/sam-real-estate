import React from 'react';
import Heading from './Heading';
import ReviewCard from './ReviewCard';

const Reviews = () => {
    return (
        <>
            <section className="p-3 review" id='reviews'>
                <Heading
                    title="Visitor Reviews"
                    subtitle="Explore reviews from site users. See their feedback on our services and how we can better assist"
                    hType="h6"
                    className="mb-0"
                />
                <ReviewCard />
            </section>
        </>
    )
}

export default Reviews;
