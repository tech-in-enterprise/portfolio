import { useState } from 'react'
import { Box, Modal, TextField, Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setModalOpen, setUser, toggleLoginMode } from '../../redux/authSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { supabase } from '../../services/supabase'

export default function Authentication() {
  const dispatch = useDispatch()
  const { isModalOpen, isLoginMode } = useSelector((state) => state.auth)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 1. Tradutor de Erros Profissional (Não exibe erros de banco)
  const translateError = (err) => {
    const message = err.message || ''
    if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
    if (message.includes('User already registered')) return 'Este e-mail já está cadastrado.'
    if (message.includes('Password should be')) return 'A senha deve ter pelo menos 6 caracteres.'
    if (message.includes('network error')) return 'Erro de conexão. Verifique sua internet.'
    return 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
  }

  // 2. Função Específica de Login
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  // 3. Função Específica de Cadastro
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } } // Metadata para a trigger
    })
    
    if (error) throw error

    // Insere o perfil manualmente (Caso não tenha Trigger ativa no Supabase)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, username }])
    
    if (profileError && !profileError.message.includes('duplicate key')) {
      throw profileError
    }

    return data.user
  }

  // 4. Função Orquestradora
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!email || !password || (!isLoginMode && !username)) {
        throw new Error('Preencha todos os campos obrigatórios.')
      }

      // Executa Login ou Cadastro
      const user = isLoginMode ? await handleSignIn() : await handleSignUp()

      // Busca dados do Perfil (Username) para o Redux
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      const userWithUsername = {
        ...user,
        username: profile?.username || username || 'Usuário',
      }

      // Finaliza processo de autenticação
      dispatch(setUser(userWithUsername))
      localStorage.setItem('authUser', JSON.stringify(userWithUsername))
      
      dispatch(setModalOpen(false))
      alert(isLoginMode ? 'Bem-vindo de volta!' : 'Cadastro realizado com sucesso!')

    } catch (err) {
      // Exibe apenas a mensagem tratada, escondendo logs técnicos do banco
      setError(translateError(err))
      console.error('Auth Error Log:', err) // Mantém no console para o dev, mas não para o user
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
          <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, background: '#ff5722', borderColor: '#ff5722', '&:hover': { background: '#e64a19' } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Carregando...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
        </Button>

        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 2 }}>
          <Typography
            component="div"
            sx={{
              fontSize: 12,
              cursor: 'pointer',
              '& .highlight': { color: '#ff5722' },
              '&:hover .highlight': { textDecoration: 'underline' },
            }}
            onClick={() => dispatch(toggleLoginMode())}
          >
            {isLoginMode ? (
              <Box>
                Não possui conta? <span className="highlight">Cadastre-se</span>
              </Box>
            ) : (
              <Box>
                Já possui conta? Faça <span className="highlight">login</span>
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}