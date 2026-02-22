import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'

// Fetch todos os projetos (para a Home)
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, favorites (id), profiles (username, avatar_url)')
      if (error) throw error

      const projectsWithFavorites = data.map((project) => ({
        ...project,
        totalFavorites: project.favorites?.length,
        author: project.profiles
      }))
      return projectsWithFavorites
    } catch (err) {
      return rejectWithValue(err.message || 'Erro inesperado')
    }
  }
)

// Fetch apenas os projetos do usuário logado
export const fetchMyProjects = createAsyncThunk(
  'projects/fetchMyProjects',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, favorites (id), profiles (username, avatar_url)')
        .eq('user_id', userId) 

      if (error) throw error

      const projectsWithFavorites = data.map((project) => ({
        ...project,
        totalFavorites: project.favorites?.length,
        author: project.profiles
      }))
      return projectsWithFavorites
    } catch (err) {
      return rejectWithValue(err.message || 'Erro inesperado')
    }
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],      // todos os projetos (Home)
    myProjects: [],    // apenas do usuário logado
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Todos os projetos
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Projetos do usuário
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false
        state.myProjects = action.payload
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default projectsSlice.reducer