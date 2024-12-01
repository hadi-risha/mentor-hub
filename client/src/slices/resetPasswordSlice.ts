import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../config';

export const resetUserPassword = createAsyncThunk(
  'forgotPassword/resetUserPassword',
  async ({ token, password,confirmPassword }: { token: string; password: string; confirmPassword: string }) => {
    const response = await axios.post(`${config.backendUrl}/auth/reset-password/${token}`, { password, confirmPassword })
    return response.data; 
  }
);   

const resetPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    loading: false,
    error: null as string | null,
    successMessage: '',
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; 
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred'; 
      });
  },
});

export const { resetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
