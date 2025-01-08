import React, { useContext, useState } from 'react';
import { images } from "../assets/images/images";
import '../assets/styles/login.css';
import api from '../apis/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../ui/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const { setIsAuthenticated, getUsername } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [action, setAction] = useState('Login');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userSignUpInfo, setSignUpInfo] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });

    const [error, setError] = useState("");

    const userInfo = { username, password };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (action === "Login") {
            api.post('token/', userInfo)
                .then(res => {
                    localStorage.setItem("access", res.data.access);
                    localStorage.setItem("refresh", res.data.refresh);
                    setUsername("");
                    setPassword("");
                    setError("");
                    setIsAuthenticated(true);
                    getUsername();

                    const from = location?.state?.from?.pathname || "/";
                    navigate(from, { replace: true });
                })
                .catch(err => {
                    setError("Invalid username or password.");
                    toast.error("Invalid username or password.");
                });
        } else if (action === "Sign Up") {
            if (userSignUpInfo.password1 !== userSignUpInfo.password2) {
                setError("Passwords do not match.");
                toast.error("Passwords do not match.");
                return;
            }

            api.post('register_user/', userSignUpInfo)
                .then(res => {
                    toast.success("Account created successfully. Please log in.");
                    setAction("Login");
                    setError("");
                    setSignUpInfo({
                        username: "",
                        email: "",
                        password1: "",
                        password2: "",
                    });
                })
                .catch(err => {
                    setError("Failed to create account. Please try again.");
                    toast.error("Failed to create account. Please try again.");
                });
        }
    };

    const handleSignUpChange = (e) => {
        setSignUpInfo({
            ...userSignUpInfo,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="signup-container">
            <div className="signup-header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="inputs" onSubmit={handleSubmit}>
                {action === "Login" ? (
                    <>
                        <div className="input">
                            <img src={images.person} alt="Person Icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={images.password} alt="Password Icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="forgot-pass-btn">
                            Forgot Password? <span onClick={() => navigate('/forgot-password')}>Reset</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input">
                            <img src={images.person} alt="Person Icon" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={userSignUpInfo.username}
                                onChange={handleSignUpChange}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={images.email} alt="Email Icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={userSignUpInfo.email}
                                onChange={handleSignUpChange}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={images.password} alt="Password Icon" />
                            <input
                                type="password"
                                name="password1"
                                placeholder="Password"
                                value={userSignUpInfo.password1}
                                onChange={handleSignUpChange}
                                required
                            />
                        </div>
                        <div className="input">
                            <img src={images.password} alt="Confirm Password Icon" />
                            <input
                                type="password"
                                name="password2"
                                placeholder="Confirm Password"
                                value={userSignUpInfo.password2}
                                onChange={handleSignUpChange}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="submit">
                    {action}
                </button>
            </form>

            <div className="submit-container">
                {action === "Login" ? (
                    <>
                        <div>
                            Don’t have an account? <span onClick={() => setAction("Sign Up")}>Sign Up</span>
                        </div>
                    </>
                ) : (
                    <div>
                        Already have an account? <span onClick={() => setAction("Login")}>Login</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
