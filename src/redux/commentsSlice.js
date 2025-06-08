import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'

// Async thunk para criar um comentário
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, { rejectWithValue }) => {
    const { user_id, project_id, comment } = commentData

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ user_id, project_id, comment }])
        .select()

      if (error) {
        console.error('Erro ao inserir comentário no Supabase:', error)
        return rejectWithValue(error.message)
      }

      return data
    } catch (err) {
      console.error('Erro inesperado:', err)
      return rejectWithValue(err.message)
    }
  }
)

// Async thunk para buscar comentários de um projeto específico
export const getComments = createAsyncThunk(
  'comments/fetchComments',
  async (project_id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`*,
          profiles (
            id,
            username
          )
        `)
        .eq('project_id', project_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar comentários:', error)
        return rejectWithValue(error.message)
      }

      return data
    } catch (err) {
      console.error('Erro inesperado:', err)
      return rejectWithValue(err.message)
    }
  }
)

//total de comentários de um projeto
export const fetchCommentsCount = createAsyncThunk(
  'comments/fetchCommentsCount',
  async (project_id, { rejectWithValue }) => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('project_id', project_id)

      if (error) {
        console.error('Erro ao contar comentários:', error)
        return rejectWithValue(error.message)
      }

      return count || 0
    } catch (err) {
      console.error('Erro inesperado ao contar comentários:', err)
      return rejectWithValue(err.message)
    }
  }
)


const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
    commentsCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false
        state.comments.push(...action.payload)
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cases para getComments
      .addCase(getComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      //para pegar total de comentários
      .addCase(fetchCommentsCount.fulfilled, (state, action) => {
        state.commentsCount = action.payload
      })
  },
})

export default commentsSlice.reducer
