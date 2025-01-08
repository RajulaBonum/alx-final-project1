import React, { useState } from 'react';
import api from '../apis/api'; // Ensure api is correctly imported
import styles from '../assets/styles/ForgotPassword.module.css'; // CSS module

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        api.post("pass/send-reset-email/", { email })
            .then((res) => {
                alert("Password reset email sent!")
                console.log(res.data)
            })
            .catch((err) => alert(err.response.data.error));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Forgot Password</h2>
            <p className={styles.subtext}>
                Enter your email address below, and we’ll send you a link to reset your password.
            </p>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <button className={styles.button} onClick={handleSubmit}>
                    Send Reset Email
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
