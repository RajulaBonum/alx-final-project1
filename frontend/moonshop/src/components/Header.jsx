import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { images } from "../assets/images/images";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../ui/AuthContext";

const Header = ({ numCartItems }) => {
    const navigate = useNavigate();
    const { isAuthenticated, username, token, onLogout } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated && token) {
            onLogout();
            navigate("/");
        }
    }, [isAuthenticated, token, navigate, onLogout]);

    
    return (
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" className="navbar-brand">
                        Moonprints-Africa
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/" className="nav-link">
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/products" className="nav-link">
                                Products
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/about" className="nav-link">
                                About Us
                            </Nav.Link>
                            {isAuthenticated ? (
                                <>
                                    <Nav.Link as={NavLink} to="/profile" className="nav-link">{`Hi ${username}`}</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={NavLink} to="/login" className="nav-link">
                                    Login
                                </Nav.Link>
                            )}
                            <Nav.Link as={NavLink} to="/cart" className="nav-link">
                                <img className="cart-img" src={images.shop_cart} alt="Cart" />
                                {numCartItems > 0 && <span className="cart-count">({numCartItems})</span>}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <ToastContainer />
        </header>
    );
};

export default Header;
