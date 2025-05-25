import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../services/supabase'

export const favoriteProject = createAsyncThunk(
  'favorites/favoriteProject',
  async ({ project_id }, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return rejectWithValue('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', project_id)

      if (error) {
        return rejectWithValue(error.message)
      }

      if (data && data.length > 0) {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', project_id)

        if (deleteError) {
          return rejectWithValue(deleteError.message)
        }

        return { removed: true, project_id }
      } else {
        const { data: favorite, error: insertError } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, project_id })
          .select()
          .single()

        if (insertError) {
          return rejectWithValue(insertError.message)
        }

        return { added: true, favorite }
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Erro inesperado')
    }
  }
)

// thunk para buscar favoritos
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')

      if (error) {
        return rejectWithValue(error.message)
      }

      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Erro inesperado')
    }
  }
)


const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(favoriteProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(favoriteProject.fulfilled, (state, action) => {
        state.loading = false

        if (action.payload.added) {
          state.items.push(action.payload.favorite)
        } else if (action.payload.removed) {
          state.items = state.items.filter(
            (item) => item.project_id !== action.payload.project_id
          )
        }
      })
      .addCase(favoriteProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erro ao processar favorito'
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erro ao carregar favoritos'
      })
  }

})


export const { setFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer
