import * as React from 'react'
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from '@mui/material'
import { Settings, Logout, Palette, AccountCircle, Menu as MenuIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../redux/authSlice' 
import { supabase } from '../../services/supabase'

export default function DropdownAppBar({ isMobileToggle = false }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const dispatch = useDispatch()
    const profile = useSelector((state) => state.auth.profile)

    const handleClick = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleLogout = async () => {
        try {
            handleClose()
            localStorage.removeItem('activeMenuItem') 
            await supabase.auth.signOut()
            dispatch(logout())

        } catch (err) {
            console.error('Erro ao deslogar:', err)
        }
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={isMobileToggle ? "Menu" : "Configurações"}>
                    <IconButton onClick={handleClick} size="small" color="inherit">
                        {isMobileToggle ? (
                            <MenuIcon sx={{ color: 'var(--color-white)' }} />
                        ) : (
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--color-orange)', fontSize: '0.85rem', fontWeight: 'bold'}}>
                                {profile?.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            mt: 1.5,
                            backgroundColor: 'var(--background-dark)',
                            color: 'var(--color-white)',
                            border: '1px solid var(--color-text-inactive)',
                            '& .MuiListItemIcon-root': { color: 'var(--color-white)' },
                            '&::before': {
                                content: '""', display: 'block', position: 'absolute',
                                top: 0, right: 14, width: 10, height: 10,
                                bgcolor: 'var(--background-dark)',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
            >
                <MenuItem><ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon> Perfil</MenuItem>
                <MenuItem><ListItemIcon><Palette fontSize="small" /></ListItemIcon> Tema</MenuItem>
                <MenuItem><ListItemIcon><Settings fontSize="small" /></ListItemIcon> Configurações</MenuItem>
                <Divider sx={{ bgcolor: 'var(--color-text-inactive)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: 'var(--color-orange)' }}>
                    <ListItemIcon><Logout fontSize="small" sx={{ color: 'var(--color-orange)' }} /></ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}