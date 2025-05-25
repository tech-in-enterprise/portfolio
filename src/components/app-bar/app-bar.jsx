import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice'
import { supabase } from '../../services/supabase'

const navItems = ['Home', 'Sinopse', 'Bastdores']

export default function SuperiorMenu() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" sx={{ background: '#000' }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{ mr: 2, display: { sm: 'none' } }} >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Portfólio
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
          {user ? (
            <Button variant="outlined" sx={{ ml: 5, color: '#ff5722', borderColor: '#ff5722' }} onClick={handleLogout} >
              Sair
            </Button>
          ) : (
            <Button variant="outlined" sx={{ ml: 5, color: '#ff5722', borderColor: '#ff5722' }} onClick={() => dispatch({ type: 'auth/setModalOpen', payload: true })} >
              Entrar
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
