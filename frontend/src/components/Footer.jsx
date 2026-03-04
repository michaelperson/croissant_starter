import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span>🥐</span>
          <strong>CroissantExpress</strong>
        </div>
        <p className={styles.tagline}>Frais du four, livrés à votre porte — depuis 1987</p>
        <p className={styles.copy}>© {year} CroissantExpress — Projet de formation Azure DevOps</p>
      </div>
    </footer>
  )
}
