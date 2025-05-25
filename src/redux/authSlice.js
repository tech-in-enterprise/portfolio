import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isModalOpen: false,
  isLoginMode: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload
    },
    setLoginMode: (state, action) => {
      state.isLoginMode = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    toggleLoginMode: (state) => {
      state.isLoginMode = !state.isLoginMode
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { setModalOpen, setLoginMode, setUser, toggleLoginMode, logout   } = authSlice.actions

export default authSlice.reducer
