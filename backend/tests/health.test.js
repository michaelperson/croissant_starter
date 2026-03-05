const request = require('supertest')
const app = require('../server')

describe('GET /api/health', () => {
  it('renvoie 200 avec les infos de santé', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('version')
    expect(res.body).toHaveProperty('timestamp')
  })
})
