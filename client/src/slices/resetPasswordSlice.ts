// forgotPasswordSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const resetUserPassword = createAsyncThunk(
  'forgotPassword/resetUserPassword',
  async ({ token, password,confirmPassword }: { token: string; password: string; confirmPassword: string }) => {
    const response = await axios.post(`http://localhost:3001/api/auth/reset-password/${token}`, { password, confirmPassword })
    
    return response.data; // Ensure this contains a 'message'
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
        state.successMessage = action.payload.message; // Make sure message exists
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred'; // Check action.error structure
      });
  },
});

export const { resetState } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
