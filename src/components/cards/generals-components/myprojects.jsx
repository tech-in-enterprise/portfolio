import React, { useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites } from '../../../redux/favoritesSlice'
import { fetchMyProjects } from '../../../redux/projectsSlice'
import { fetchCommentsTotal } from '../../../redux/commentsSlice'
import ProjectCardItem from './all-projects-feed-home'



export default function MyProjects() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const myProjects = useSelector((state) => state.projects.myProjects)
  const favorites = useSelector((state) => state.favorites.items)
  const commentsCount = useSelector((state) => state.comments.commentsCount)

  // Busca apenas os projetos do usuário logado
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyProjects(user.id))
      dispatch(fetchFavorites())
    }
  }, [dispatch, user?.id])

  // Buscar quantidade de comentários por projeto
  useEffect(() => {
    if (myProjects.length > 0) {
      myProjects.forEach((project) => dispatch(fetchCommentsTotal(project.id)))
    }
  }, [dispatch, myProjects])

  const isFavorite = (projectId) => {
    return favorites.some((fav) => fav.project_id === projectId && fav.user_id === user?.id)
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Faça login para ver seus projetos</Typography>
      </Box>
    )
  }

  if (myProjects.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Você ainda não criou nenhum projeto.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        {myProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCardItem
              project={project}
              isFavorite={isFavorite}
              commentsCount={commentsCount[project.id] ?? 0}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}