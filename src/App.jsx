import { useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import SuperiorMenu from './components/app-bar/app-bar'
import ProjectPosterCard from './components/cards/cards'
import Title from './components/title/title'
import { supabase } from './services/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice'
import Authentication from './components/Auth/auth'

export default function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)))
    } else {
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          dispatch(setUser(user))
          localStorage.setItem('authUser', JSON.stringify(user))
        }
      }
      checkUser()
    }
  }, [dispatch])

  return (
    <Box>
      <SuperiorMenu />
      <Toolbar />
      <Title title="PROJETOS" />
      <ProjectPosterCard />
      <Authentication />
    </Box>

  )
}

