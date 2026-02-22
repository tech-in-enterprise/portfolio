import React, { useState } from 'react'
import { Box, Card, CardActions, CardContent, Button, Typography, Avatar } from '@mui/material'
import { FaRegStar, FaStar } from "react-icons/fa"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen } from '../../../redux/authSlice'
import { favoriteProject, fetchFavorites } from '../../../redux/favoritesSlice'
import { fetchProjects } from '../../../redux/projectsSlice'
import AboutProject from './about-project'
import ComentsAboutProject from './coments-about-project'

export default function ProjectCardItem({ project, isFavorite, commentsCount }) {
  // 'video', 'about' ou 'comments' - Isso garante que apenas um esteja aberto
  const [viewMode, setViewMode] = useState('video') 
  
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleFavoriteClick = async () => {
    if (!user) {
      dispatch(setModalOpen(true))
      return
    }
    try {
      await dispatch(favoriteProject({ user_id: user.id, project_id: project.id }))
      await dispatch(fetchProjects())
      await dispatch(fetchFavorites())
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error)
    }
  }

  // Funções para trocar de tela (uma fecha a outra automaticamente)
  const openAbout = () => setViewMode('about')
  const openComments = () => setViewMode('comments')
  const resetView = () => setViewMode('video')

  return (
    <Card sx={{ 
      maxWidth: 400, 
      height: 750,
      display: 'flex', 
      flexDirection: 'column', 
      border: '1px solid #dbdbdb', 
      borderRadius: 3, 
      boxShadow: 'var(--box-shadow)', 
      backgroundColor: 'var(--background-white)', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      
      {/* Área de Conteúdo Alternável (Altura Fixa de 470px) */}
      <Box sx={{ height: 470, overflow: 'hidden', flexShrink: 0 }}>
        {viewMode === 'comments' ? (
          <ComentsAboutProject project={project} handleCloseComments={resetView} />
        ) : viewMode === 'about' ? (
          <AboutProject handleResetInfoClick={resetView} projectId={project.id} />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
            {project.video_url ? (
              <video autoPlay muted loop playsInline disablePictureInPicture   style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={project.video_url} type="video/mp4" />
              </video>
            ) : (
              <Typography sx={{ color: '#fff' }}>Carregando vídeo...</Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Área de Texto (O flexGrow garante que o conteúdo preencha o espaço e alinhe os botões) */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={project.author?.avatar_url} sx={{ width: 32, height: 32 }}>
            {project.author?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {project.author?.username || 'Usuário'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 1 }}>
            {project.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {user && isFavorite(project.id) ? (
              <FaStar onClick={handleFavoriteClick} style={{ color: 'var(--color-orange)', cursor: 'pointer', fontSize: 20 }} />
            ) : (
              <FaRegStar onClick={handleFavoriteClick} style={{ color: 'var(--color-orange)', cursor: 'pointer', fontSize: 20 }} />
            )}
            <Typography variant="body2">{project.totalFavorites || 0}</Typography>
            
            <IoChatbubbleEllipsesOutline 
              onClick={openComments} // Clicar aqui agora fecha o "Saiba Mais" automaticamente
              style={{ color: 'var(--color-orange)', cursor: 'pointer', fontSize: 20, marginLeft: 8 }} 
            />
            <Typography variant="body2">{commentsCount}</Typography>
          </Box>
        </Box>

        {/* Limita o texto para não quebrar o layout se for muito longo */}
        <Typography variant="body2" sx={{ 
          color: 'text.secondary', 
          fontStyle: 'italic',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-around', pb: 2 }}>
        <Button 
          size="large" 
          variant="contained" 
          sx={{ backgroundColor: 'var(--background-dark)', width: '160px' }} 
          onClick={openAbout} 
        >
          Saiba mais
        </Button>
        <Button 
          size="large" 
          variant="outlined" 
          sx={{ borderColor: 'var(--color-orange)', color: 'var(--color-orange)', width: '160px' }} 
          onClick={() => window.open(project.external_url, '_blank')}
        >
          Ver Projeto
        </Button>
      </CardActions>
    </Card>
  )
}