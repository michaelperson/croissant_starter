require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')

const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const healthRouter = require('./routes/health')

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(helmet())  // Headers de sécurité
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }))
app.use(express.json())
app.use(morgan('combined'))  // Logs HTTP (utile pour Azure Monitor)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

// Route 404
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }))

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

// ─── Connexion MongoDB & démarrage ───────────────────────────────────────────
async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connecté à MongoDB')
  } else {
    console.log('⚠️  MONGODB_URI non défini — mode sans base de données')
  }

  app.listen(PORT, () => {
    console.log(`🥐 Coissant 2.0 API démarrée sur le port ${PORT}`)
    console.log(`   Environnement : ${process.env.NODE_ENV || 'development'}`)
  })
}

// Only start the server when run directly (not when imported by tests)
if (require.main === module) {
  start().catch(err => {
    console.error('Impossible de démarrer le serveur :', err)
    process.exit(1)
  })
}

module.exports = app  // Export pour les tests Jest
