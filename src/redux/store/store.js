import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../authSlice'
import favoritesReducer from '../favoritesSlice'
import projectsReducer from '../projectsSlice'
import commentsReducer from '../commentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    projects: projectsReducer,
    comments: commentsReducer,
  },
})
