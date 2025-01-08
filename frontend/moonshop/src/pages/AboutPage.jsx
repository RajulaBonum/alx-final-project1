// This is the about page component
import React from 'react'
import '../assets/styles/about.css';

const AboutPage = () => {
  return (
    <div className='about-container'>
        <div className="about-header">
            <h1>About Us</h1>
            <p className="about-intro">Moonprints-Africa: "Prints that Tell Your Story".</p>
        </div>
        <section className="about-section">
            <h2>Who We Are</h2>
            <p>
            At <b>MoonPrints-Africa</b>, we are more than just a branding company; we are storytellers. Our passion lies in helping individuals, businesses, and organizations transform their unique stories into impactful branded merchandise. From sleek T-shirts to cozy hoodies, stylish caps, custom mugs, eye-catching banners, and more, we bring your ideas to life with creativity and precision.<br></br>
            Based in <b>Kenya</b>, we take pride in our roots and celebrate the diverse voices that make our continent unique. With an unwavering commitment to quality, innovation, and customer satisfaction, MoonPrints-Africa is your trusted partner for all your branding needs.
            </p>
        </section>
        <section className="about-section">
            <h2>Our Mission</h2>
            <p>
            Our mission is to empower people to express themselves and their stories through high-quality, custom-branded merchandise. We strive to bridge creativity and functionality, ensuring that every product we create reflects individuality, professionalism, and purpose.
            <br />
            We aim to inspire a culture of self-expression, foster creativity, and create lasting impressions for our clients—one print at a time.
            </p>
        </section>
        <section className="about-section">
            <h2>Our Vision</h2>
            <p>
            At MoonPrints-Africa, we envision a world where everyone’s story is boldly told and celebrated. We aspire to become Africa’s leading branding and merchandise company, recognized for our innovative designs, exceptional craftsmanship, and unwavering commitment to excellence.
            <br />
            Through our work, we aim to leave a legacy of empowerment, creativity, and community, helping individuals and brands make their mark in the world.
            </p>
        </section>
        <section className="about-section">
            <h2>Meet Our Founders</h2>
            <p>
            The story of MoonPrints-Africa began with a shared dream: to create a platform where creativity meets purpose. Our founders, are passionate visionaries with extensive experience in branding, design, and storytelling.

            Driven by a desire to help people and businesses express their identities, they combined their expertise and entrepreneurial spirit to bring MoonPrints-Africa to life. Their dedication to quality, innovation, and customer satisfaction has been the foundation of our success.
            <br />
            Together, they lead a team of talented designers, craftsmen, and storytellers who work tirelessly to turn your ideas into masterpieces.
            </p>
        </section>
    </div>
  )
}

export default AboutPage