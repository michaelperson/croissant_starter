const express = require('express')
const Order   = require('../models/Order')
const router  = express.Router()

// POST /api/orders — créer une nouvelle commande
router.post('/', async (req, res, next) => {
  try {
    const { customer, items, totalPrice } = req.body

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ error: 'Nom et email client requis.' })
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La commande doit contenir au moins un article.' })
    }

    const order = new Order({
      customer,
      items,
      totalPrice,
      status: 'received'
    })

    await order.save()
    console.log(`📦 Nouvelle commande : ${order._id} — ${customer.name}`)
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id — récupérer une commande
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean()
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' })
    res.json(order)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id/status — récupérer uniquement le statut
router.get('/:id/status', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).select('status').lean()
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' })
    res.json({ status: order.status })
  } catch (err) {
    next(err)
  }
})

module.exports = router
