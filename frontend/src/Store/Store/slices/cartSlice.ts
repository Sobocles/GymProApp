// src/Store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../interface/Product';

// Estructura para guardar producto + cantidad
export interface CartItem {
  product: Product;
  quantity: number;
}

// Estado inicial del slice
interface CartState {
  items: CartItem[];
}

// Estado inicial
const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Agregar un producto al carrito con una cantidad dada
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;

      // Ver si el producto ya está en el carrito
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Si existe, incrementamos la cantidad
        existingItem.quantity += quantity;
      } else {
        // Si no existe, lo agregamos
        state.items.push({ product, quantity });
      }
    },

    // Quitar un producto del carrito
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
    },

    // Incrementar la cantidad de un producto en 1
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrementar la cantidad de un producto en 1 (sin bajar de 1)
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.product.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

// Exportar actions y reducer
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
