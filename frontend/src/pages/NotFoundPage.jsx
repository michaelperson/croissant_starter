import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
      <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>🥐</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-chocolate)', marginBottom: 'var(--space-md)' }}>
        404 — Ce croissant est introuvable
      </h1>
      <p style={{ color: 'var(--color-stone)', marginBottom: 'var(--space-xl)' }}>
        La page que vous cherchez a peut-être été mangée.
      </p>
      <Link to="/" className="btn btn-primary">Retour au menu</Link>
    </div>
  )
}
