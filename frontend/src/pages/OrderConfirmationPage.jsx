import { Link, useParams } from 'react-router-dom'
import styles from './OrderConfirmationPage.module.css'

export default function OrderConfirmationPage() {
  const { id } = useParams()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1>Commande confirmée !</h1>
        <p>Merci pour votre commande. Vos viennoiseries sont en préparation !</p>
        <div className={styles.orderId}>
          <span>Numéro de commande :</span>
          <strong>{id}</strong>
        </div>
        <div className={styles.actions}>
          <Link to={`/suivi/${id}`} className="btn btn-primary">Suivre ma commande</Link>
          <Link to="/" className="btn btn-secondary">Retour au menu</Link>
        </div>
      </div>
    </div>
  )
}
