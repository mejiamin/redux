import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
}

const initialState: ThemeState = {
  mode: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeToggled(state) { state.mode = state.mode === 'light' ? 'dark' : 'light' },
    themeSet(state, action: PayloadAction<ThemeMode>) { state.mode = action.payload },
  },
})

export const { themeToggled, themeSet } = themeSlice.actions
export default themeSlice.reducer
