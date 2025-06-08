import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserProfile, logout } from '../../redux/authSlice'
import { supabase } from '../../services/supabase'
import { CiUser } from "react-icons/ci"




const navItems = ['Home', 'Projetos', 'Sobre mim', 'Certificados']

export default function SuperiorMenu() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const profile = useSelector((state) => state.auth.profile)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id))
    }
  }, [user?.id, dispatch])


  //função para fazer logout no sistema
  const handleLogout = async () => {
    handleMenuClose()
    await supabase.auth.signOut()
    dispatch(logout())
  }

  // abrir menu desktop ao clicar na box do usuário
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // fechar menu desktop
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  //função para abrir e fechar menu em estado mobile
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen)
  }


  // Conteúdo do Drawer exibindo navItems e botão "Sair" apenas em mobile
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 250, height: '100vh', background: '#000000', color: '#ffffff' }} onClick={toggleDrawer}>
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding sx={{'&:hover': {backgroundColor: '#e64a19'}}}>
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {user && (
        <Button variant="contained" onClick={handleLogout} sx={{ border:'none', backgroundColor: '#ff5722', color: '#fff', width: '100%', mt: 'auto', }}>
          Sair
        </Button>
      )}
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" sx={{ background: '#000' }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 0 }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{ mr: 2, display: { sm: 'none' } }} onClick={toggleDrawer} >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            PORTFÓLIO
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}

            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff', marginLeft: 2 }} onClick={handleMenuOpen}>
                <CiUser style={{ color: '#ff5722' }} />
                <Typography variant="body1" sx={{ cursor: 'pointer', ml:1, '&:hover': { textDecoration: 'underline' } }}>
                  {profile?.username || 'Usuário'}
                </Typography>
              </Box>
            )}

          </Box>


          {user && (
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', color: '#fff', ml: 'auto' }}>
              <CiUser style={{ color: '#ff5722' }} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {profile?.username || 'Usuário'}
              </Typography>
            </Box>
          )}

          {user ? (
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              keepMounted
            >
              <MenuItem onClick={handleLogout} sx={{ color: '#ff5722', background: '#000000' }}>Sair</MenuItem>
            </Menu>
          ) : (
            <Button variant="outlined" sx={{ ml: 5, color: '#ff5722', borderColor: '#ff5722' }} onClick={() => dispatch({ type: 'auth/setModalOpen', payload: true })} >
              Entrar
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer} sx={{ display: { sm: 'none' } }} >
        {drawerContent}
      </Drawer>
    </Box>
  )
}
