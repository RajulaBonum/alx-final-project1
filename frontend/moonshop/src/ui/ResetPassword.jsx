import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // For accessing `uid` and `token` from URL
import api from '../apis/api'; // Ensure this is correctly imported
import styles from '../assets/styles/ResetPassword.module.css'; // CSS module for styling

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { uid, token } = useParams(); // Assuming `uid` and `token` are in the URL

    const handleReset = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        api.post(`pass/reset-password/${uid}/${token}/`, { password })
            .then(() => {
                setSuccessMessage('Password reset successful!');
                setErrorMessage('');
                setPassword('');
                setConfirmPassword('');
                navigate('/login')
            })
            .catch((err) => {
                setErrorMessage(err.response?.data?.error || 'An error occurred.');
                setSuccessMessage('');
            });
    };
    

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Reset Password</h2>
            <p className={styles.subtext}>Enter your new password below.</p>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleReset} className={styles.button}>
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
