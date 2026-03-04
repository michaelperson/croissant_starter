import { useParams, Link } from 'react-router-dom'
import styles from './OrderTrackingPage.module.css'

const STEPS = [
  { key: 'received',    label: 'Commande reçue',     icon: '📋' },
  { key: 'preparing',  label: 'En préparation',       icon: '👨‍🍳' },
  { key: 'baking',     label: 'Au four',              icon: '🔥' },
  { key: 'ready',      label: 'Prête pour livraison', icon: '📦' },
  { key: 'delivered',  label: 'Livrée !',             icon: '🎉' },
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  // Pour la démo, on simule le statut "baking"
  const currentStep = 2

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Suivi de commande</h1>
        <p className={styles.orderId}>#{id}</p>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className={`${styles.step} ${i < currentStep ? styles.done : ''} ${i === currentStep ? styles.active : ''}`}
            >
              <div className={styles.stepDot}>
                {i <= currentStep ? step.icon : '○'}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`${styles.connector} ${i < currentStep ? styles.connectorDone : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className={styles.eta}>
          <span>⏱ Temps estimé :</span>
          <strong>12–18 minutes</strong>
        </div>

        <Link to="/" className="btn btn-secondary" style={{ marginTop: 'var(--space-lg)' }}>
          Retour au menu
        </Link>
      </div>
    </div>
  )
}
