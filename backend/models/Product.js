const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true, enum: ['viennoiserie', 'sandwich', 'patisserie', 'boisson'] },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  available:   { type: Boolean, default: true },
  isNew:       { type: Boolean, default: false },
  allergens:   [{ type: String }]
}, {
  timestamps: true  // Ajoute createdAt et updatedAt automatiquement
})

module.exports = mongoose.model('Product', productSchema)
