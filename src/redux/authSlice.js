import { createSlice } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'



// Thunk para buscar o profile do usuário (assincrono)
export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
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
    setUserProfile: (state, action) => {
      state.profile = action.payload
    },

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
      state.profile = null // 🔥 já aproveita e limpa o profile também
      localStorage.removeItem('authUser')
    },
  },
})

export const { setModalOpen, setLoginMode, setUser, toggleLoginMode, logout, setUserProfile } = authSlice.actions

export default authSlice.reducer
