import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Axios, BASE_URL } from '../api/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMsg] = useState('');
    const navigate = useNavigate();
    

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await Axios.post(`${BASE_URL}/login`, {
                email: email,
                password: password
            });
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.message);
            }
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Auth} className="box">
                                <p className="has-text-centered">{message}</p>
                                <div className="field mt-5">
                                    <label className="label">Email or Username</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;