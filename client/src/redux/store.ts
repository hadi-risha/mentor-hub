import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from '../slices/userSlice';
import otpReducer from '../slices/otpSlice';
import loginReducer from '../slices/loginSlice';
import forgotPasswordReducer from '../slices/forgotPasswordSlice';
import resetPasswordReducer from '../slices/resetPasswordSlice';
import userRoleReducer from '../slices/userRoleSlice';

export const store = configureStore({
  //reducer object maps slice names (keys like user, otp, login, etc.), Each reducer manages the state and actions for a specific feature of the app
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

// create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;