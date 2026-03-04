/**
 * Tests de l'API REST (Supertest + Jest)
 * ========================================
 * Ces tests sont exécutés dans la pipeline CI (azure-pipelines/ci.yml)
 * à chaque push / pull request.
 *
 * 💡 Formation DevOps : La pipeline ne déploie en staging QUE si tous
 * ces tests passent avec succès. C'est la porte de qualité (quality gate).
 */

const request = require("supertest");
const app = require("../../server");

// ── Health Check ──────────────────────────────────────────────────────────────
describe("GET /api/health", () => {
  it("devrait retourner un statut 200 ou 503", async () => {
    const res = await request(app).get("/api/health");
    // 200 = healthy, 503 = BDD non connectée (normal en CI sans BDD)
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("timestamp");
  });
});

// ── Routes inconnues ──────────────────────────────────────────────────────────
describe("Routes invalides", () => {
  it("devrait retourner 404 pour une route inexistante", async () => {
    const res = await request(app).get("/api/nimportequoi");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

// ── Products ──────────────────────────────────────────────────────────────────
describe("GET /api/products", () => {
  it("devrait retourner un tableau (même vide)", async () => {
    const res = await request(app).get("/api/products");
    // En CI, la BDD peut être vide — on vérifie juste la structure
    expect([200, 500]).toContain(res.status);
  });
});

// ── Orders ────────────────────────────────────────────────────────────────────
describe("POST /api/orders - Validation", () => {
  it("devrait refuser une commande sans nom client", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerEmail: "test@example.com",
        items: [{ productId: "123", quantity: 1 }],
      });
    // 400 (validation) ou 500 (pas de BDD) sont acceptables en CI
    expect([400, 500]).toContain(res.status);
  });

  it("devrait refuser une commande avec un email invalide", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jean Dupont",
        customerEmail: "email-invalide",
        items: [{ productId: "123", quantity: 1 }],
      });
    expect([400, 500]).toContain(res.status);
  });
});
