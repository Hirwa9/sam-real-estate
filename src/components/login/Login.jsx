import React, { useState, useEffect, useId } from 'react';
import useCustomDialogs from '../hooks/useCustomDialogs';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css'
import { CaretRight, CheckCircle, SignIn, UserCirclePlus, UserPlus, XCircle } from '@phosphor-icons/react';
import MyToast from '../common/Toast';
import CtaTextButton from '../common/ctaTextButton/CtaTextButton';
import { isValidEmail, isValidName } from '../../scripts/myScripts';
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

	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [responseMessage, setResponseMessage] = useState('');

	const signInId = useId();
	const signUpId = useId();
	const [signingIn, setSigningIn] = useState(true);
	const toggleSigninSignup = () => setSigningIn(!signingIn);

	/**
	 * Login
	*/

	// Submit sign in form
	// const handleSignIn = (e) => {
	//   e.preventDefault();
	//   axios.post('http://localhost:5000/login', { email, password })
	//     .then(res => {
	//       console.log(res);
	//     }).catch(err => {
	//       console.error(err)
	//     });
	// }

	const handleSignIn = async (e) => {
		e.preventDefault();
		if (!isValidEmail(email)) {
			return alert('Enter a valid email address.');
		}
		try {
			await axios.post('http://localhost:5000/login', { email, password });
			// navigate("../Dashboard.js");
			navigate("../admin");
		} catch (error) {
			if (error.response) {
				console.error(error.response.data.message);
				toast(error.response.data.message, 'warning');
			}
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
		// Length Validation (At least 8 characters)
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
	const handleSignUp = (e) => {
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
		axios
			.post('http://localhost:5000/register', {
				name: newUserName,
				email: newUserEmail,
				password: newUserPassword,
				confPassword: confirmNewUserPassword
			})
			.then(response => {
				toast({ message: response.data.message, type: 'success' });
				resetRegisterForm();
				const userId = response.data.userId;
				setTimeout(() => {
					navigate(`/user/${userId}`); // Navigate to user's dashboard
				}, 2000);
			})
			.catch(err => {
				if (err.response && err.response.data && err.response.data.message) {
					toast({ message: err.response.data.message, type: 'warning' });
				} else {
					toast({ message: 'Something went wrong. You can try again', type: 'warning' });
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
			<div className="container position-relative col-md-10 mb-5 pb-3 signin">
				<h1 className="mb-0 mt-lg-4 text-center text-balance font-variant-small-caps">Welcome Back</h1>
				<p className="mb-3 mb-lg-5 text-center small">Sign into your account</p>

				<div className="pt-3">
					<div className="row g-0">
						<div className="col-md-6 col-lg-4 bg-black3 d-none d-md-block bg-no-repeat-cover" style={{ backgroundImage: "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp)" }}>
							{/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp" alt="login form" className="img-fluid" style={{ borderRadius: "1rem 0 0 1rem" }} /> */}
						</div>
						<div className="col-md-6">
							<div className="card-body p-2 p-md-4 px-lg-5">
								{/* <h5 className="mb-3 fw-normal" style={{ letterSpacing: "1px", fontSize: "80%" }}>Sign into your account</h5> */}
								{/* Navs */}
								<ul className="nav nav-tabs position-relative mb-2 border-0" id="signInNavTabs" role="tablist">
									<li className="nav-item col-6" role="presentation">
										<button className={`nav-link ${signingIn ? 'active' : ''} w-100 text-nowrap border-opacity-25`} id="signIn-tab" type="button" role="tab" aria-controls="signIn" aria-selected="true"
											onClick={() => setSigningIn(true)}
										>SIGN IN</button>
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
												<button type="submit" className="btn btn-sm btn-dark flex-center px-3 rounded-pill w-100 clickDown" style={{ fontSize: "75%", paddingBlock: ".8rem" }}>SIGN IN <CaretRight size={15} className='ms-2' /></button>
											</div>

											{/* <p className="mb-5 pb-lg-2">
                        Don't have an account?
                        <span href="#!" className='text-primary ms-2' data-bs-toggle="tab" data-bs-target="#signUp">Register here</span>
                      </p> */}
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
													<span className="jxqc78-5 eMFycA"></span> At least 8 characters
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
			</div>

		</>
	)
}

export default Login;
