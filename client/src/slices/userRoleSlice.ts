// src/redux/yourSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserRoleState {
  role: string | null; // or 'instructor' | 'student' | other roles as needed
}

const initialState: UserRoleState = {
  role: null,
}

const userRoleSlice = createSlice({
  name: 'userRole',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload; // Set the user role
    },
    clearUserRole: (state) => {
      state.role = null; // Clear the user role
    },
  },
});

export const { setUserRole, clearUserRole } = userRoleSlice.actions; // Export actions
export default userRoleSlice.reducer; // Export reducer
