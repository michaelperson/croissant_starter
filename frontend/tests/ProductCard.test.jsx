import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../src/components/ProductCard' // Chemin relatif corrigé !

// 1. On "mock" le hook pour éviter que le composant ne crashe
const mockAddItem = vi.fn()
vi.mock('../src/hooks/useCart', () => ({
  useCart: () => ({ addItem: mockAddItem })
}))

// 2. Données de test standards
const baseProduct = {
  _id: 'test-123',
  name: 'Croissant au Beurre',
  description: 'Le croissant parfait',
  price: 1.8,
  category: 'viennoiserie',
  allergens: ['gluten', 'lactose'],
  available: true,
  isNew: false
}

describe('ProductCard', () => {
  // On remet le mock à zéro avant chaque test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche les informations de base du produit', () => {
    render(<ProductCard product={baseProduct} />)

    expect(screen.getByText('Croissant au Beurre')).toBeInTheDocument()
    expect(screen.getByText('Le croissant parfait')).toBeInTheDocument()
    // Vérifie le formatage du prix (1.8 -> 1.80 €)
    expect(screen.getByText('1.80 €')).toBeInTheDocument()
  })

  it('affiche le badge allergène si le produit contient du gluten', () => {
    render(<ProductCard product={baseProduct} />)
    // Le badge ⚠️ a un attribut title="Contient du gluten" dans ton code
    expect(screen.getByTitle('Contient du gluten')).toBeInTheDocument()
  })

  it('affiche le badge Nouveau si isNew est true', () => {
    render(<ProductCard product={{ ...baseProduct, isNew: true }} />)
    expect(screen.getByText('Nouveau')).toBeInTheDocument()
  })

  it('désactive le bouton et affiche "Indisponible" si le produit n\'est pas disponible', () => {
    render(<ProductCard product={{ ...baseProduct, available: false }} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Indisponible')
  })

  it('appelle addItem et affiche temporairement "Ajouté !" au clic', () => {
    render(<ProductCard product={baseProduct} />)

    // Ton aria-label permet de cibler le bouton facilement
    const button = screen.getByRole('button', { name: /Ajouter Croissant au Beurre au panier/i })

    // On simule le clic
    fireEvent.click(button)

    // On vérifie que le hook a bien été appelé avec le produit
    expect(mockAddItem).toHaveBeenCalledWith(baseProduct)
    expect(mockAddItem).toHaveBeenCalledTimes(1)

    // On vérifie que le texte du bouton a changé
    expect(button).toHaveTextContent('✓ Ajouté !')
  })
})