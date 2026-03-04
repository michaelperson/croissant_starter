/**
 * Tests des composants React (Vitest + Testing Library)
 * =======================================================
 * Ces tests sont exécutés dans la pipeline CI.
 * Ils vérifient que les composants s'affichent correctement
 * sans avoir besoin d'une API réelle.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

// ── Données de test ───────────────────────────────────────────────────────────
const mockProduct = {
  _id: "test-123",
  name: "Croissant au Beurre",
  description: "Le croissant parfait",
  price: 1.8,
  category: "viennoiserie",
  allergens: ["gluten", "lactose"],
  available: true,
};

// ── ProductCard ───────────────────────────────────────────────────────────────
describe("ProductCard", () => {
  const renderCard = (props = {}) => {
    return render(
      <BrowserRouter>
        <ProductCard
          product={mockProduct}
          quantity={0}
          onAdd={vi.fn()}
          onRemove={vi.fn()}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it("affiche le nom du produit", () => {
    renderCard();
    expect(screen.getByText("Croissant au Beurre")).toBeInTheDocument();
  });

  it("affiche le prix correctement formaté", () => {
    renderCard();
    expect(screen.getByText("1.80 €")).toBeInTheDocument();
  });

  it("affiche les allergènes", () => {
    renderCard();
    expect(screen.getByText(/gluten/i)).toBeInTheDocument();
  });

  it("affiche le bouton 'Ajouter' quand quantity = 0", () => {
    renderCard({ quantity: 0 });
    expect(screen.getByRole("button", { name: /ajouter/i })).toBeInTheDocument();
  });

  it("affiche les contrôles de quantité quand quantity > 0", () => {
    renderCard({ quantity: 2 });
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText(/ajouter un article/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/retirer un article/i)).toBeInTheDocument();
  });

  it("appelle onAdd au clic sur 'Ajouter'", () => {
    const onAdd = vi.fn();
    renderCard({ onAdd });
    fireEvent.click(screen.getByRole("button", { name: /ajouter/i }));
    expect(onAdd).toHaveBeenCalledWith(mockProduct);
  });

  it("désactive le bouton si le produit est indisponible", () => {
    renderCard({ product: { ...mockProduct, available: false } });
    const btn = screen.getByRole("button", { name: /indisponible/i });
    expect(btn).toBeDisabled();
  });
});
