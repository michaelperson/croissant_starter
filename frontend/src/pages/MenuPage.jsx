import { useState, useEffect } from 'react'
import { productsAPI } from '../utils/api'
import ProductCard from '../components/ProductCard'
import styles from './MenuPage.module.css'

const CATEGORIES = ['Tous', 'viennoiserie', 'sandwich', 'patisserie', 'boisson']

// Données de fallback si l'API n'est pas disponible (utile en développement)
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Croissant au beurre', category: 'viennoiserie', description: 'Notre croissant signature, feuilleté à la main chaque matin avec du beurre AOP.', price: 1.80, available: true, isNew: false, allergens: ['gluten', 'lactose'] },
  { _id: '2', name: 'Pain au chocolat', category: 'viennoiserie', description: 'Deux barres de chocolat noir Valrhona dans une pâte feuilletée dorée.', price: 2.10, available: true, isNew: false, allergens: ['gluten', 'lactose'] },
  { _id: '3', name: 'Croissant Matcha', category: 'viennoiserie', description: 'Notre nouvelle création : feuilleté au matcha japonais bio, garni de crème au beurre.', price: 3.50, available: true, isNew: true, allergens: ['gluten', 'lactose'] },
  { _id: '4', name: 'Sandwich Jambon-Beurre', category: 'sandwich', description: 'Le classique parisien : jambon de Paris, beurre doux, baguette tradition.', price: 4.50, available: true, isNew: false, allergens: ['gluten'] },
  { _id: '5', name: 'Tarte aux fraises', category: 'patisserie', description: 'Fond de tarte sablé, crème pâtissière vanille, fraises Gariguette.', price: 5.20, available: true, isNew: false, allergens: ['gluten', 'lactose', 'oeufs'] },
  { _id: '6', name: 'Café Crème', category: 'boisson', description: 'Espresso double extrait sur mousse de lait entier chaud.', price: 3.20, available: true, isNew: false, allergens: ['lactose'] },
  { _id: '7', name: 'Millefeuille Vanille', category: 'patisserie', description: 'Trois couches de pâte feuilletée, crème pâtissière à la vanille de Madagascar.', price: 5.80, available: false, isNew: false, allergens: ['gluten', 'lactose', 'oeufs'] },
  { _id: '8', name: 'Jus d\'orange pressé', category: 'boisson', description: 'Pressé à la commande, oranges sanguines en saison.', price: 4.00, available: true, isNew: false, allergens: [] },
]

export default function MenuPage() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [activeCategory, setActiveCategory] = useState('Tous')

  useEffect(() => {
    productsAPI.getAll()
      .then(data => setProducts(data))
      .catch(() => {
        // En cas d'erreur API, on utilise les données mock
        setProducts(MOCK_PRODUCTS)
        setError('Mode hors-ligne — données de démonstration')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'Tous'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div className={styles.page}>
      {/* En-tête hero */}
      <section className={styles.hero}>
        <h1>Notre Menu</h1>
        <p>Sélection artisanale renouvelée chaque matin dans nos 47 boutiques.</p>
      </section>

      <div className="container">
        {/* Message mode hors-ligne */}
        {error && (
          <div className={styles.offlineBanner}>
            ⚠️ {error}
          </div>
        )}

        {/* Filtres par catégorie */}
        <div className={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? styles.filterActive : styles.filter}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Chargement du menu...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product, i) => (
              <div
                key={product._id}
                className="fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className={styles.empty}>Aucun produit dans cette catégorie pour le moment.</p>
        )}
      </div>
    </div>
  )
}
