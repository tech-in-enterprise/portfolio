import React, { useState, useEffect } from 'react'
import { AppBar, Box, Toolbar, Typography, Button, Paper, BottomNavigation, BottomNavigationAction, Avatar } from '@mui/material'
import { Home, Folder, Person, WorkspacePremium } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import DropdownAppBar from './drop-down'
import { fetchUserProfile } from '../../redux/authSlice'


const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Projetos', path: '/projects' },
  { label: 'Certificados', path: '/certificates' }
]

export default function SuperiorMenu() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()


  const user = useSelector((state) => state.auth.user)
  const profile = useSelector((state) => state.auth.profile)

  const [bottomNavValue, setBottomNavValue] = useState(location.pathname)


  useEffect(() => {
    setBottomNavValue(location.pathname)
  }, [location.pathname])


  const getIcon = (item) => {
    switch (item) {
      case 'Home': return <Home />
      case 'Projetos': return <Folder />
      case 'Certificados': return <WorkspacePremium />
      default: return <Home />
    }
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id))
    }
  }, [user?.id, dispatch])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" sx={{ background: 'var(--background-dark)', backgroundImage: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          {/* LADO ESQUERDO: Nome (Desktop) ou Usuário Estático (Mobile) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
              Portfólio
            </Typography>

            {user && (
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
                <Avatar
                  src={profile?.avatar_url || undefined}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'var(--color-orange)',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  {!profile?.avatar_url &&
                    (profile?.username?.charAt(0).toUpperCase() || 'U')}
                </Avatar>
                <Typography variant="body2" sx={{ ml: 0.5, color: 'var(--color-white)', fontWeight: 500 }}>
                  {profile?.username || 'Usuário'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Nav Items (Apenas Desktop) */}
          {user && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1, justifyContent: 'flex-end', mr: 2 }}>
              {navItems.map((item) => (
                <Button key={item.path} onClick={() => navigate(item.path)} sx={{ color: location.pathname === item.path ? 'var(--color-orange)' : 'var(--color-white)', fontWeight: 'bold' }}>{item.label}</Button>
              ))}
            </Box>
          )}

          {/* LADO DIREITO: DropdownAppBar (Desktop e Mobile) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                {/* Desktop: Mostra com Avatar */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <DropdownAppBar isMobileToggle={false} />
                </Box>
                {/* Mobile: Mostra com Ícone Hambúrguer */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <DropdownAppBar isMobileToggle={true} />
                </Box>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{ color: 'var(--color-orange)', borderColor: 'var(--color-orange)' }}
                onClick={() => dispatch({ type: 'auth/setModalOpen', payload: true })}
              >
                Entrar
              </Button>
            )}
          </Box>

        </Toolbar>
      </AppBar>

      {/* Menu Bottom (Apenas Mobile) */}
      {user && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', sm: 'none' }, zIndex: 1100 }}>
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(e, val) => {
              setBottomNavValue(val)
              navigate(val)
            }}
            sx={{ backgroundColor: 'var(--background-dark)' }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={getIcon(item.label)}
                sx={{
                  color: 'var(--color-text-inactive)',
                  '&.Mui-selected': { color: 'var(--color-orange)' }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  )
}