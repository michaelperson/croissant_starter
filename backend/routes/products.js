const express = require('express')
const Product = require('../models/Product')
const router  = express.Router()

// Données de seed pour la démonstration (chargées si la DB est vide)
const SEED_PRODUCTS = [
  { name: 'Croissant au beurre',  category: 'viennoiserie', description: 'Notre croissant signature, feuilleté à la main.', price: 1.80, available: true,  isNew: false, allergens: ['gluten', 'lactose'] },
  { name: 'Pain au chocolat',     category: 'viennoiserie', description: 'Deux barres Valrhona dans une pâte dorée.',         price: 2.10, available: true,  isNew: false, allergens: ['gluten', 'lactose'] },
  { name: 'Croissant Matcha',     category: 'viennoiserie', description: 'Feuilleté au matcha bio, crème au beurre.',         price: 3.50, available: true,  isNew: true,  allergens: ['gluten', 'lactose'] },
  { name: 'Sandwich Jambon-Beurre', category: 'sandwich',  description: 'Le classique parisien.',                            price: 4.50, available: true,  isNew: false, allergens: ['gluten'] },
  { name: 'Tarte aux fraises',    category: 'patisserie',  description: 'Fraises Gariguette, crème pâtissière vanille.',      price: 5.20, available: true,  isNew: false, allergens: ['gluten','lactose','oeufs'] },
  { name: 'Café Crème',           category: 'boisson',     description: 'Espresso double, mousse de lait entier.',            price: 3.20, available: true,  isNew: false, allergens: ['lactose'] },
  { name: 'Millefeuille Vanille', category: 'patisserie',  description: 'Vanille de Madagascar, pâte feuilletée.',            price: 5.80, available: false, isNew: false, allergens: ['gluten','lactose','oeufs'] },
  { name: "Jus d'orange pressé",  category: 'boisson',     description: 'Pressé à la commande.',                             price: 4.00, available: true,  isNew: false, allergens: [] },
]

// GET /api/products — liste tous les produits (avec filtre optionnel par catégorie)
router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {}
    let products

    if (require('mongoose').connection.readyState === 1) {
      products = await Product.find(filter).lean()
      if (products.length === 0) {
        // Premier lancement : on seed la base
        await Product.insertMany(SEED_PRODUCTS)
        products = await Product.find(filter).lean()
      }
    } else {
      // Sans DB : on renvoie les données statiques
      products = SEED_PRODUCTS.filter(p => !filter.category || p.category === filter.category)
        .map((p, i) => ({ ...p, _id: String(i + 1) }))
    }

    res.json(products)
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

module.exports = router
