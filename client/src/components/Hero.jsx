import './Hero.css';
import heroBackground from '../assets/hero section.png';

function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('.product-grid-container');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className="hero-content">
        <h1 className="hero-title">NEXORA</h1>
        <p className="hero-subtitle">Redefining Modern Luxury</p>
        <p className="hero-description">
          Discover our curated collection of premium apparel and accessories
        </p>
        <button className="hero-cta" onClick={scrollToProducts}>
          Explore Collection
        </button>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
}

export default Hero;
