import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'

// Async thunk para criar um comentário
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, { rejectWithValue, dispatch }) => {
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

      // 👉 Atualiza o contador logo após adicionar
      dispatch(fetchCommentsTotal(project_id))

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
export const fetchCommentsTotal = createAsyncThunk(
  'comments/fetchCommentsTotal',
  async (project_id, { rejectWithValue }) => {

    try {
      const { data, error, count } = await supabase
        .from('comments')
        .select('id', { count: 'exact', head: true }) 
        .eq('project_id', project_id)

      if (error) {
        console.error('Erro ao buscar total de comentários:', error)
        return rejectWithValue(error.message)
      }

      return { project_id, total: count || 0 }
    } catch (err) {
      console.error('Erro inesperado ao buscar total de comentários:', err)
      return rejectWithValue(err.message)
    }
  }
)


// Async thunk para atualizar um comentário
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ comment_id, updatedComment }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ comment: updatedComment })
        .eq('id', comment_id)
        .select() // pega os dados atualizados

      if (error) {
        console.error('Erro ao atualizar comentário:', error)
        return rejectWithValue(error.message)
      }

      if (!data || data.length === 0) {
        console.error('Nenhum comentário atualizado')
        return rejectWithValue('Nenhum comentário atualizado')
      }

      return data[0] // retorna o comentário atualizado
    } catch (err) {
      console.error('Erro inesperado ao atualizar comentário:', err)
      return rejectWithValue(err.message)
    }
  }
)


// Async thunk para deletar um comentário
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (comment_id, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment_id)

      if (error) {
        console.error('Erro ao excluir comentário:', error)
        return rejectWithValue(error.message)
      }

      return comment_id
    } catch (err) {
      console.error('Erro inesperado ao excluir comentário:', err)
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
    commentsCount: {},
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
        if (action.payload && action.payload.length > 0) {
          // Adiciona o comentário recém-criado no início da lista
          state.comments.unshift(action.payload[0])
        }
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
      .addCase(fetchCommentsTotal.fulfilled, (state, action) => {
        const { project_id, total } = action.payload
        state.commentsCount[project_id] = total
      })

      // Atualizar comentário
      .addCase(updateComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false
        if (!action.payload) return 
        const index = state.comments.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.comments[index] = action.payload
        }
      })

      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Excluir comentário
      .addCase(deleteComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false
        state.comments = state.comments.filter(c => c.id !== action.payload)
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default commentsSlice.reducer
