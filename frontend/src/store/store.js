import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import productsReducer from './productsSlice'
import adminProductsReducer from './adminProductsSlice'
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    adminProducts: adminProductsReducer,
    orders: ordersReducer,
    cart: cartReducer
  },
})
