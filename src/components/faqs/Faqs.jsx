import React from 'react';
import './faqs.css';
import PageInfo from '../common/header/PageInfo';
import img from '../images/real_estate_image.webp';
import { faqs } from '../data/Data';
import { PushPinSimple } from '@phosphor-icons/react';
import Heading from '../common/Heading';

const Faqs = () => {
    return (
        <>
            <section className='mb-4 faqs'>
                <PageInfo name="FAQs" title="FAQs - Read About the Real Estate " cover={img} className="mb-0" />
                <div className="container-fluid">
                    <Heading
                        title="Frequently Asked Questions"
                        subtitle="Welcome to our Real Estate FAQs section, where we address the most common inquiries related to property buying, selling, and renting. Whether you're a first-time buyer or a seasoned investor, we aim to provide clear and concise answers to help you make informed decisions."
                        hType="h2"
                    />
                </div>

                {/* Service - Real Estate Faqs */}
                <div id='questionsAnswers'>
                    <div className="mb-5 pb-5 bg-bodi section-top">
                        <div className='row mx-0 mx-lg-auto container-lg'>
                            {faqs.map((category, index) => {
                                const { title, type } = category;
                                const len = category.content.length;
                                return (
                                    <a key={index} href={`#${type}`} className="col-6 col-md-4 col-lg-3 mb-4 px-1 px-sm-2 text-decoration-none">
                                        <div className='h-100 d-flex flex-column border border-2 border-dark border-opacity-25 rad-10 px-3 py-4 text-muted overflow-hidden'>
                                            <h2 className="h6 d-flex fw-bold">
                                                <PushPinSimple size={18} weight='fill' className='me-2 d-none d-sm-inline flex-shrink-0' /> {title}
                                            </h2>
                                            <div className='mt-auto small'>{len} topics</div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className='py-5 bg-bodi section-bottom'>
                        <div className='container-fluid container-lg'>
                            {faqs.map((faq, index1) => {
                                const { title, content, type } = faq;
                                return (
                                    <div key={index1} className='border-bottom border-3 py-3 mb-5' id={`${type}`}>
                                        <h3 className="fs-2 mb-5 px-2 px-sm-3 text-muted d-flex fw-bold">
                                            {title}
                                        </h3>
                                        <div className='d-md-flex flex-wrap px-2 px-sm-3'>
                                            {content.map((text, index2) => {
                                                const { question, answer } = text;
                                                return (
                                                    <div key={index2} className="col-md-6 col-xl-4  mb-4">
                                                        <div className="w-fit d-flex fw-bold mb-3 pe-2 ptr">
                                                            <span className='fa fa-question me-3 mt-1 text-black1'></span>
                                                            {question}
                                                        </div>
                                                        <div className='flex-shrink-0 flex-grow-1 ms-1 px-3 small border-start border-dark border-opacity-50 text-justify'
                                                            id={`qa-${type + index2}`}>
                                                            {answer}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Faqs;
