import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { totalItems } = useCart()
  const location = useLocation()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>🥐</span>
          <span className={styles.brandName}>Coissant <sup>2.0</sup></span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={location.pathname === '/' ? styles.activeLink : styles.link}>
            Menu
          </Link>
          <Link to="/panier" className={styles.cartBtn}>
            <span>Panier</span>
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
