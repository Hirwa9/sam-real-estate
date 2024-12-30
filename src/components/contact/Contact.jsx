import React, { useState, useId, useTransition } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import PropTypes from 'prop-types';
import Back from '../common/header/Back';
import img from '../images/pricing.jpg';
import './contact.css';
import '../common/formInput/formInput.css'
import { isValidEmail, isValidName } from '../../scripts/myScripts';
import WorkingHours from '../common/workinghours/WorkingHours';
import { companyAddress, companyEmail } from '../data/Data';
import MyToast from '../common/Toast';
import { EnvelopeSimple, Globe, MapPinSimpleArea, Numpad, PaperPlaneRight, Phone, Trash, WhatsappLogo, } from '@phosphor-icons/react';
/* globals $ */

const Contact = () => {
    // Custom hooks
    const {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,
    } = useCustomDialogs();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const id = useId();

    // Handle input changes
    const handleChange = (e) => {
        const target = e.target;
        if (target.value !== undefined && target.value !== '') {
            $(target).addClass('has-data');
        } else {
            $(target).removeClass('has-data');
        }
    };

    // Reset form
    const resetForm = () => {
        setName('');
        setEmail('');
        setMessage('');
    };

    // Handle submit

    const [isPending, startTransition] = useTransition();
    const [isWaiting, setIsWaiting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidName(name)) {
            return alert('Enter a valid name to continue.');
        }
        if (!isValidEmail(email)) {
            return alert('Enter a valid email address.');
        }

        startTransition(async () => {
            try {
                setIsWaiting(true);
                const response = await fetch('http://localhost:5000/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    const data = await response.json();
                    resetForm();
                    toast({ message: data.message, type: 'dark' });
                } else {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    toast({ message: 'Something went wrong. You can try again' });
                }
            } catch (error) {
                console.error('Request failed:', error);
                toast({ message: 'Owc! Could not send your message. Check your connection and try again', type: 'warning' });
            } finally {
                setIsWaiting(false);
            }
        });
    };

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            <section className='mb-4 contact'>
                <Back name="Contact Us" title="Get Help & Friendly Support" cover={img} className="mb-0" />
                {/* Contact form */}
                <div className="container d-lg-flex col-lg-11 my-5 p-0 p-lg-3 overflow-hidden contact-info">
                    <div className='col-lg-6 p-3 py-4 p-lg-5 form-field'>
                        <div className='clip-text-gradient'>
                            <h3 className="gap-2 mb-4"><Numpad fill='#38818c' size={32} /> Get In Touch</h3>
                            <p className='smaller'>
                                Reach out through our contact form, and we will promptly address any questions for clarity
                            </p>
                        </div>
                        {/* <hr /> */}
                        <form method="POST" id="" onSubmit={handleSubmit}>
                            <div className={`form-input-element`}>
                                <input
                                    type="text"
                                    id={id + "Name"}
                                    placeholder="Enter name"
                                    className="form-control form-control-lg no-css-validation"
                                    value={name}
                                    required
                                    onChange={e => { handleChange(e); setName(e.target.value) }}
                                />
                                <label htmlFor={id + "Name"} className="form-label">Name</label>
                            </div>
                            <div className={`form-input-element`}>
                                <input
                                    type="email"
                                    id={id + "Email"}
                                    placeholder="Enter email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    required
                                    onChange={e => { handleChange(e); setEmail(e.target.value) }}
                                />
                                <label htmlFor={id + "Email"} className="form-label">Email</label>
                            </div>
                            <div className="mb-3" id="inPuts">
                                <textarea id={id + "Message"} name="Message" className="form-control border-bottom border-dark border-opacity-25" cols="30" rows="5" placeholder="Your message" required value={message} onChange={e => { setMessage(e.target.value) }}></textarea>
                            </div>
                            <div className="my-5">
                                <button type="submit" className="btn btn-sm btn-dark flex-center w-100 mb-3 py-2 px-4 fw-bold rounded-pill clickDown" id="sendMessageBtn"
                                >
                                    {!isWaiting ?
                                        <>Send message <PaperPlaneRight size={18} weight='duotone' className='ms-2' /></>
                                        : <>Sending <span className="spinner-grow spinner-grow-sm ms-2"></span></>
                                    }
                                </button>
                                {(name !== '' || email !== '' || message !== '') &&
                                    <button type="reset" className="btn btn-sm w-100 mb-3 py-2 px-4 text-secondary border-secondary border-opacity-25 clickDown" onClick={resetForm}>
                                        Cancel
                                        <Trash weight='bold' className='ms-2' />
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                    <div className='col-lg-6 p-3 py-4 p-lg-5 more-contact-field'>
                        <div className="info-wrap w-100">
                            <p className="mb-4 text-center fw-bold text-balance">We're open for any assistance or just to have a chat</p>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <MapPinSimpleArea size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            Address:
                                        </span> {companyAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <Phone size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            Phone:
                                        </span> <a href="tel:+250789305885" className='text-dark text-decoration-none'>(250) 789 305 885</a>
                                    </p>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <Phone size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            Phone:
                                        </span> <a href="tel:+250788321583" className='text-dark text-decoration-none'>(250) 788 321 583</a>
                                    </p>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <WhatsappLogo size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            WhatsApp:
                                        </span> <a href="https://wa.me/250789305885?text=Hello%2C%20I%27m%20interested%20in%20your%20services." target='_blank' rel='noreferrer' className='text-dark text-decoration-none'>(250) 788 321 583</a>
                                    </p>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <EnvelopeSimple size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            Email:
                                        </span> <a href={`mailto:${companyEmail}`} target='_blank' rel='noreferrer' className='text-dark text-decoration-none'> samrealtor60@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center mb-4">
                                <div className="icon d-flex align-items-center justify-content-center rounded-circle me-2 me-sm-3 bg-dark">
                                    <Globe size={20} fill='var(--bs-gray-300)' />
                                </div>
                                <div className="small">
                                    <p className='m-0'>
                                        <span className='me-2 fw-bold'>
                                            Website:
                                        </span> <a href="/" className='text-dark text-decoration-none'>You're here</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Working hours */}
                <WorkingHours isStatic />
            </section>

            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.572177785325!2d30.09727207350508!3d-1.9226494366496785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca1329314b867%3A0x1c7a1f350c9efad7!2s24%20KG%20414%20St%2C%20Kigali!5e0!3m2!1sen!2srw!4v1733073908750!5m2!1sen!2srw"
                title='Our location'
                height="450" style={{ border: 0, borderTop: '2px dashed var(--bs-secondary)' }}
                allowFullScreen=""
                loading="lazy"
                className='w-100 pt-3'
                referrerPolicy="no-referrer-when-downgrade"></iframe>
        </>
    )
}

Contact.propTypes = {
    name: PropTypes.string,
    message: PropTypes.string,
}

export default Contact;
