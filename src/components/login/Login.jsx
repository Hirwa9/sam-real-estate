import React, { useState, useEffect, useId, useContext } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import { Link, useNavigate } from "react-router-dom";
import './login.css'
import { CheckCircle, SignIn, UserCirclePlus, UserPlus, WarningCircle, XCircle } from '@phosphor-icons/react';
import MyToast from '../common/Toast';
import CtaTextButton from '../common/ctaTextButton/CtaTextButton';
import { isValidEmail, isValidName } from '../../scripts/myScripts';
import ContentListing from '../common/contentListing/ContentListing';
// import { companyEmail } from '../data/Data';
import { AuthContext } from '../AuthProvider';
import { Axios, BASE_URL } from '../../api/api';
/* globals $ */

const Login = () => {
	// Custom hooks
	const {
		// Toast
		showToast,
		setShowToast,
		toastMessage,
		toastType,
		toast,
	} = useCustomDialogs();

	// Auth check
	const { isAuthenticated, checkAuthOnMount, login, setIsAuthenticated } = useContext(AuthContext);
	// useEffect(() => {
	// 	!isAuthenticated && checkAuthOnMount();
	// }, [isAuthenticated, checkAuthOnMount]);


	const [isWaitingFetchAction, setIsWaitingFetchAction] = useState(false);
	const [errorWithFetchAction, setErrorWithFetchAction] = useState(null);

	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [responseMessage, setResponseMessage] = useState('');

	const signInId = useId();
	const signUpId = useId();
	const [signingIn, setSigningIn] = useState(true);
	const toggleSigninSignup = () => setSigningIn(!signingIn);

	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);


	/**
	 * Login
	*/

	const { setAuthState } = useContext(AuthContext);
	// const [email, setEmail] = useState('');
	// const [password, setPassword] = useState('');

	const handleSignIn = async (e) => {
		e.preventDefault();
		if (!isValidEmail(email)) {
			return alert('Enter a valid email address.');
		}

		// try {
		// 	setIsWaitingFetchAction(true);
		// 	const response = await Axios.post(`${BASE_URL}/login`, { email, password });
		// 	setAuthState({
		// 		accessToken: response.data.accessToken,
		// 		refreshToken: response.data.refreshToken,
		// 	});
		// 	setErrorWithFetchAction(null);
		// } catch (error) {
		// 	setIsWaitingFetchAction(false);
		// 	setErrorWithFetchAction(error);
		// 	console.error('Login error:', error);
		// }

		try {
			setIsWaitingFetchAction(true);
			await login(email, password);
		} catch (error) {
			console.error('Error signing in:', error);
		} finally {
			setIsWaitingFetchAction(false);
		}
	}

	/**
	 * Sign up
	 *  */

	const [newUserName, setNewUserName] = useState('');
	const [newUserEmail, setNewUserEmail] = useState('');
	const [newUserPassword, setNewUserPassword] = useState('');
	const [confirmNewUserPassword, setConfirmNewUserPassword] = useState('');

	// Password validation
	const [passwordProvided, setPasswordProvided] = useState(false);
	const [lengthValidation, setLengthValidation] = useState(false);
	const [mixValidation, setMixValidation] = useState(false);
	const [specialCharValidation, setSpecialCharValidation] = useState(false);
	const [caseValidation, setCaseValidation] = useState(false);
	const [canCreateAccount, setCanCreateAccount] = useState(false);

	const validatePassword = (e) => {
		const val = e.target.value;
		// Check length (At least 1 characters)
		val.length >= 1 ? setPasswordProvided(true) : setPasswordProvided(false);
		// Length Validation (At least 8 characters long)
		val.length >= 8 ? setLengthValidation(true) : setLengthValidation(false);
		// Mix of letters and numbers
		const hasLettersAndNumbers = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(val);
		hasLettersAndNumbers ? setMixValidation(true) : setMixValidation(false);
		// At least 1 special character
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);
		hasSpecialChar ? setSpecialCharValidation(true) : setSpecialCharValidation(false);
		// At least 1 lowercase letter and 1 uppercase letter
		const hasLowerAndUpperCase = /(?=.*[a-z])(?=.*[A-Z])/.test(val);
		hasLowerAndUpperCase ? setCaseValidation(true) : setCaseValidation(false);
	}

	// Validation of sign up form
	useEffect(() => {
		if (
			passwordProvided &&
			lengthValidation &&
			mixValidation &&
			specialCharValidation &&
			caseValidation &&
			newUserPassword === confirmNewUserPassword
		) {
			setCanCreateAccount(true);
		} else {
			setCanCreateAccount(false);
		}
	}, [passwordProvided, lengthValidation, mixValidation, specialCharValidation, caseValidation, newUserPassword, confirmNewUserPassword]);

	const resetRegisterForm = () => {
		setNewUserName('');
		setNewUserEmail('');
		setNewUserPassword('');
		setConfirmNewUserPassword('');
	}

	// Submit sign up form
	const handleSignUp = async (e) => {
		e.preventDefault();

		if (!isValidName(newUserName)) {
			return alert('Enter a valid name to continue.');
		}
		if (!isValidEmail(newUserEmail)) {
			return alert('Enter a valid email address.');
		}
		if (!canCreateAccount)
			return alert("Set a valid password to continue");

		// Sending data with the expected keys
		await Axios.post(`${BASE_URL}/register`, {
			name: newUserName,
			email: newUserEmail,
			password: newUserPassword,
			confPassword: confirmNewUserPassword
		})
			.then(response => {
				const data = response.data;
				// setIsAuthenticated(true);
				setAuthState({
					accessToken: response.data.accessToken,
					refreshToken: response.data.refreshToken,
				});
				toast({
					message: <><UserCirclePlus size={22} weight='fill' className='me-1 opacity-50' /> {data.message}.</>,
					type: 'success'
				});
				setTimeout(() => {
					resetRegisterForm();
					navigate(`/user/${data.userId}`); // Navigate to user's dashboard
				}, 2000);
			})
			.catch(err => {
				if (err.response && err.response.data && err.response.data.message) {
					toast({
						message: <><WarningCircle size={22} weight='fill' className='me-1 opacity-50' /> {err.response.data.message}.</>,
						type: 'warning'
					});
				} else {
					toast({
						message: <><WarningCircle size={22} weight='fill' className='me-1 opacity-50' /> Something went wrong. You can try again.</>,
						type: 'warning'
					});
				}
				console.error(err);
			});
	};

	// Handle input changes
	const handleChange = (e) => {
		const target = e.target;
		if (target.value !== undefined && target.value !== '') {
			$(target).addClass('has-data');
		} else {
			$(target).removeClass('has-data');
		}
	};

	return (
		<>
			<MyToast show={showToast} message={toastMessage} type={toastType} selfClose onClose={() => setShowToast(false)} />
			<div className="position-relative pb-3 pb-lg-0 signin">
				<div className="row g-0 pt-3 pt-lg-0">
					<div className="col-lg-5 p-4 p-xl-5 d-none d-lg-block bg-no-repeat-cover text-muted clip-text-gradient">
						<ContentListing
							title="Find your dream property with us"
							content="We are dedicated to helping you find the perfect property that fits your lifestyle and needs. Whether you're looking to buy, rent, or invest, our team of experts is here to guide you every step of the way."
							icon="flag"
							className="border-start border-end border-1 rounded-0 small-content mb-3"
						/>
						<ContentListing
							title="Why Choose Us?"
							content={
								<>
									<ul className='list-unstyled'>
										<li className='mb-2'>
											<b>Personalized Service:</b> Our experienced agents offer personalized services tailored to your unique preferences and requirements.
										</li>
										<li className='mb-2'>
											<b>Extensive Listings:</b> Explore a wide range of properties, from cozy apartments to luxurious estates, in prime locations.
										</li>
										<li className='mb-2'>
											<b>Custom Alerts:</b> Receive notifications for new listings that match your preferences.
										</li>
									</ul>
								</>
							}
							icon="handshake"
							className="border-start border-end border-1 rounded-0 small-content mb-3"
						/>
					</div>
					<div className="col-sm-8 col-md-6 container-lg col-xl-5 mx-auto-lg my-lg-3 pt-3 bg-white3 blur-bg-5px rounded-4">
						<h1 className="mb-0 mt-lg-3 text-center text-balance font-variant-small-caps">
							{signingIn ? (<>Sign Into Your Account</>)
								: (<>Create a New Account</>)
							}
						</h1>
						<p className="mb-5 mb-md-3 text-center small text-gray-600">
							{signingIn ? (<>Back to your favorite listing</>)
								: (<>A step towards your perfect property</>)
							}
						</p>
						<div className="card-body p-2 p-lg-4 px-lg-5">
							<ul className="nav nav-tabs position-relative mb-2 border-0" id="signInNavTabs" role="tablist">
								<li className="nav-item col-6" role="presentation">
									<button className={`nav-link ${signingIn ? 'active' : ''} w-100 text-nowrap border-opacity-25`} id="signIn-tab" type="button" role="tab" aria-controls="signIn" aria-selected="true"
										onClick={() => setSigningIn(true)}
									>
										SIGN IN</button>
								</li>
								<li className="nav-item col-6" role="presentation">
									<button className={`nav-link ${!signingIn ? 'active' : ''} w-100 text-nowrap border-opacity-25`} id="signUp-tab" type="button" role="tab" aria-controls="signUp" aria-selected="false"
										onClick={() => setSigningIn(false)}
									>NEW ACCOUNT</button>
								</li>
							</ul>
							{/* Tabs */}
							<div className="tab-content py-3" id="signInTabs">
								{/* Log in */}
								<div className={`tab-pane ${signingIn ? 'active show fade' : 'fade'}`} id="signIn" role="tabpanel" aria-labelledby="signIn-tab">
									<form onSubmit={handleSignIn}>
										<div className={`form-input-element`}>
											<input
												type="email"
												id={signInId + "Email"}
												className="form-control form-control-lg"
												value={email}
												required
												onChange={e => { handleChange(e); setEmail(e.target.value) }}
											/>
											<label htmlFor={signInId + "Email"} className="form-label">Email</label>
										</div>
										<div className={`form-input-element`}>
											<input
												type="password"
												id={signInId + "Password"}
												className="form-control form-control-lg no-css-validation"
												value={password}
												required
												onChange={e => { handleChange(e); setPassword(e.target.value) }}
											/>
											<label htmlFor={signInId + "Password"} className="form-label">Password</label>
										</div>
										<div className="pt-1 my-4">
											<button type="submit" className="btn btn-sm btn-dark flex-center px-3 rounded-pill w-100 clickDown" style={{ fontSize: "75%", paddingBlock: ".8rem" }}>
												SIGN IN {!isWaitingFetchAction ? <SignIn size={15} className='ms-2' />
													: <span className="spinner-grow spinner-grow-sm ms-2"></span>
												}

											</button>
										</div>
										<div className='d-grid gap-3 place-items-center'>
											<a className="d-grid w-fit mx-auto small text-primary text-decoration-none" href="#!">Forgot password?</a>
											<CtaTextButton
												text="Don't have an account?"
												actionText="Create one"
												action={() => toggleSigninSignup()}
												icon={<UserPlus className='ms-1' />}
												type='gray-200'
												textFallbackColor='gray-700'
											/>
											<Link to="/terms" className="small text-muted">Terms of use</Link>
										</div>
									</form>
								</div>

								{/* Register */}
								<div className={`tab-pane ${!signingIn ? 'active show fade' : 'fade'}`} id="signUp" role="tabpanel" aria-labelledby="signUp-tab">
									<form onSubmit={handleSignUp}>
										<div className={`form-input-element`}>
											<input
												type="text"
												id={signUpId + "Name"}
												placeholder="Enter name"
												className="form-control form-control-lg no-css-validation"
												value={newUserName}
												required
												onChange={e => { handleChange(e); setNewUserName(e.target.value); }}
											/>
											<label htmlFor={signUpId + "Name"} className="form-label">Name</label>
										</div>
										<div className={`form-input-element`}>
											<input
												type="email"
												id={signUpId + "Email"}
												placeholder="Enter email"
												className="form-control form-control-lg"
												value={newUserEmail}
												required
												onChange={e => { handleChange(e); setNewUserEmail(e.target.value); }}
											/>
											<label htmlFor={signUpId + "Email"} className="form-label">Email</label>
										</div>
										<div className={`form-input-element`}>
											<input
												type="password"
												id={signUpId + "Password"}
												placeholder="Create Password"
												className="form-control form-control-lg no-css-validation"
												value={newUserPassword}
												required
												onChange={e => { handleChange(e); setNewUserPassword(e.target.value); validatePassword(e) }}
											/>
											<label htmlFor={signUpId + "Password"} className="form-label">Password</label>
										</div>
										<div className={`form-input-element`}>
											<input
												type="password"
												id={signUpId + "ConfirmPassword"}
												placeholder="Confirm Password"
												className="form-control form-control-lg no-css-validation"
												value={confirmNewUserPassword}
												required
												onChange={e => { handleChange(e); setConfirmNewUserPassword(e.target.value); }}
											/>
											<label htmlFor={signUpId + "ConfirmPassword"} className="form-label">Password</label>
										</div>
										<div className={`px-3 form-text trans-p3s ${!passwordProvided ? 'opacity-75' : ''}`} style={{ fontSize: "80%" }}>
											<p className="mb-0">
												{passwordProvided &&
													<span className="validation-icons me-1 opacity-75">
														{lengthValidation
															?
															<CheckCircle size={15} weight='fill' className='text-success' />
															:
															<XCircle size={15} weight='fill' className='text-danger' />
														}
													</span>
												}
												<span className="jxqc78-5 eMFycA"></span> At least 8 characters long
											</p>
											<p className="mb-0">
												{passwordProvided &&
													<span className="validation-icons me-1 opacity-75">
														{mixValidation
															?
															<CheckCircle size={15} weight='fill' className='text-success' />
															:
															<XCircle size={15} weight='fill' className='text-danger' />
														}
													</span>
												}
												<span className="jxqc78-5 eMFycA"></span> Mix of letters and numbers
											</p>
											<p className="mb-0">
												{passwordProvided &&
													<span className="validation-icons me-1 opacity-75">
														{specialCharValidation
															?
															<CheckCircle size={15} weight='fill' className='text-success' />
															:
															<XCircle size={15} weight='fill' className='text-danger' />
														}
													</span>
												}
												<span className="jxqc78-5 eMFycA"></span> At least 1 special character
											</p>
											<p className="mb-0">
												{passwordProvided &&
													<span className="validation-icons me-1 opacity-75">
														{caseValidation
															?
															<CheckCircle size={15} weight='fill' className='text-success' />
															:
															<XCircle size={15} weight='fill' className='text-danger' />
														}
													</span>
												}
												<span className="jxqc78-5 eMFycA"></span> At least 1 lowercase and 1 uppercase letters
											</p>
											<p className="mb-0">
												{passwordProvided &&
													<span className="validation-icons me-1 opacity-75">
														{newUserPassword === confirmNewUserPassword
															?
															<CheckCircle size={15} weight='fill' className='text-success' />
															:
															<XCircle size={15} weight='fill' className='text-danger' />
														}
													</span>
												}
												<span className="jxqc78-5 eMFycA"></span> Password matches
											</p>
										</div>
										<p className='my-3 text-center text-muted small'>
											By submitting, you agree to our <Link to="/terms" className="text-muted">Terms of use</Link>.
										</p>
										<div className="pt-1 my-4">
											<button type="submit" className="btn btn-sm btn-dark flex-center mb-3 px-3 rounded-pill w-100 clickDown" style={{ fontSize: "75%", paddingBlock: ".8rem" }}>CREATE ACCOUNT <UserCirclePlus size={20} className='ms-2' /></button>
											<button type="reset" className="btn btn-sm btn-outline-danger d-block border-3 border-danger border-opacity-25 mx-auto px-5 rounded-pill w-fit clickDown" style={{ fontSize: "75%" }} onClick={resetRegisterForm}>Cancel</button>
										</div>
										<div className='mt-4'>
											<CtaTextButton
												text="I Have an account"
												actionText="Sign in"
												action={() => toggleSigninSignup()}
												fallback={() => window.scrollTo({ top: 0, behavior: 'auto' })}
												icon={<SignIn className='ms-1' />}
												type='gray-200'
												textFallbackColor='gray-700'
											/>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}

export default Login;
