import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../../frontend/src/components/ProductCard'

// Mock du hook useCart
vi.mock('../../frontend/src/hooks/useCart', () => ({
  useCart: () => ({ addItem: vi.fn() })
}))

const product = {
  _id: '1', name: 'Croissant au beurre', category: 'viennoiserie',
  description: 'Notre croissant signature.', price: 1.80, available: true, isNew: false
}

describe('ProductCard', () => {
  it('affiche le nom et le prix du produit', () => {
    render(<ProductCard product={product} />)
    expect(screen.getByText('Croissant au beurre')).toBeInTheDocument()
    expect(screen.getByText('1.80 €')).toBeInTheDocument()
  })

  it('affiche le bouton Ajouter pour un produit disponible', () => {
    render(<ProductCard product={product} />)
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument()
  })

  it('désactive le bouton pour un produit indisponible', () => {
    render(<ProductCard product={{ ...product, available: false }} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('affiche le badge "Nouveau" pour les nouveaux produits', () => {
    render(<ProductCard product={{ ...product, isNew: true }} />)
    expect(screen.getByText('Nouveau')).toBeInTheDocument()
  })
})
