import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

/**
 * Header — Barre de navigation principale
 * =========================================
 * Affiche le logo, les liens de navigation et le nombre d'articles dans le panier.
 */
function Header({ cartCount }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-emoji">🥐</span>
          <div className="logo-text">
            <span className="logo-name">Coissant</span>
            <span className="logo-version">2.0</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Menu
          </Link>
          <Link
            to="/panier"
            className={`nav-link cart-link ${isActive("/panier") ? "active" : ""}`}
          >
            Panier
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
