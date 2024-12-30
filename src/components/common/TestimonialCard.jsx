import React from 'react';
import { testimonials } from '../data/Data';
import './testimonial.css';
import { Quotes, Star } from '@phosphor-icons/react';

const TestimonialCard = () => {
    return (
        <div className="container d-flex align-items-center justify-content-around gap-5 px-4 px-md-4 box-container">
            {testimonials.map((val, index) => {
                const { cover, name, clientType, text } = val;
                return (
                    <div key={index} className='position-relative col-sm-9 col-md-6 col-lg-5 col-xl-4 p-3 p-sm-4 rad-10 box'>
                        <h5 className='mb-3 text-grey type'>{clientType}</h5>
                        <p className=' text-muted'>{text}</p>
                        <div className='d-flex gap-2 gap-md-3 mt-4 text-grey  mb-3'>
                            <Star weight='fill' fill='var(--black2)' />
                            <Star weight='fill' fill='var(--black2)' />
                            <Star weight='fill' fill='var(--black2)' />
                            <Star weight='fill' fill='var(--black2)' />
                            <Star weight='fill' fill='var(--black2)' />
                        </div>
                        <h5 className='h6 title text-gray-700 text-uppercase'>{name}</h5>
                        <img src={cover} alt="" className='position-absolute object-fit-cover object-position-center rounded-circle wavy-circle' />
                        <span className='position-absolute flex-center design design-top top-0'>
                            <Quotes size={35} weight='fill' />
                        </span>
                        <span className='position-absolute flex-center design design-bottom bottom-0'>
                            <Quotes size={35} weight='fill' />
                        </span>
                    </div>
                );
            })}
        </div>
    )
}

export default TestimonialCard;
