import React, { useState, useEffect, useContext } from "react";
import "../assets/styles/profile.css";
import api from "../apis/api";
import { images } from "../assets/images/images";
import { AuthContext } from "../ui/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import useUserData from "../hooks/useUserData";

const ProfilePage = () => {
  const { onLogout } = useContext(AuthContext);
  const {userInfo, setUserInfo} = useUserData();
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    api
      .patch("update_user_profile/", userInfo)
      .then(() => {
        setEditing(false);
        navigate("/profile")
      })
      .catch((err) => {
        console.error("Error updating profile:", err.message);
      });
  };


  const logout = () => {
    onLogout()
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <img
          src={images.profile_pic}
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <div className="profile-info">
        {editing ? (
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="button"
              className="btn save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p>
              <strong>Username:</strong> {userInfo.username}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Address:</strong> {userInfo.address || "Not provided"}
            </p>
            <p className="change-pass-link">
              <span onClick={() => navigate('/change-password')}>Change Password</span>
            </p>
            <button
              onClick={() => setEditing(true)}
              className="btn edit-btn"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <Link to="/order-summary" className="btn orders-btn">
          My Orders
        </Link>
        <button className="btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
