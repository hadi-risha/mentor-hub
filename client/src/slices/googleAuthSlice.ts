// this file not using actually, look and delete


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
};

const googleAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, clearToken } = googleAuthSlice.actions;
export default googleAuthSlice.reducer;


