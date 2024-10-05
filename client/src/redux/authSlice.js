import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    userName: null,
    userId: null,
    isAdmin: false,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;  
      state.isAdmin = action.payload.isAdmin; 
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false; 
      state.userName = null;
      state.userId = null;
      state.isAdmin = false;
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;