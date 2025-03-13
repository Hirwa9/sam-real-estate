import React, { useState } from 'react';
import "./team.css";
import { companyPhoneNumber1, team } from '../../data/Data';
import { CaretRight, ChatText, CircleWavyCheck, MapPinArea, Phone, Translate, WhatsappLogo } from '@phosphor-icons/react';
import WorkingHours from '../../common/workinghours/WorkingHours';
import Heading from '../../common/Heading';
import ConfirmDialog from '../../common/confirmDialog/ConfirmDialog';
import { PhoneCall } from '@phosphor-icons/react/dist/ssr';

const Team = ({ id }) => {

	// Confirm dialog
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
	const [confirmDialogAction, setConfirmDialogAction] = useState('');
	const [confirmDialogActionText, setConfirmDialogActionText] = useState('Yes, continue');
	const [confirmDialogCloseText, setConfirmDialogCloseText] = useState('Not now');
	const [confirmDialogType, setConfirmDialogType] = useState('gray-700');
	const [confirmDialogActionWaiting, setConfirmDialogActionWaiting] = useState(false);

	const customConfirmDialog = ({ message, action, actionText, closeText, type }) => {
		setShowConfirmDialog(true);
		setConfirmDialogMessage(message);
		setConfirmDialogActionText(actionText || confirmDialogActionText);
		setConfirmDialogCloseText(closeText || confirmDialogCloseText);
		setConfirmDialogType(type || confirmDialogType);
		setConfirmDialogAction(() => action);
	};

	const resetConfirmDialog = () => {
		setShowConfirmDialog(false);
		setConfirmDialogMessage('');
		setConfirmDialogActionText('Yes, continue');
		setConfirmDialogCloseText('Not now');
		setConfirmDialogType('gray-700');
		setConfirmDialogAction('');
		setConfirmDialogActionWaiting(false);
	}

	const sendMessage = () => {
		window.open(`https://wa.me/${companyPhoneNumber1.phone}?text=Hello%2C%20I%27m%20interested%20in%20your%20services`, '_blank');
	}

	const makeCall = () => {
		window.open(`tel:+${companyPhoneNumber1.phone}`);
	}

	return (
		<>
			<ConfirmDialog
				show={showConfirmDialog}
				message={confirmDialogMessage}
				type={confirmDialogType}
				action={() => { confirmDialogAction(); }}
				actionText={confirmDialogActionText}
				actionIsWaiting={confirmDialogActionWaiting}
				closeText={confirmDialogCloseText}
				onClose={resetConfirmDialog}
			/>
			<section className='team' id={id}>
				<div className='container-fluid'>
					<Heading
						title="Featured Agents"
						subtitle="Meet our top agents dedicated to helping you buy or sell with ease. With market expertise and personalized service, they're ready to guide you every step of the way."
						hType="h2"
					/>
					<div className='d-lg-flex'>
						<div className='col-12 col-lg-5 d-flex flex-wrap justify-content-center'>
							{team.map((person, index) => {
								return (
									<div key={index} className='col-12 col-sm-8 col-md-6 col-lg-10 mb-4 mb-md-0 p-md-3'>
										<div key={index} className='d-flex flex-column h-100 border rounded-4 overflow-hidden box'>
											<div className='position-relative img'>
												<img src={person.cover} alt='' className='w-100 object-fit-cover' />
												<CircleWavyCheck size={40} weight='fill' fill="var(--bs-light)" />
											</div>
											<div className='position-relative d-flex flex-column flex-grow-1 px-3 pb-3 bg-light details'>
												<div className='position-absolute bg-light design'></div>
												<div className='text-grey'>
													<MapPinArea size={20} weight='bold' className='me-1' />
													<span className='small' style={{ color: "#2d3954" }}>{person.address}</span>
												</div>
												<h4 className='my-1 text-muted fw-bold'>{person.name}</h4>
												<ul className='d-flex align-items-center justify-content-end mb-3 gap-3 list-unstyled'>
													{person.socialMedia
														.filter(item => item.link !== '')
														.map((item, index) => (
															<li key={index} className='flex-center w-2_5rem ratio-1-1 rounded-circle small'>
																<a href={item.link} target="_blank" rel="noopener noreferrer" className='dim-100 btn btn-light text-muted border-secondary border-opacity-25 flex-center rad-inherit'>
																	{item.icon}
																</a>
															</li>
														))}
												</ul>
												<div className='d-flex flex-wrap row-gap-2 mt-auto'>
													{/* Message action */}
													<button rel="noreferrer" className='btn btn-sm btn-outline-secondary border-0 border-start border-secondary border-opacity-25 flex-align-center px-3 rounded-0 flex-fill'
														style={{ paddingBlock: ".35rem" }}
														onClick={
															() => {
																customConfirmDialog({
																	message: (
																		<>
																			<h5 className="h6 flex-align-center border-bottom border-light border-opacity-25 mb-3 pb-2"><ChatText size={20} weight='bold' className='me-2 opacity-50' /> Let's connect</h5>
																			<p>
																				Connect with {person.name} on WhatsApp.
																			</p>
																		</>
																	),
																	actionText: <>Start Chat <CaretRight /></>,
																	closeText: 'Maybe later',
																	type: 'dark',
																	action: () => { sendMessage(); resetConfirmDialog(); },
																});
															}
														}
													>
														<WhatsappLogo size={22} className='me-1 opacity-50' /> Message
													</button>
													{/* Call action */}
													<button className='btn btn-sm btn-outline-secondary border-0 border-start border-secondary border-opacity-25 flex-align-center px-3 rounded-0 flex-fill'
														style={{ paddingBlock: ".35rem" }}
														onClick={
															() => {
																customConfirmDialog({
																	message: (
																		<>
																			<h5 className="h6 flex-align-center border-bottom border-light border-opacity-25 mb-3 pb-2"><PhoneCall size={20} weight='bold' className='me-2 opacity-50' /> Let's talk</h5>
																			<p>
																				Call {person.name} for further information.
																			</p>
																			<div className='flex-align-center smaller text-gray-400 fw-bold'>
																				<Translate size={22} weight='light' className='flex-shrink-0 me-2' />
																				<div>
																					Kinyarwanda and English
																				</div>
																			</div>
																		</>
																	),
																	actionText: <>Make call <PhoneCall className='ms-1' /> </>,
																	closeText: 'Maybe later',
																	type: 'dark',
																	action: () => { makeCall(); resetConfirmDialog(); },
																});
															}
														}
													>
														<Phone size={22} className='me-1 opacity-50' /> Call
													</button>
													<a href="/properties/all" className='btn btn-sm btn-outline-secondary border-0 border-start border-secondary border-opacity-25 flex-align-center px-3 rounded-0 d-block flex-fill order-1'
														style={{ paddingBlock: ".35rem" }}
													>
														Listing <CaretRight size={22} className='opacity-50' />
													</a>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<WorkingHours />
					</div>

				</div>
			</section>
		</>
	);
}

export default Team;
