import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// 这两个方法可以创建一个slice，一个slice可以包含多个reducer，一个reducer可以包含多个action，一个action可以包含多个payload

export interface InitialStateType {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

const initialState: InitialStateType = {
  isSidebarCollapsed: true,
  isDarkMode: false,
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
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;

export default globalSlice.reducer;
