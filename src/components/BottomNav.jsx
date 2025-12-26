import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './BottomNav.css';

const icons = {
  home: (
    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4c2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9" /><path d="M9 21V9h6v12" /></svg>
  ),
  shop: (
    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4c2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
  ),
  cart: (
    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4c2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
  ),
  search: (
    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4c2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  contact: (
    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d4c2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" /><polyline points="17 8 21 12 17 16" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
};

const BottomNav = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item${location.pathname === '/' ? ' active' : ''}`}>{icons.home}<span>Home</span></Link>
      <Link to="/shop" className={`bottom-nav-item${location.pathname === '/shop' ? ' active' : ''}`}>{icons.shop}<span>Shop</span></Link>
      <Link to="/cart" className={`bottom-nav-item${location.pathname === '/cart' ? ' active' : ''}`} style={{ position: 'relative' }}>
        {icons.cart}
        {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        <span>Cart</span>
      </Link>
      <Link to="/contact" className={`bottom-nav-item${location.pathname === '/contact' ? ' active' : ''}`}>{icons.contact}<span>Contact</span></Link>
      <Link to="/search" className={`bottom-nav-item${location.pathname === '/search' ? ' active' : ''}`}>{icons.search}<span>Search</span></Link>
    </nav>
  );
};

export default BottomNav;
