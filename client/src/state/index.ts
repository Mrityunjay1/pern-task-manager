import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isAuthenticated: boolean;
  user: null | { id: string; username: string };
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isAuthenticated: false,
  user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    login: (state, action: PayloadAction<{ id: string; username: string }>) => {
      console.log("state", state.isAuthenticated);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed, login, logout } =
  globalSlice.actions;

export default globalSlice.reducer;
