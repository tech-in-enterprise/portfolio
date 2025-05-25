import { useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import SuperiorMenu from './components/app-bar/app-bar'
import ProjectPosterCard from './components/cards/cards'
import Title from './components/title/title'
import { supabase } from './services/supabase'
import { useDispatch } from 'react-redux'
import { setUser, logout } from './redux/authSlice'
import Authentication from './components/Auth/auth'

export default function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        dispatch(setUser(user))
      }
    }

    loadUser()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch(setUser(session.user))
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout())
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [dispatch])

  return (
    <>
      <Box>
        <SuperiorMenu/>
        <Toolbar/>
        <Title title="Projetos" />
        <ProjectPosterCard/>
        <Authentication/>
      </Box>
    </>
  )
}

