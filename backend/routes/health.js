const express  = require('express')
const mongoose = require('mongoose')
const router   = express.Router()

/**
 * GET /api/health
 * Endpoint de santé — utilisé par Azure DevOps pour les health checks de pipeline
 * et par Azure App Service pour les sondages de disponibilité.
 */
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

  res.json({
    status:      'ok',
    version:     process.env.npm_package_version || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    database:    dbStatus,
    timestamp:   new Date().toISOString(),
    uptime:      Math.floor(process.uptime()) + 's'
  })
})

module.exports = router
