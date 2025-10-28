import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import moonIcon from './assets/moon.png';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="App">
          <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
              <div className="header-left">
                <Link to="/" className="nav-link">BRAND</Link>
              </div>
              <Link to="/" className="logo">
                NEXORA
              </Link>
              <nav className="header-right">
                <button className="theme-toggle-btn" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                  {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <img src={moonIcon} alt="Dark mode" width="20" height="20" />
                  )}
                </button>
                <Link to="/cart" className="nav-link cart-link">
                  BAG ({cartCount})
                </Link>
              </nav>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductGrid onCartUpdate={setCartCount} />} />
              <Route path="/cart" element={<Cart onCartUpdate={setCartCount} />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
