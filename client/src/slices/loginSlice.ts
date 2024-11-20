// loginSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../utils/users/axiosInstance'; // Use the Axios instance

import { ILoginData } from '../types/User';

interface LoginState {
  user: ILoginData | null;
  loading: boolean;
  error: string | null;
  token: string | null;

  otpLoading: boolean; // Add loading state for OTP
  otpError: string | null; // Add error state for OTP

  
}

const initialState: LoginState = {
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null, 

  otpLoading: false,
  otpError: null,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', loginData); // Updated to use axiosInstance
      const { token } = response.data;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error: any) {
      console.log("erroooooooooor, in loginUser slice 1",error);
      console.log("error.data ------------", error.data);
      
      const { message, needsVerification } = error.data;
      console.log( "message, needsVerification",message, needsVerification);
      

      
        return rejectWithValue({
          message: error.data.message || "An error occurred",
          needsVerification: error.data.needsVerification || false,
        });
      

    }
  }
);

//verify now in login
// New async thunk for sending OTP
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (data: { email: string }, { rejectWithValue }) => {

    try {
      const response = await axiosInstance.post('/auth/verify-login', data); // Using axiosInstance
      return response.data; // Expecting { message: string }
    } catch (error: any) {
      console.log("error in login slice verify now 2", error);
      return rejectWithValue(error.response.data);
    }
  }
);


const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');  // Remove token on logout
      localStorage.removeItem('userRole');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userData;
        state.token = action.payload.token;  // Store token in Redux state
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //verify-now otp cases
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        // Optionally handle successful OTP sending here
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
