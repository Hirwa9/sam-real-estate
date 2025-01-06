import React, { useEffect, useRef, useState } from 'react';
import './terms.css';
import PageInfo from '../common/header/PageInfo';
import img from '../images/real_estate_image.webp';
import Heading from '../common/Heading';
import { companyName } from '../data/Data';
import { companyEmail } from '../data/Data';
import FixedActionButtons from '../common/fixedActionButtons/FixedActionButtons';
import { CaretDoubleUp, WhatsappLogo } from '@phosphor-icons/react';
import WhatsAppContactor from '../common/whatsAppContactor/WhatsAppContactor';

const Terms = () => {
    const [showScrollTopIcon, setShowScrollTopIcon] = useState(false);
    const [showWhatsAppContactor, setShowWhatsAppContactor] = useState(false);
    const whatsappTogglerRef = useRef();

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
            <div className='mb-4 terms'>
                <PageInfo name="Terms" title="Terms of Use" cover={img} className="mb-0" />
                <div className="container-fluid">
                    <Heading
                        title="Sam Real Estate Terms of Use"
                        subtitle={
                            <>
                                <span className='fs-4'>October 09, 2024</span> <br />
                                By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
                            </>
                        }
                        hType="h2"
                    />
                </div>
                <div className="container">
                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Company's Role
                        </h2>
                        <p className='mb-4'>
                            <b>{companyName}</b> provides an online platform for listing, viewing, and exploring real estate properties. We facilitate connections between property owners, buyers, renters, and other stakeholders, but we do not directly own, sell, or manage any properties. We act as a service provider to assist users in finding the properties that suit their needs.
                        </p>
                        <div className='px-3'>
                            <h5>No Real Estate Broker Services</h5>
                            <p>
                                We do not provide real estate brokerage services, nor do we act as a buyer's or seller's agent. Our platform is informational and acts only as a tool to streamline your real estate process.
                            </p>
                            <h5>No Legal Advice</h5>
                            <p>
                                The information provided on our platform is for general informational purposes only and does not constitute legal advice. Please consult a licensed real estate professional or attorney for specific advice.
                            </p>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Eligibility; Accounts and Registration
                        </h2>
                        <div className='px-3'>
                            <h5>Age Requirement</h5>
                            <p>
                                To use our services, you must be at least 18 years old and have the legal capacity to enter into binding contracts. By creating an account, you confirm that you meet these criteria.
                            </p>
                            <h5>Account Creation</h5>
                            <p>
                                When registering for an account, you agree to provide accurate, current, and complete information. It is your responsibility to keep your account details secure. You are solely responsible for any activity that occurs under your account.
                            </p>
                            <h5>Account Suspension or Termination</h5>
                            <p>
                                We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in any unlawful activity on our platform.
                            </p>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Use of the Services; Restrictions
                        </h2>
                        <div className='px-3'>
                            <h5>Authorized Use</h5>
                            <p>
                                You are permitted to use the services provided by {companyName} for personal, non-commercial purposes, such as browsing properties or contacting sellers or agents.
                            </p>
                            <h5>Restrictions</h5>
                            <p>
                                You may not use the services to:.
                            </p>
                            <ul>
                                <li>Impersonate any person or entity, or misrepresent your affiliation with a person or entity.</li>
                                <li>Engage in fraudulent, unlawful, or harmful activities.</li>
                                <li>Collect or store personal data of others without their consent.</li>
                            </ul>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Prohibited Use. BY USING THE SERVICES, YOU AGREE NOT TO
                        </h2>
                        <div className='px-3'>
                            <ul>
                                <li>Use the platform for any illegal or unauthorized purpose.</li>
                                <li>Distribute viruses, malicious software, or other harmful technology.</li>
                                <li>Scrape, crawl, or use automated systems to extract data from our website.</li>
                                <li>Violate any applicable laws or regulations, including intellectual property rights.</li>
                            </ul>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            User Materials
                        </h2>
                        <p>
                            Any materials, comments, suggestions, or other submissions that you provide to us, including user-generated content, are considered non-confidential and non-proprietary. By submitting user materials, you grant us a worldwide, perpetual, irrevocable license to use, display, distribute, and create derivative works from such materials. <br /><br />
                            You agree that any content you submit will not:
                        </p>
                        <div className='px-3'>
                            <ul>
                                <li>Be defamatory, obscene, or offensive.</li>
                                <li>Infringe on the intellectual property rights of others.</li>
                                <li>Violate the rights of privacy or publicity of others.</li>
                            </ul>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Third Party/Linked Services/Sent Information
                        </h2>
                        <p>
                            Our website may contain links to third-party websites or services. We are not responsible for the content, accuracy, or opinions expressed on third-party platforms. Any interaction or transaction between you and third-party services is solely between you and the third party. {companyName} is not liable for any damages or losses arising from your use of third-party services
                        </p>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Intellectual Property
                        </h2>
                        <p>
                            All content, graphics, designs, and trademarks displayed on our website are the property of {companyName} or its licensors. You may not use, reproduce, or distribute any content from the platform without prior written permission. <br /><br />

                            The services, software, and materials made available by {companyName} are protected by copyright, trademark, and other intellectual property laws. Any unauthorized use may result in termination of your account and legal action.
                        </p>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Feedback
                        </h2>
                        <p>
                            We value your feedback and suggestions regarding our services. By submitting feedback, you grant us a royalty-free, perpetual license to use, modify, and implement your feedback without any obligation to compensate you.
                        </p>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Deactivation/Deletion /Changes to Agreement
                        </h2>
                        <div className='px-3'>
                            <h5>Account Deactivation or Deletion</h5>
                            <p>
                                You may deactivate or delete your account at any time by contacting us. Upon termination, your access to the platform will cease, but we may retain certain data for legal or business purposes.
                            </p>
                            <h5>Modifications to the Terms</h5>
                            <p>
                                We reserve the right to modify these terms at any time. Any updates to the terms will be posted on our website, and your continued use of the platform after the changes take effect constitutes your acceptance of the updated terms.
                            </p>
                        </div>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Privacy Policy/Other Terms
                        </h2>
                        <p>
                            Your use of our services is also governed by our [Privacy Policy], which explains how we collect, use, and protect your personal information. By using our services, you agree to the terms of our Privacy Policy.
                            <br /><br />
                            In addition to these Terms of Use, other terms may apply to certain services or features offered on the website. These additional terms will be made available where relevant, and by using those services, you agree to those additional terms.
                        </p>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Disclaimer of Warranties; Limitation of Liability
                        </h2>
                        <p>
                            Our platform and services are provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, reliability, or completeness of the information on the platform. We are not liable for any direct or indirect damages arising from your use of the services.
                        </p>
                    </section>
                    {/* --- */}

                    <section className='mb-5'>
                        <h2 className='mb-4 listing-title'>
                            Contact Information
                        </h2>
                        <p>
                            If you have any questions regarding these terms, feel free to contact us at <a href={`mailto:${companyEmail}`} target='_blank' rel="noreferrer">{companyEmail}</a>.
                        </p>
                    </section>
                    {/* --- */}
                </div>

                {/* Fixed icons */}
                <FixedActionButtons
                    icons={
                        [
                            {
                                icon: <WhatsappLogo size={45} weight='light' fill='var(--bs-light)' ref={whatsappTogglerRef} className='rounded-4 p-2 bg-success border border-2 border-success ptr shadow-sm' onClick={() => setShowWhatsAppContactor(true)}
                                />,
                                title: "Let's chat",
                                visible: true
                            },
                            {
                                icon: <CaretDoubleUp size={40} fill='var(--black2)' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='rounded-4 p-2 bg-appColor border border-2 border-appColor ptr shadow-sm' />,
                                visible: showScrollTopIcon ? true : false
                            },
                        ]
                    }
                />

                {/* WhatsApp contactor */}
                <WhatsAppContactor show={showWhatsAppContactor} toggler={whatsappTogglerRef} onClose={() => setShowWhatsAppContactor(false)} />
            </div>
        </>
    )
}

export default Terms;
