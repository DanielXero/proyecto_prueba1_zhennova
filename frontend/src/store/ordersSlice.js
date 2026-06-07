import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getConfig = (getState) => ({
  headers: { Authorization: `Bearer ${getState().users.token}` }
});

export const fetchMisPedidos = createAsyncThunk(
  'orders/fetchMisPedidos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:3000/api/pedidos/mis-pedidos', getConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error al cargar pedidos');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { pedidos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMisPedidos.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMisPedidos.fulfilled, (state, action) => { state.loading = false; state.pedidos = action.payload; })
      .addCase(fetchMisPedidos.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default ordersSlice.reducer;