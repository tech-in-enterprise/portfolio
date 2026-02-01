import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Toolbar } from '@mui/material'
import customTheme from '../styles/theme'
import SuperiorMenu from '../components/app-bar/app-bar'

export default function AppLayout() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />

      {/* Menu fixo (top + bottom mobile) */}
      <SuperiorMenu />

      {/* Espaço do AppBar */}
      <Toolbar />

      {/* Conteúdo das páginas */}
      <Box component="main">
        <Outlet />

        {/* Spacer do BottomNavigation (mobile) */}
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
      </Box>
    </ThemeProvider>
  )
}
