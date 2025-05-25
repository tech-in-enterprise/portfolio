import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'

// Thunk para buscar os projetos do banco de dados
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const { data, error } = await supabase.from('projects').select('*')
  if (error) {
    console.error('Erro ao buscar projetos:', error.message)
    throw error
  }
  return data
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message
      })
  },
})

export default projectsSlice.reducer
