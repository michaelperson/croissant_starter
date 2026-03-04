import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import styles from './ProductCard.module.css'

const CATEGORY_EMOJI = {
  viennoiserie: '🥐',
  sandwich:     '🥖',
  patisserie:   '🍰',
  boisson:      '☕',
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded]     = useState(false)
  const [animate, setAnimate] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setAnimate(true)
    setTimeout(() => { setAdded(false); setAnimate(false) }, 1500)
  }

  return (
    <article className={`${styles.card} ${animate ? styles.cardAdded : ''}`}>
      <div className={styles.imageWrapper}>
        <span className={styles.emoji}>{CATEGORY_EMOJI[product.category] || '🍞'}</span>
        {product.isNew && <span className={styles.badgeNew}>Nouveau</span>}
        {product.allergens?.includes('gluten') && (
          <span className={styles.badgeAllergen} title="Contient du gluten">⚠️</span>
        )}
      </div>

      <div className={styles.body}>
        <div>
          <span className={styles.category}>{product.category}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toFixed(2)} €</span>
          <button
            className={`${styles.addBtn} ${added ? styles.addBtnSuccess : ''}`}
            onClick={handleAdd}
            disabled={!product.available}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {!product.available ? 'Indisponible' : added ? '✓ Ajouté !' : '+ Ajouter'}
          </button>
        </div>
      </div>
    </article>
  )
}
