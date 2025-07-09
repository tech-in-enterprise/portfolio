import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { Box, Grid, Card, CardActions, CardContent, Button, Typography } from '@mui/material'
import { FaRegStar, FaStar } from "react-icons/fa"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen } from '../../redux/authSlice'
import { favoriteProject, fetchFavorites } from '../../redux/favoritesSlice'
import { fetchProjects } from '../../redux/projectsSlice'
import AboutProject from './about-project'
import ComentsAboutProject from './coments-about-project'
import { fetchCommentsTotal } from '../../redux/commentsSlice'




export default function ProjectPosterCard() {

  const [showText, setShowText] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')


  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const projects = useSelector((state) => state.projects.projects)
  const favorites = useSelector(state => state.favorites.items)
  const commentsCount = useSelector((state) => state.comments.commentsCount)


  // para reenderizar(montar) projetos e favoritos do projetos
  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchFavorites())

  }, [dispatch])

  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((project) => {
        dispatch(fetchCommentsTotal(project.id))
      })
    }
  }, [dispatch, projects])

  // Verifica se na lista de favoritos tem o projeto para o usuário logado
  const isFavorite = (projectId) => {
    return favorites.some((fav) => fav.project_id === projectId && fav.user_id === user?.id)
  }


  //favoritar caso esteja logado, caso não, vai abrir modal de sigin/login
  const handleFavoriteClick = async (projectId) => {
    if (!user) {
      dispatch(setModalOpen(true))
      return
    }

    try {
      // Atualiza os favoritos do usuário
      await dispatch(favoriteProject({ user_id: user.id, project_id: projectId }))

      // Atualiza as listas de projetos e favoritos
      await dispatch(fetchProjects())
      await dispatch(fetchFavorites())
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error)
    }
  }


  useEffect(() => {
    async function fetchVideoUrl() {
      const { data, error } = supabase.storage
        .from('videos')
        .getPublicUrl('conciergevirtual.mp4');
      if (error) {
        console.error('Erro ao obter URL do vídeo:', error.message)
      } else {
        console.log('URL obtida:', data.publicUrl)
        setVideoUrl(data.publicUrl)
      }
    }
    fetchVideoUrl()
  }, [])

  const handleInfoClick = () => {
    setShowText(true)
    setShowComments(false)
  }
  const handleResetInfoClick = () => setShowText(false)

  const handleCommentsClick = (projectId) => {
    setShowComments(projectId)
    setShowText(false)
  }
  const handleCloseComments = () => setShowComments(false)

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card key={project.id} sx={{ maxWidth: 400, border: '1px solid #ccc', borderRadius: 3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative' }}>
              {showComments ? (
                <ComentsAboutProject project={project} handleCloseComments={handleCloseComments} />
              ) : showText ? (
                <AboutProject handleResetInfoClick={handleResetInfoClick} />
              ) : (
                <div style={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {project.video_url ? (
                    <video autoPlay muted loop width="100%" height="100%" style={{ objectFit: 'cover' }}>
                      <source src={project.video_url} type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <Typography sx={{ color: '#000000' }}>Carregando vídeo...</Typography>
                  )}
                </div>
              )}

              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#000000' }}>
                    {project.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user && isFavorite(project.id) ? (
                      <>
                        <FaStar
                          onClick={() => handleFavoriteClick(project.id)}
                          style={{ color: '#ff5722', fontSize: 20, marginRight: 4, cursor: 'pointer' }}
                        />
                        {project.totalFavorites > 0 && (
                          <Typography variant="body2" sx={{ color: '#000', mr: 1 }}>
                            {project.totalFavorites}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        <FaRegStar
                          onClick={() => handleFavoriteClick(project.id)}
                          style={{ color: '#ff5722', fontSize: 20, marginRight: 4, cursor: 'pointer', }}
                        />
                        {project.totalFavorites > 0 && (
                          <Typography variant="body2" sx={{ color: '#000', mr: 1 }}>
                            {project.totalFavorites}
                          </Typography>
                        )}
                      </>
                    )}
                    <IoChatbubbleEllipsesOutline onClick={() => handleCommentsClick(project.id)} style={{ color: '#ff5722', fontSize: 20, marginRight: 4, cursor: 'pointer', }} />
                    {(commentsCount[project.id] ?? 0) > 0 && (
                      <Typography>{commentsCount[project.id]}</Typography>
                    )}

                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="large" variant="contained" sx={{ backgroundColor: '#000000', width: '180px' }} onClick={handleInfoClick} >
                  Saiba mais
                </Button>
                <Button size="large" variant="outlined" sx={{ borderColor: '#ff5722', color: '#ff5722', width: '180px' }} onClick={() => window.open('https://conciergevirtual.netlify.app/1', '_blank')}>
                  Ver Projeto
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}