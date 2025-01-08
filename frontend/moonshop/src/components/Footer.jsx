import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { AuthContext } from '../ui/AuthContext';

const Footer = () => {
    const { isAuthenticated } = useContext(AuthContext)
  return (
    <footer style={{ backgroundColor: "#031926", color: "#EDFFEC" }}>
        <div className="footer-container">
            <div className="quick-nav">
                <Link to="/" className="quick-nav-item" style={{ color: "#F08700" }}>
                    Home
                </Link>
                <Link to="/products" className="quick-nav-item" style={{ color: "#F08700" }}>
                    Products
                </Link>
                <Link to="/about" className="quick-nav-item" style={{ color: "#F08700" }}>
                    About Us
                </Link>
                {isAuthenticated ? (
                    <Link to="/profile" className="quick-nav-item" style={{ color: "#F08700" }}>
                        Profile
                    </Link> )
                    : (
                    <Link to="/login" className="quick-nav-item" style={{ color: "#F08700" }}>
                        Login
                    </Link>)
                }
            </div>
            <div className="quick-contact">
                <div>Call, Text, WhatsApp</div>
                <div>+254 792 447497</div>
                <div>Email: moonprintsafrica@gmail.com</div>
            </div>
            <div className="social-icons" style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <a href="https://www.facebook.com/profile.php?id=100094186466567&mibextid=ZbWKwL" style={{ color: "#F08700" }}><FaFacebookF size={24} /></a>
                <a href="https://x.com/Moonprints_254?t=4KbdOf0zQCjDcnkK89XsWQ&s=09" style={{ color: "#F08700" }}><FaTwitter size={24} /></a>
                <a href="https://www.instagram.com/moon_prints254?igsh=MW5tdGw4emJ4YTJhdQ==" target='blank' style={{ color: "#F08700" }}><FaInstagram size={24} /></a>
            </div>
        </div>
        <hr className="footer-line" style={{ borderColor: "#EDFFEC" }} />
        <p className="footer-note" style={{ marginBottom: "10px" }}>&copy; {new Date().getFullYear()} Moonprints-Africa. All rights reserved</p>
    </footer>
  );
};

export default Footer;