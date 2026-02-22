import { useEffect } from 'react'
import { Box, Grid} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '../../redux/projectsSlice'
import { fetchCommentsTotal } from '../../redux/commentsSlice'
import ProjectCardItem from './generals-components/projects'
import { fetchFavorites } from '../../redux/favoritesSlice'



export default function ProjectPosterCard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const projects = useSelector((state) => state.projects.projects)
  const favorites = useSelector(state => state.favorites.items)
  const commentsCount = useSelector((state) => state.comments.commentsCount)

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchFavorites())
  }, [dispatch])

  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((project) => dispatch(fetchCommentsTotal(project.id)))
    }
  }, [dispatch, projects])

  const isFavorite = (projectId) => {
    return favorites.some((fav) => fav.project_id === projectId && fav.user_id === user?.id)
  }

  return (
    <Box sx={{ padding: 2, mb: 2 }}>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            {/* Chamando o componente independente */}
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