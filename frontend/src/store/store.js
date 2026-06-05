import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import productsReducer from './productsSlice'
import adminProductsReducer from './adminProductsSlice'
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    adminProducts: adminProductsReducer,
    cart: cartReducer
  },
})
