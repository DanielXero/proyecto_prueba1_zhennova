import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/productos'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL)
      if (response.data.success) {
        return response.data.data   // array de productos
      } else {
        return rejectWithValue(response.data.message || 'Error al cargar productos')
      }
    } catch (error) {
      return rejectWithValue('Error de conexión con el servidor')
    }
  }
)

const initialState = {
  products: [],
  loading: 'idle',
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload
        state.products = []
      })
  },
})

export default productsSlice.reducer