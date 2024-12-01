import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserRole } from '../types/User';

const initialState: IUserRole = {
  role: null,
}

const userRoleSlice = createSlice({
  name: 'userRole',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload; 
    },
    clearUserRole: (state) => {
      state.role = null; 
    },
  },
});

export const { setUserRole, clearUserRole } = userRoleSlice.actions; 
export default userRoleSlice.reducer; 
