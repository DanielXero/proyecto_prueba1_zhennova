
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';

  const API_URL = 'http://localhost:3000/api/productos';

  export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ search = '', categoria = '' } = {}, { rejectWithValue }) => {
      try {
        let url = API_URL;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (categoria) params.append('categoria', categoria);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await axios.get(url);
        if (response.data.success) return response.data.data;
        return rejectWithValue(response.data.message);
      } catch (error) {
        return rejectWithValue('Error de conexión');
      }
    }
  );

  const productsSlice = createSlice({
    name: 'products',
    initialState: { products: [], loading: 'idle', error: null, searchTerm: '', selectedCategoria: '' },
    reducers: {
      setSearchTerm: (state, action) => { state.searchTerm = action.payload; },
      setSelectedCategoria: (state, action) => { state.selectedCategoria = action.payload; },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProducts.pending, (state) => { state.loading = 'loading'; state.error = null; })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          state.products = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.payload;
          state.products = [];
        });
    }
  });

  export const { setSearchTerm, setSelectedCategoria } = productsSlice.actions;
  export default productsSlice.reducer;