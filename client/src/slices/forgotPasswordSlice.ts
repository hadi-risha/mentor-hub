// features/forgotPasswordSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const requestPasswordReset = createAsyncThunk(
  'forgotPassword/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      return response.data; // Expecting { message: string }
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Assuming your backend sends a message
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
