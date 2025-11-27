import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user_name: string | null;
  is_authenticated: boolean;
  role: string | null;
  email: string | null;
}

const initialState: authState = {
  user_name: null,
  is_authenticated: false,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user_name: string; role: string; email: string }>
    ) => {
      state.user_name = action.payload.user_name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.is_authenticated = true;
    },
    logout: (state) => {
      state.user_name = null;
      state.email = null;
      state.role = null;
      state.is_authenticated = false;
    },
    
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
