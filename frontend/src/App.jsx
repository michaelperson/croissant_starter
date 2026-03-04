import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <CartProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"          element={<MenuPage />} />
            <Route path="/panier"    element={<CartPage />} />
            <Route path="/commande/:id" element={<OrderConfirmationPage />} />
            <Route path="/suivi/:id" element={<OrderTrackingPage />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App
