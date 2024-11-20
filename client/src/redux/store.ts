import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import otpReducer from '../slices/otpSlice';
import loginReducer from '../slices/loginSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import forgotPasswordReducer from '../slices/forgotPasswordSlice';
import resetPasswordReducer from '../slices/resetPasswordSlice';
import userRoleReducer from '../slices/userRoleSlice';



export const store = configureStore({
  reducer: {
    user: userReducer,  
    otp: otpReducer,
    login: loginReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    userRole : userRoleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;