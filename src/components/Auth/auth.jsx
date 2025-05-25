import { useState } from 'react'
import { Box, Modal, TextField, Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen, setUser, toggleLoginMode } from '../../redux/authSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { supabase } from '../../services/supabase'

export default function Authentication() {
    const dispatch = useDispatch()
    const { isModalOpen, isLoginMode } = useSelector((state) => state.auth)

    // Estados locais para os campos
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            if (isLoginMode) {
                // Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                dispatch(setUser(data.user))
                if (error) throw error
                alert('Login realizado com sucesso!')
            } else {
                // Cadastro
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { username } },
                })
                if (error) throw error
                alert('Cadastro realizado com sucesso! Verifique seu email para confirmar.')
            }
            dispatch(setModalOpen(false))
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (

        <Modal open={isModalOpen} onClose={() => dispatch(setModalOpen(false))}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '80%', sm: 400 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3, maxHeight: '90vh', overflowY: 'auto',}}>
                <HighlightOffIcon onClick={() => dispatch(setModalOpen(false))} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: 'red' } }} />
                <Typography variant="h6" component="h2">
                    {isLoginMode ? 'Login' : 'Cadastre-se'}
                </Typography>
                {!isLoginMode && (
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Usuário"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                )}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
                <Button fullWidth variant="contained" sx={{ background: '#ff5722', borderColor: '#ff5722' }} onClick={handleSubmit} disabled={loading} >
                    {loading ? 'Carregando...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
                </Button>
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Typography component="div" sx={{ mt: 1, fontSize: 12, '& .highlight': { color: '#ff5722' }, '&:hover .highlight': { textDecoration: 'underline' } }} onClick={() => dispatch(toggleLoginMode())}>
                        {isLoginMode
                            ?
                            <Box>
                                Não possui conta? <span className="highlight" style={{ cursor: 'pointer' }}>Cadastre-se</span>
                            </Box>
                            :
                            <Box>
                                Já possui conta? Faça <span className="highlight" style={{ cursor: 'pointer' }}>login</span>
                            </Box>
                        }
                    </Typography>
                </Box>
            </Box>

        </Modal >
    )
}
