import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/productos';

const getToken = () => localStorage.getItem('token');

export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) return response.data.data;
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar productos');
    }
  }
);

export const createProduct = createAsyncThunk(
  'adminProducts/create',
  async (productData, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      const response = await axios.post(API_URL, productData, config);
      if (response.data.success) return response.data.data;
      return rejectWithValue(response.data.message);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.errores) {
        return rejectWithValue({ message: errorData.message, detalles: errorData.errores });
      }
      return rejectWithValue(errorData?.message || 'Error al crear producto');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'adminProducts/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      const response = await axios.put(`${API_URL}/${id}`, productData, config);
      if (response.data.success) return response.data.data;
      return rejectWithValue(response.data.message);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.errores) {
        return rejectWithValue({ message: errorData.message, detalles: errorData.errores });
      }
      return rejectWithValue(errorData?.message || 'Error al actualizar producto');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'adminProducts/delete',
  async (id, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar producto');
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  errorDetails: null,
  currentProduct: null,
};

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.detalles) {
          state.error = action.payload.message;
          state.errorDetails = action.payload.detalles;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id_producto === action.payload.id_producto);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.detalles) {
          state.error = action.payload.message;
          state.errorDetails = action.payload.detalles;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id_producto !== action.payload.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentProduct, clearCurrentProduct, clearError } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;