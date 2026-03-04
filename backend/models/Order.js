const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 }
})

const orderSchema = new mongoose.Schema({
  customer: {
    name:  { type: String, required: true },
    email: { type: String, required: true }
  },
  items:      [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: {
    type:    String,
    enum:    ['received', 'preparing', 'baking', 'ready', 'delivered'],
    default: 'received'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
