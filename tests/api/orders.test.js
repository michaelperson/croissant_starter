const request = require('supertest')
const app     = require('../../backend/server')

const validOrder = {
  customer:   { name: 'Jean Test', email: 'jean@test.fr' },
  items:      [{ productId: '1', name: 'Croissant', price: 1.80, quantity: 2 }],
  totalPrice: 3.60
}

describe('POST /api/orders', () => {
  it('crée une commande valide', async () => {
    const res = await request(app).post('/api/orders').send(validOrder)
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.status).toBe('received')
  })

  it('rejette sans client', async () => {
    const res = await request(app).post('/api/orders').send({ items: validOrder.items })
    expect(res.statusCode).toBe(400)
  })

  it('rejette sans articles', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ customer: validOrder.customer, items: [], totalPrice: 0 })
    expect(res.statusCode).toBe(400)
  })
})
