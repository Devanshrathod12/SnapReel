import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  password?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  registeredUsers: User[]; // This will act as our local database, persisted by redux-persist
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  registeredUsers: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<User>) => {
      // Add the user to our "database"
      const exists = state.registeredUsers.find(u => u.email === action.payload.email);
      if (!exists) {
        state.registeredUsers.push(action.payload);
      }
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { registerUser, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
