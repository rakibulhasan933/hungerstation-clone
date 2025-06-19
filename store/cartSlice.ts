import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  customizations: Record<string, string[]>
  relatedItems: string[]
  totalPrice: number
  addedAt: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  lastAddedItem: number | null
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  lastAddedItem: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations) &&
          JSON.stringify(item.relatedItems) === JSON.stringify(action.payload.relatedItems),
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex].quantity += action.payload.quantity
      } else {
        // Add new item
        state.items.push({ ...action.payload, addedAt: Date.now() })
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
      state.lastAddedItem = action.payload.id
    },

    removeItem: (state, action: PayloadAction<number>) => {
      // Remove all instances of the item with the given ID
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      // Find the first item with the matching ID and update its quantity
      const itemIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (itemIndex >= 0) {
        if (action.payload.quantity <= 0) {
          state.items.splice(itemIndex, 1)
        } else {
          state.items[itemIndex].quantity = action.payload.quantity
        }
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
      }
    },

    clearLastAddedItem: (state) => {
      state.lastAddedItem = null
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      state.lastAddedItem = null
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearLastAddedItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
