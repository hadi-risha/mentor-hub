//first slice i created/ more likely for regiter/ so check only that things in this or any other persisting details store here
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser,IRegisterData } from '../types/User';

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: IRegisterData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/signup', userData);  
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
