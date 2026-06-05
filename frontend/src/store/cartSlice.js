import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getConfig = (getState) => ({
  headers: { Authorization: `Bearer ${getState().users.token}` }
});

// Thunks
export const fetchCarrito = createAsyncThunk('cart/fetchCarrito', async (_, { getState, rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:3000/api/carrito', getConfig(getState));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Error al cargar carrito');
  }
});

export const agregarAlCarrito = createAsyncThunk('cart/agregar', async ({ id_producto, cantidad = 1 }, { getState, dispatch, rejectWithValue }) => {
  try {
    await axios.post('http://localhost:3000/api/carrito/agregar', { id_producto, cantidad }, getConfig(getState));
    await dispatch(fetchCarrito());
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Error al agregar');
  }
});

export const actualizarCantidad = createAsyncThunk('cart/actualizar', async ({ id_producto, cantidad }, { getState, dispatch, rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:3000/api/carrito/actualizar/${id_producto}`, { cantidad }, getConfig(getState));
    await dispatch(fetchCarrito());
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Error al actualizar');
  }
});

export const eliminarDelCarrito = createAsyncThunk('cart/eliminar', async (id_producto, { getState, dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:3000/api/carrito/eliminar/${id_producto}`, getConfig(getState));
    await dispatch(fetchCarrito());
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Error al eliminar');
  }
});

export const procesarCheckout = createAsyncThunk('cart/procesarCheckout', async (id_forma_pago, { getState, rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:3000/api/pedidos/checkout', { id_forma_pago }, getConfig(getState));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Error al procesar pedido');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, ultimoPedido: null },
  reducers: {
    limpiarEstadoPedido: (state) => { state.ultimoPedido = null; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // fetchCarrito
      .addCase(fetchCarrito.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCarrito.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCarrito.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // agregarAlCarrito
      .addCase(agregarAlCarrito.pending, (state) => { state.loading = true; })
      .addCase(agregarAlCarrito.fulfilled, (state) => { state.loading = false; })
      .addCase(agregarAlCarrito.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // actualizarCantidad
      .addCase(actualizarCantidad.pending, (state) => { state.loading = true; })
      .addCase(actualizarCantidad.fulfilled, (state) => { state.loading = false; })
      .addCase(actualizarCantidad.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // eliminarDelCarrito
      .addCase(eliminarDelCarrito.pending, (state) => { state.loading = true; })
      .addCase(eliminarDelCarrito.fulfilled, (state) => { state.loading = false; })
      .addCase(eliminarDelCarrito.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // procesarCheckout
      .addCase(procesarCheckout.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(procesarCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.ultimoPedido = action.payload.id_pedido;
        state.items = [];
      })
      .addCase(procesarCheckout.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { limpiarEstadoPedido } = cartSlice.actions;
export default cartSlice.reducer;