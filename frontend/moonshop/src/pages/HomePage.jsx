import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Accordion from 'react-bootstrap/Accordion';
import { images } from '../assets/images/images';
import '../assets/styles/home.css';
import '../assets/styles/products.css';
import ProductItem from '../components/ProductItem';
import useProductData from '../hooks/useProductData';
import { randomValue } from '../GenerateCartCode';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { products } = useProductData();

    useEffect(() => {
        if (!localStorage.getItem("cart_code")) {
            localStorage.setItem("cart_code", randomValue);
        }
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="carousel-container">
                <Carousel>
                    <Carousel.Item>
                        <img src={images.hero_1} alt="Showcase your style" />
                        <Carousel.Caption>
                            <h3>Custom Branding</h3>
                            <p>Stand out with personalized designs for every occasion.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={images.hero_2} alt="Quality merchandise" />
                        <Carousel.Caption>
                            <h3>Premium Quality</h3>
                            <p>Products crafted to perfection for a lasting impression.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={images.hero_3} alt="Timely delivery" />
                        <Carousel.Caption>
                            <h3>Timely Delivery</h3>
                            <p>On time, every time – your satisfaction guaranteed.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>

            {/* Product Section */}
            <div className="product-section">
                <h2>Our Products</h2>
                <div className="product-container">
                    {products.slice(0, 8).map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
            <Link to="/products" className="more-btn">
                View More Products
            </Link>

            {/* Why Us Section */}
            <div className="why-section">
                <h2>Why Choose Us?</h2>
                <div className="why-container">
                    <div className="why-card">
                        <img src={images.fast} alt="Fast delivery" />
                        <p>Fast and reliable delivery service.</p>
                    </div>
                    <div className="why-card">
                        <img src={images.quality} alt="Top quality products" />
                        <p>Uncompromised quality in every product.</p>
                    </div>
                    <div className="why-card">
                        <img src={images.timely} alt="Exceptional support" />
                        <p>Dedicated support whenever you need us.</p>
                    </div>
                </div>
            </div>

            {/* FAQs Section */}
            <div className="faq-section">
                <h2>Frequently Asked Questions (FAQs)</h2>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>1. What services does MoonPrints-Africa offer?</Accordion.Header>
                        <Accordion.Body>
                        At MoonPrints-Africa, we specialize in custom branding and merchandise creation. Our services include designing and printing logos, slogans, and artwork on various products such as T-shirts, hoodies, caps, mugs, banners, and more. Whether you need personalized items for events, promotional materials for businesses, or unique gifts, we’ve got you covered.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>2. Can I create my own designs?</Accordion.Header>
                        <Accordion.Body>
                        Absolutely! We love bringing your creative ideas to life. You can provide us with your design, logo, or artwork, and our team will ensure it looks amazing on your chosen product. Don’t have a design yet? No problem! Our talented design team can work with you to create something unique and personalized.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>3. Do you offer bulk discounts?</Accordion.Header>
                        <Accordion.Body>
                        Yes, we do! If you’re ordering in bulk, whether for corporate events, team uniforms, or promotional giveaways, we offer competitive pricing and discounts. Contact us directly for a custom quote based on your order size.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
};

export default HomePage;
