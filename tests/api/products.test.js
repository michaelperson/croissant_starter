const request = require('supertest')
const app     = require('../../backend/server')

describe('GET /api/products', () => {
  it('renvoie un tableau de produits', async () => {
    const res = await request(app).get('/api/products')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('filtre par catégorie', async () => {
    const res = await request(app).get('/api/products?category=viennoiserie')
    expect(res.statusCode).toBe(200)
    res.body.forEach(p => expect(p.category).toBe('viennoiserie'))
  })

  it('chaque produit a les champs obligatoires', async () => {
    const res = await request(app).get('/api/products')
    res.body.forEach(p => {
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('price')
      expect(p).toHaveProperty('category')
    })
  })
})
