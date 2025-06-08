import { useState } from 'react'
import { Box, Modal, TextField, Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen, setUser, toggleLoginMode } from '../../redux/authSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { supabase } from '../../services/supabase'

export default function Authentication() {
  const dispatch = useDispatch()
  const { isModalOpen, isLoginMode } = useSelector((state) => state.auth)

  // Adiciona username no estado
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

   const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!email || !password || (!isLoginMode && !username)) {
        setError('Todos os campos são obrigatórios.')
        setLoading(false)
        return
      }

      let user

      if (isLoginMode) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        user = data.user
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        user = data.user

        // Insere username na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username }])
        if (profileError) throw profileError
      }

      // Aqui: busca o username na tabela profiles (para login e cadastro)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Junta user com username do profile
      const userWithUsername = {
        ...user,
        username: profile?.username || null,
      }

      dispatch(setUser(userWithUsername))
      localStorage.setItem('authUser', JSON.stringify(userWithUsername))

      alert(isLoginMode ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!')
      dispatch(setModalOpen(false))
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={isModalOpen} onClose={() => dispatch(setModalOpen(false))}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '80%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <HighlightOffIcon
          onClick={() => dispatch(setModalOpen(false))}
          sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: 'red' } }}
        />
        <Typography variant="h6" component="h2">
          {isLoginMode ? 'Login' : 'Cadastre-se'}
        </Typography>

        {!isLoginMode && (
          <TextField
            fullWidth
            margin="normal"
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ background: '#ff5722', borderColor: '#ff5722' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Carregando...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Typography
            component="div"
            sx={{
              mt: 1,
              fontSize: 12,
              '& .highlight': { color: '#ff5722' },
              '&:hover .highlight': { textDecoration: 'underline' },
            }}
            onClick={() => dispatch(toggleLoginMode())}
          >
            {isLoginMode ? (
              <Box>
                Não possui conta? <span className="highlight" style={{ cursor: 'pointer' }}>Cadastre-se</span>
              </Box>
            ) : (
              <Box>
                Já possui conta? Faça <span className="highlight" style={{ cursor: 'pointer' }}>login</span>
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
