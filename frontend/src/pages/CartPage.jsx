import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { ordersAPI } from '../utils/api'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { cart, updateQty, removeItem, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const handleOrder = async () => {
    if (!customerName || !customerEmail) {
      alert('Veuillez renseigner votre nom et email.')
      return
    }
    setSubmitting(true)
    try {
      const order = await ordersAPI.create({
        customer: { name: customerName, email: customerEmail },
        items: cart.items.map(i => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        totalPrice
      })
      clearCart()
      navigate(`/commande/${order._id || 'demo-' + Date.now()}`)
    } catch {
      // Mode demo : on simule une commande
      clearCart()
      navigate(`/commande/demo-${Date.now()}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits depuis notre menu pour commencer votre commande.</p>
        <Link to="/" className="btn btn-primary">Voir le menu</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
      <h1 className={styles.title}>Votre Panier</h1>

      <div className={styles.layout}>
        {/* Liste des articles */}
        <section className={styles.items}>
          {cart.items.map(item => (
            <div key={item._id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{item.price.toFixed(2)} €</span>
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => updateQty(item._id, item.quantity - 1)} className={styles.qtyBtn}>−</button>
                <span className={styles.qty}>{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)} className={styles.qtyBtn}>+</button>
                <button onClick={() => removeItem(item._id)} className={styles.removeBtn} title="Supprimer">🗑</button>
              </div>
              <span className={styles.lineTotal}>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </section>

        {/* Récapitulatif & formulaire */}
        <aside className={styles.summary}>
          <h2>Récapitulatif</h2>

          <div className={styles.summaryRow}>
            <span>Sous-total</span>
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Livraison</span>
            <strong>Gratuite 🎉</strong>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>

          <hr style={{ borderColor: 'var(--color-sand)', margin: 'var(--space-md) 0' }} />

          <div className={styles.form}>
            <label className={styles.label}>Votre nom</label>
            <input
              className={styles.input}
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Marie Dupont"
            />
            <label className={styles.label}>Votre email</label>
            <input
              className={styles.input}
              type="email"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              placeholder="marie@exemple.fr"
            />
          </div>

          <button
            className={styles.orderBtn}
            onClick={handleOrder}
            disabled={submitting}
          >
            {submitting ? 'Envoi en cours...' : '🛍 Passer la commande'}
          </button>
        </aside>
      </div>
    </div>
  )
}
