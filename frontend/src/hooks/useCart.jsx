import { createContext, useContext, useReducer } from 'react'

// ─── Contexte & Reducer ──────────────────────────────────────────────────────
const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ).filter(i => i.quantity > 0)
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem    = (product) => dispatch({ type: 'ADD_ITEM',    payload: product })
  const removeItem = (id)      => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty  = (id, qty) => dispatch({ type: 'UPDATE_QTY',  payload: { id, qty } })
  const clearCart  = ()        => dispatch({ type: 'CLEAR_CART' })

  const totalItems  = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice  = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
