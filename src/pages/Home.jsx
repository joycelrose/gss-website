import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/home.css';
import heroImages from '../config/HomeConfig';

function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Slightly slower for better viewing
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home-container">
      {/* HERO HERO SLIDER */}
      <section className="hero-section">
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.caption}
            className="hero-image"
            style={{
              display: index === current ? 'block' : 'none',
              animation: 'fadeIn 0.8s ease-in-out'
            }}
          />
        ))}

        <div className="hero-caption">
          <h2 className="hero-text">{heroImages[current].caption}</h2>
        </div>
      </section>

      {/* TEXT CONTENT */}
      <section className="introduction-section">
        <h1 className="intro-title">
          Garg Saree Sarowar
        </h1>
        <p className="intro-text">
          Discover our exclusive collection of bridal lehengas and sarees. Experience elegance, tradition, and style in every drape.
        </p>

        <Link to="/shop" className="explore-btn">
          Explore Collection
          <span>→</span>
        </Link>
      </section>
    </main>
  );
}

export default Home;
