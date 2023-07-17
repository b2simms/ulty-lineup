import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'

export type ThemeType = 'light' | 'dark';

// Load initial state from storage
const storedTheme = localStorage.getItem('theme');
const initialState: { mode: ThemeType } = storedTheme ? JSON.parse(storedTheme) : { "mode": "dark" };

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', JSON.stringify(state));
        },
    },
})

export const { toggleTheme } = themeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectThemeMode = (state: RootState) => state.theme.mode;

export default themeSlice.reducer
