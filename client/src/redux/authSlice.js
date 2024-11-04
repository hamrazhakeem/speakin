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
    isTutor: false,
    isStudent: false,
    credits: 0
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;  
      state.isAdmin = action.payload.isAdmin; 
      state.isTutor = action.payload.isTutor;
      state.isStudent = action.payload.isStudent;  
      state.credits = action.payload.credits; 
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false; 
      state.userName = null;
      state.userId = null;
      state.isAdmin = false;
      state.isTutor = false;
      state.isStudent = false;
      state.credits = 0
    },
    updateCredits: (state, action) => {
      state.credits = action.payload;
    },
  },
});

export const { setTokens, clearTokens, updateCredits } = authSlice.actions;
export default authSlice.reducer;