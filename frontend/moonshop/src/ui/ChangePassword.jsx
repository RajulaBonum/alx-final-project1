import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/changePass.css';
import api from '../apis/api';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation do not match!");
            return;
        }
        api.post("pass/change-password/", { current_password: currentPassword, new_password: newPassword })
            .then(() => {
                alert("Password updated successfully!");
                navigate('/profile');
            })
            .catch((err) => alert(err.response.data.error));
    };

    return (
        <div className="change-pass-container">
            <h2>Change Your Password</h2>
            <form className="change-pass-form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Update Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
