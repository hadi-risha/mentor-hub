
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utils/users/axiosInstance'
import axios from 'axios';

interface OtpPayload {
  email: string;
  otp: string;
}

interface OtpResponse {
  message: string;
  success: boolean;
  token: string;
}

export const verifyOtp = createAsyncThunk<OtpResponse, OtpPayload>(
  'otp/verifyOtp',
  
  async ({ email, otp }, thunkAPI) => {
    try {
        console.log("in verifyOtp slice");
      // const response = await axios.post('http://localhost:3001/api/auth/verify-otp', { email, otp });
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      console.log("response.data  in verifyOtp slice.....................................mm",response.data);
      
      const { token } = response.data;
      localStorage.setItem('token', token);

      return response.data;
    } catch (error: any) {
        console.log("in verifyOtp slice......error", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// otpSlice
const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    isVerified: false,
    message: '',
    error: '',
    token: localStorage.getItem('token') || null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.isVerified = true;
      state.message = action.payload.message;
      state.token = action.payload.token; // Store token in Redux state
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default otpSlice.reducer;
