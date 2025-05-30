import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { Box, Link } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FaRegStar, FaStar } from "react-icons/fa"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen } from '../../redux/authSlice'
import { favoriteProject, fetchFavorites } from '../../redux/favoritesSlice'
import { fetchProjects } from '../../redux/projectsSlice'
import { FaGithub } from "react-icons/fa"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import TextField from '@mui/material/TextField'



export default function ProjectPosterCard() {

  const [showText, setShowText] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const projects = useSelector((state) => state.projects.projects)
  const favorites = useSelector(state => state.favorites.items)


  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchFavorites())
  }, [dispatch])


  // Verifica se na lista de favoritos tem o projeto para o usuário logado
  const isFavorite = (projectId) => {
    return favorites.some((fav) => fav.project_id === projectId && fav.user_id === user?.id)
  }


  //favoritar caso esteja logado, caso não, vai abrir modal de sigin/login
  const handleFavoriteClick = async (projectId) => {
    if (!user) {
      dispatch(setModalOpen(true)); // Abre o modal de login se o usuário não estiver autenticado
      return;
    }

    try {
      // Atualiza os favoritos do usuário
      await dispatch(favoriteProject({ user_id: user.id, project_id: projectId }));

      // Atualiza as listas de projetos e favoritos
      await dispatch(fetchProjects());
      await dispatch(fetchFavorites());
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
    }
  };


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

  const handleInfoClick = () => setShowText(true)
  const handleResetInfoClick = () => setShowText(false)
  const handleCommentsClick = () => setShowComments(true)
  const handleCloseComments = () => setShowComments(false)

  return (
    <React.Fragment>
      {projects.map((project) => (
        <Card key={project.id} sx={{ maxWidth: 400, border: '1px solid #ccc', borderRadius: 3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative' }}>
          {showComments ? (
            <Box sx={{ position: 'relative', height: 500, background: '#000000' }}>
              <HighlightOffIcon onClick={handleCloseComments} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', '&:hover': { color: '#ff5722' } }} />
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                  Comentários do Projeto
                </Typography>
                <Box sx={{ mt: 2, color: '#ffffff' }}>
                  <Typography sx={{ fontSize: '14px', mb: 2 }}>
                    Adicione seus comentários aqui:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Escreva seu comentário..."
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                  <Button variant="contained" sx={{ mt: 2, backgroundColor: '#ff5722' }}>
                    Enviar Comentário
                  </Button>
                </Box>
              </CardContent>
            </Box>
          ) : showText ? (
            <Box sx={{ position: 'relative', height: 500, background: '#000000' }}>
              <HighlightOffIcon onClick={handleResetInfoClick} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', '&:hover': { color: '#ff5722' } }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                  Descrição sobre o projeto
                </Typography>
                <Box sx={{ color: '#ffffff', textAlign: 'initial', mt: 2 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }} gutterBottom>
                    Lembra de como é chegar em uma cidade que você não conhece nada?
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                    Sentir que você não conseguiu aproveitar tudo que a cidade havia para oferecer
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                    Agora imagine ter uma ferramenta que facilita sua vida desde o primeiro momento.
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                    Bem, esse é o <span style={{ color: '#ff5722', fontWeight: 'bold' }}>concierge virtual! </span> Ele traz diversas funcionalidades, tais como:
                  </Typography>
                </Box>
                <Link target="_blank" underline="none" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', color: '#ffffff', fontWeight: 'bold', transition: 'color 0.3s ease', '&:hover ': { color: '#ff5722' }, '& svg': { marginRight: 1, transition: 'color 0.3s ease' } }}>
                  <FaGithub />
                  <Typography sx={{ fontSize: 12 }}>
                    Ver código no Github
                  </Typography>
                </Link>
              </CardContent>
            </Box>
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
                <IoChatbubbleEllipsesOutline onClick={handleCommentsClick} style={{ color: '#ff5722', fontSize: 20, cursor: 'pointer' }} />
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
      ))}
    </React.Fragment>
  )
}
