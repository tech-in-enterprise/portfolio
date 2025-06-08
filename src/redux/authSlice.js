import { createSlice } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'



// Thunk para buscar o profile do usuário (assincrono)
export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Erro ao buscar profile:', error.message)
    } else {
      dispatch(setUserProfile(data))
    }
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}


const initialState = {
  isModalOpen: false,
  isLoginMode: false,
  user: null,
  profile: null,
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
    setUserProfile: (state, action) => {
      state.profile = action.payload
    },
    logout(state) {
      state.user = null
      localStorage.removeItem('authUser')
    },
  },
})

export const { setModalOpen, setLoginMode, setUser, toggleLoginMode, logout, setUserProfile } = authSlice.actions

export default authSlice.reducer
