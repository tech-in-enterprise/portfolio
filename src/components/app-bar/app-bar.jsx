import React, { useState } from 'react'
import { AppBar, Box, Toolbar, Typography, Button, Paper, BottomNavigation, BottomNavigationAction, Avatar } from '@mui/material'
import { Home, Folder, Person, WorkspacePremium } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import DropdownAppBar from './drop-down'


const navItems = ['Home', 'Projetos', 'Sobre mim', 'Certificados']

export default function SuperiorMenu() {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const profile = useSelector((state) => state.auth.profile)
  const [bottomNavValue, setBottomNavValue] = useState(0)


  const getIcon = (item) => {
    switch (item) {
      case 'Home': return <Home />
      case 'Projetos': return <Folder />
      case 'Sobre mim': return <Person />
      case 'Certificados': return <WorkspacePremium />
      default: return <Home />
    }
  }

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
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--color-orange)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ ml: 0.5, color: 'var(--color-white)', fontWeight: 500 }}>
                  {profile?.username || 'Usuário'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Nav Items (Apenas Desktop) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1, justifyContent: 'flex-end', mr: 2}}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: 'var(--color-white)', fontWeight: 'bold' }}>{item}</Button>
            ))}
          </Box>

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
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', sm: 'none' }, zIndex: 1100 }}>
        <BottomNavigation
          showLabels
          value={bottomNavValue}
          onChange={(e, val) => setBottomNavValue(val)}
          sx={{ backgroundColor: 'var(--background-dark)' }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item}
              label={item}
              icon={getIcon(item)}
              sx={{ color: 'var(--color-text-inactive)', '&.Mui-selected': { color: 'var(--color-orange)' } }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}