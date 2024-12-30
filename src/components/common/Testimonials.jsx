import React from 'react';
import TestimonialCard from './TestimonialCard';
import './testimonial.css';
import Heading from './Heading';
import ReviewCard from './ReviewCard';

const Testimonials = () => {
    return (
        <>
            <section className="p-3 testimonial" id='testimonials'>
                <Heading
                    title="What Our Customers Say"
                    subtitle="Read testimonials from our registered clients. Discover why they trust us for their real estate needs"
                    hType="h6"
                    className="mb-0"
                />
                <TestimonialCard />
            </section>
        </>
    )
}

export default Testimonials;
