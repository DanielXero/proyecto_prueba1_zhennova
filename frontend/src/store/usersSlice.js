import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_AUTH = "http://localhost:3000/api/auth";

export const loginUser = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/login`, userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.detalles) {
        return rejectWithValue({
          message: errorData.error,
          detalles: errorData.detalles,
        });
      }
      return rejectWithValue({
        message: errorData?.error || "Error al iniciar sesión",
      });
    }
  },
);

export const registerUser = createAsyncThunk(
  "users/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/register`, userData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.detalles) {
        return rejectWithValue({
          message: errorData.error,
          detalles: errorData.detalles,
        });
      }
      return rejectWithValue({
        message: errorData?.error || "Error al registrarse",
      });
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuth: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  errorDetails: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      localStorage.clear();
    },
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = "loading"; // Cambiado para coincidir con tu Login.jsx
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Aquí extraemos el string del mensaje para que React no colapse
        state.error = action.payload?.message || "Error al iniciar sesión";
        state.errorDetails = action.payload?.detalles || null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error al registrarse";
        state.errorDetails = action.payload?.detalles || null;
      });
  },
});

export const { logout, clearError } = usersSlice.actions;
export default usersSlice.reducer;
