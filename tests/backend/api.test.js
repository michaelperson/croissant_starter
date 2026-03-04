const request = require('supertest');
const app     = require('../../backend/server');

describe('GET /api/health', () => {
  it('doit retourner status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/products', () => {
  it('doit retourner la liste des produits', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('doit filtrer par catégorie', async () => {
    const res = await request(app).get('/api/products?category=viennoiserie');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach(p => expect(p.category).toBe('viennoiserie'));
  });
});

describe('POST /api/orders', () => {
  const validOrder = {
    customerName:  'Marie Dupont',
    customerEmail: 'marie@example.com',
    store:         'Paris - République',
    items: [{ productId: 'p1', productName: 'Croissant Beurre', quantity: 2, unitPrice: 1.50 }],
  };

  it('doit créer une commande valide', async () => {
    const res = await request(app).post('/api/orders').send(validOrder);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('orderNumber');
    expect(res.body.data.totalAmount).toBe(3.00);
  });

  it('doit rejeter une commande incomplète', async () => {
    const res = await request(app).post('/api/orders').send({ customerName: 'Marie' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
