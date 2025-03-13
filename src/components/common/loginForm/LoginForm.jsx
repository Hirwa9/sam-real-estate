import React, { useState, useId, useRef, useEffect, useContext } from 'react';
import useCustomDialogs from '../../hooks/useCustomDialogs';
import './loginForm.css';
import { AuthContext } from "../../AuthProvider";
import { Link } from "react-router-dom";
import { CaretRight, SignIn, UserCirclePlus, XCircle } from '@phosphor-icons/react';
import DividerText from '../DividerText';
import { isValidEmail } from '../../../scripts/myScripts';
import MyToast from '../Toast';
import CtaTextButton from '../ctaTextButton/CtaTextButton';
import { BASE_URL } from '../../../api/api';
/* globals $ */

const LoginForm = ({ setShowLogin }) => {
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
    const { isAuthenticated, checkAuthOnMount, login } = useContext(AuthContext);
    useEffect(() => {
        !isAuthenticated && checkAuthOnMount();
    }, [isAuthenticated, checkAuthOnMount]);

    /**
     * Authentication
     */

    // Handle input UI changes
    const handleChange = (e) => {
        const target = e.target;
        if (target.value !== undefined && target.value !== '') {
            $(target).addClass('has-data');
        } else {
            $(target).removeClass('has-data');
        }
    };

    const loginId = useId();
    const resetId = useId();
    const resetPW1d = useId();
    const [flipLoginCard, setFlipLoginCard] = useState(false);

    /**
     * Login
    */

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // __Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            return alert('Enter a valid email address.');
        }

        login(email, password);
    };

    // Reset form
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setError('');
    }

    /**
     * Reset password
     */

    const [loading, setLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetError, setResetError] = useState(false);
    // OTP
    const [canEnterOtp, setCanEnterOtp] = useState(false);
    // PW
    const [canEnterNewPassword, setCanEnterNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [canResetPassword, setCanResetPassword] = useState(false);

    // PW validation
    const isValidPassword = (pw, pwConf) => {
        // Length Validation (At least 8 characters long)
        const hasValue = (pw.trim().length >= 0);
        const validLength = (pw.length >= 8);
        // Mix of letters and numbers
        const hasLettersAndNumbers = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(pw);
        // At least 1 special character
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
        // At least 1 lowercase letter and 1 uppercase letter
        const hasLowerAndUpperCase = /(?=.*[a-z])(?=.*[A-Z])/.test(pw);
        // Passwords match
        const passwordsMatch = (pw === pwConf);

        return (
            hasValue && validLength && hasLettersAndNumbers
            && hasSpecialChar && hasLowerAndUpperCase && passwordsMatch
        )
    }

    useEffect(() => {
        if (isValidPassword(newPassword, newPasswordConfirm))
            setCanResetPassword(true)
        else setCanResetPassword(false)
    }, [newPassword, newPasswordConfirm]);

    // Reset pw reset States to default
    const passwordResetToDefault = () => {
        setFlipLoginCard(false);
        setCanEnterOtp(false);
        setCanEnterNewPassword(false);
        setCanResetPassword(false);
    }

    // __Request PW reset handler
    const handlePWResetRequest = async (e) => {
        if (e) e.preventDefault();
        if (!isValidEmail(resetEmail)) {
            return alert('Enter a valid email address.');
        }

        try {
            setLoading(true);

            const email = resetEmail;
            const response = await fetch(`${BASE_URL}/user/${resetEmail}/requestPasswordReset`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (response.ok) {
                setCanEnterOtp(true);
            } else {
                setResetError(true);
                setCanEnterOtp(false);
                console.error("Something went wrong: " + result.message);
            }
        } catch (err) {
            setResetError(true);
            setCanEnterOtp(false);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input
    const otpInputRefs = useRef([]);
    const [otpNumber, setOtpNumber] = useState({
        otpNum1: '',
        otpNum2: '',
        otpNum3: '',
        otpNum4: '',
        otpNum5: '',
        otpNum6: ''
    });

    const handleOTPChange = (e, index) => {
        const { value } = e.target;

        // Handle when a digit is entered (not Backspace)
        if (e.key !== "Backspace") {
            if (/^[0-9]$/.test(value) || value === '') {
                const updatedOtp = { ...otpNumber, [`otpNum${index + 1}`]: value };
                setOtpNumber(updatedOtp);

                // Focus the next input if the current input is filled
                if (value !== '' && otpInputRefs.current[index + 1]) {
                    otpInputRefs.current[index + 1].focus();
                }
            }
        }

        // Handle Backspace key
        else if (e.key === "Backspace") {
            if (value === '' && otpInputRefs.current[index - 1]) {
                // Move to the previous input if Backspace is pressed and the current input is empty
                otpInputRefs.current[index - 1].select();
            } else {
                const updatedOtp = { ...otpNumber, [`otpNum${index + 1}`]: '' };
                setOtpNumber(updatedOtp);
            }
        }
    };

    useEffect(() => {
        const providedOtp =
            otpNumber.otpNum1 + otpNumber.otpNum2
            + otpNumber.otpNum3 + otpNumber.otpNum4
            + otpNumber.otpNum5 + otpNumber.otpNum6;
        setOtp(String(providedOtp));
    }, [otpNumber, otp]);

    // __Verify OTP handler
    const handleOTPVerification = async (e) => {
        e.preventDefault();

        if (!otp || otp.trim() === '' || otp.length < 6) {
            return alert('Enter a valid OTP.');
        }

        try {
            setLoading(true);

            const response = await fetch(`${BASE_URL}/user/${resetEmail}/verifyOTP`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetEmail, otp }),
            });

            const result = await response.json();
            if (response.ok) {
                setCanEnterNewPassword(true);
            } else {
                setCanEnterNewPassword(false);
                toast({ message: result.message, type: 'danger' });
            }
        } catch (err) {
            setCanEnterNewPassword(false);
            alert('OTP verification failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // __Reset password handler
    const handlePWReset = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.trim() === '') {
            return alert('Enter a new password.');

        }

        try {
            setLoading(true);

            const response = await fetch(`${BASE_URL}/user/${resetEmail}/resetPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetEmail, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                toast({ message: result.message, type: 'success' });
                setFlipLoginCard(false);
                setTimeout(() => {
                    passwordResetToDefault();
                }, 2000);
            } else {
                toast({ message: result.message, type: 'danger' });
            }
        } catch (err) {
            alert('Failed to reset the password. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MyToast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            <div className="position-fixed fixed-top inset-0 py-5 bg-black2 blur-bg-1px login-modal">
                {/* Login form */}
                <div className='position-relative col-sm-8 col-md-6 col-lg-4 inx-inherit mx-2 mx-sm-auto mt-3 rounded'
                    style={{ animation: "flyInBottom .2s 1" }}
                >
                    <XCircle size={40} fill='var(--bs-light)' className='position-absolute top-0 ms-auto me-md-auto opacity-75 clickDown ptr'
                        style={{ left: 0, right: 0, translate: "0 -120%" }}
                        onClick={() => { resetForm(); setShowLogin(false); }}
                    />
                    <div className={`rad-inherit login-otp-container ${flipLoginCard ? 'flipped' : ''} flip-card`}>
                        {/* Front side */}
                        <div className='p-3 rad-inherit flip-card_front front-side'>
                            <div className='h5 mb-4 text-center font-variant-small-caps'>Login</div>
                            <form onSubmit={handleLogin}>
                                <div className={`form-input-element`}>
                                    <input
                                        type="email"
                                        id={loginId + "Email"}
                                        // id="signInEmail"
                                        className="form-control form-control-lg no-css-validation"
                                        value={email}
                                        required
                                        onChange={e => { handleChange(e); setEmail(e.target.value) }}
                                    />
                                    <label htmlFor={loginId + "Email"} className="form-label">Email</label>
                                </div>
                                <div className={`form-input-element`}>
                                    <input
                                        type="password"
                                        id={loginId + "Password"}
                                        className="form-control form-control-lg no-css-validation"
                                        value={password}
                                        required
                                        onChange={e => { handleChange(e); setPassword(e.target.value) }}
                                    />
                                    <label htmlFor={loginId + "Password"} className="form-label">Password</label>
                                </div>
                                {error &&
                                    <div className='alert alert-warning'>
                                        <div className='smaller'>
                                            {error}
                                        </div>
                                    </div>
                                }

                                <div className="pt-1 mt-4 mb-2">
                                    <button type="submit" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 clickDown">
                                        LOGIN <CaretRight size={15} className='ms-2' />
                                    </button>
                                </div>
                                <div className='d-grid gap-2 place-items-center'>
                                    <div className="d-grid w-fit mx-auto text-primary fs-75 ptr"
                                        onClick={() => setFlipLoginCard(true)}
                                    >
                                        Forgot password?
                                    </div>
                                    <DividerText className="mb-3" />
                                    <Link to="/login" className="flex-align-center w-fit mx-auto small text-dark text-decoration-none">
                                        Create account <UserCirclePlus size={20} weight='fill' className='ms-2' />
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Back side */}
                        <div className='p-3 rad-inherit flip-card_back back-side'>
                            <div className='h5 mb-4 text-center font-variant-small-caps'>Reset Password</div>
                            <form onSubmit={handlePWResetRequest}>
                                {!canEnterOtp &&
                                    <div>
                                        {/* Resep PW Request from */}
                                        {resetError ?
                                            <div className="toast show bg-warning w-100 border-0 shadow-none">
                                                <div className="toast-header smaller">
                                                    Something went wrong
                                                </div>
                                                <div className="toast-body text-center pt-4 text-muted " style={{ backgroundColor: "var(--bs-toast-header-bg)", lineHeight: 1.2 }}>
                                                    Could not send the code. Please check your network and try again.
                                                    <span className='btn btn-sm d-block mx-auto mt-3 text-secondary border-secondary border-opacity-25 rounded-pill ' onClick={() => setResetError(false)}>Try again</span>
                                                </div>
                                            </div>
                                            :
                                            <div className="toast show w-100 border-0 shadow-none">
                                                <div className="toast-body">
                                                    <div className={`form-input-element`}>
                                                        <input
                                                            type="email"
                                                            id={resetId + "Email"}
                                                            placeholder="Enter email"
                                                            className="form-control form-control-lg no-css-validation"
                                                            value={resetEmail}
                                                            required
                                                            onChange={e => { handleChange(e); setResetEmail(e.target.value) }}
                                                        />
                                                        <label htmlFor={resetId + "Email"} className="form-label">User Email</label>
                                                    </div>

                                                    <div className="pt-1 mt-4 mb-2">
                                                        {!loading ?
                                                            <button type="submit" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 clickDown"
                                                                onClick={handlePWResetRequest}
                                                            >
                                                                SUBMIT <CaretRight size={15} className='ms-2' />
                                                            </button>
                                                            :
                                                            <button type="button" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 ptr-none"
                                                            >
                                                                WORKING <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                            </button>
                                                        }
                                                    </div>
                                                    <div>
                                                        If this email is registered, you will receive a reset code
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                                {canEnterOtp && !canEnterNewPassword &&
                                    <div>
                                        {/* OTP verificatio from */}
                                        <div className="toast show w-100 border-0 shadow-none">
                                            <div className="toast-body">
                                                <div className='text-center'>
                                                    Enter the verification code sent to your email.
                                                </div>
                                                <div className="flex-center gap-2 mt-3">
                                                    {Array.from({ length: 6 }, (_, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            className="border border-2 border-dark border-opacity-50 rounded text-center otp-box no-css-validation"
                                                            value={otpNumber[`otpNum${index + 1}`]}
                                                            maxLength={1}
                                                            required
                                                            ref={(el) => otpInputRefs.current[index] = el}
                                                            onChange={(e) => handleOTPChange(e, index)}
                                                            onKeyUp={(e) => handleOTPChange(e, index)}
                                                        />
                                                    ))}
                                                </div>
                                                <CtaTextButton
                                                    text="Didn't receive the code?"
                                                    actionText="Resend"
                                                    action={() => handlePWResetRequest()}
                                                    icon={loading && <span className="spinner-grow spinner-grow-sm ms-2"></span>}
                                                    type='gray-200'
                                                    textFallbackColor='gray-700'
                                                />
                                                <div className="pt-1 mt-4 mb-2">
                                                    <button type="submit" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 clickDown"
                                                        onClick={handleOTPVerification}
                                                    >
                                                        VERIFY
                                                        {!loading ?
                                                            <CaretRight size={15} className='ms-2' />
                                                            : <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {canEnterNewPassword &&
                                    <div>
                                        {/* Reset PW from */}
                                        <div className="toast show w-100 border-0 shadow-none">
                                            <div className="toast-body">
                                                <div className={`form-input-element`}>
                                                    <input
                                                        type="password"
                                                        id={resetPW1d + "Pasword"}
                                                        className="form-control form-control-lg no-css-validation"
                                                        value={newPassword}
                                                        required
                                                        onChange={e => { handleChange(e); setNewPassword(e.target.value) }}
                                                    />
                                                    <label htmlFor={resetPW1d + "Pasword"} className="form-label">New Password</label>
                                                </div>
                                                <div className={`form-input-element`}>
                                                    <input
                                                        type="password"
                                                        id={resetPW1d + "Pasword_Confirm"}
                                                        className="form-control form-control-lg no-css-validation"
                                                        value={newPasswordConfirm}
                                                        required
                                                        onChange={e => { handleChange(e); setNewPasswordConfirm(e.target.value) }}
                                                    />
                                                    <label htmlFor={resetPW1d + "Pasword_Confirm"} className="form-label">Repeat Password</label>
                                                </div>

                                                <div className="pt-1 mt-4 mb-2">
                                                    {!loading ?
                                                        <button type="submit" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 clickDown"
                                                            disabled={canResetPassword === false}
                                                            onClick={handlePWReset}
                                                        >
                                                            RESET PASSWORD <CaretRight size={15} className='ms-2' />
                                                        </button>
                                                        :
                                                        <button type="button" className="btn btn-sm btn-dark flex-center mb-4 px-3 py-2 rounded-pill w-100 fs-75 ptr-none"
                                                        >
                                                            WORKING <span className="spinner-grow spinner-grow-sm ms-2"></span>
                                                        </button>
                                                    }
                                                </div>
                                                <ul className='list-style-square small'>
                                                    <li>At least 8 characters long</li>
                                                    <li>Mix of letters and numbers</li>
                                                    <li>At least 1 special character</li>
                                                    <li>At least 1 lowercase and 1 uppercase letters</li>
                                                    <li>Password matches</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className='d-grid gap-2 pb-5 place-items-center'>
                                    <DividerText className="mb-3" />
                                    {/* Reset PW reset states */}
                                    <div className="flex-align-center w-fit mx-auto small text-dark ptr"
                                        onClick={() => passwordResetToDefault()}
                                    >
                                        LOGIN <SignIn size={20} weight='fill' className='ms-2' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
