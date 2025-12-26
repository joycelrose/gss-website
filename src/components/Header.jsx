import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import siteConfig from "../config/siteConfig";
import "./Header.css";

const Header = () => {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <header className="main-header">
      <div className="topbar">
        <div className="topbar-inner">
          {/* LEFT */}
          <div className="topbar-col left">
            <span className="contact-info">
              ✉️ {siteConfig.email}
            </span>
            <span className="contact-info">
              📞 {siteConfig.contacts?.[0]?.number}
            </span>
          </div>

          {/* CENTER */}
          <div className="topbar-col center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/iconGSS.png" alt="GSS Logo" style={{ height: 48, width: 48, objectFit: 'contain', marginRight: 10 }} />
            <span className="logo-text">{siteConfig.businessName}</span>
          </div>

          {/* RIGHT */}
          <div className="topbar-col right">
            <Link to="/cart" className="order-btn">
              CART {count > 0 && `(${count})`}
            </Link>
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <Link to="/">HOME</Link>
        <Link to="/shop">SHOP</Link>
        <Link to="/contact">CONTACT</Link>
      </nav>
    </header>
  );
};

export default Header;
