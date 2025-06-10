import React, { useState, useEffect } from 'react'
import { Box, Link, TextField } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IoAddCircle, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5"
import Tooltip from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, getComments } from '../../redux/commentsSlice'
import { setModalOpen } from '../../redux/authSlice'
import { MdDeleteForever } from "react-icons/md"
import { RiEditLine } from "react-icons/ri"


export default function ComentsAboutProject({ project, handleCloseComments }) {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const comments = useSelector((state) => state.comments.comments)
    const loadingComments = useSelector((state) => state.comments.loading)

    useEffect(() => {
        if (project?.id) {
            dispatch(getComments(project.id))
        }
    }, [dispatch, project?.id])

    const [showCommentBox, setShowCommentBox] = useState(false)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    //botão para entrar o componente textfild para adicionar comentário caso o haja usuário, se não tiver, abre o modal de login
    const handleIconAddComment = () => {
        if (!user) {
            dispatch(setModalOpen(true)) // Abre o modal de login
            return
        }
        setShowCommentBox(true)
    }


    // cancela a entrada de texto no textfild
    const handleCancelComment = () => {
        setComment('')
        setShowCommentBox(false)
    }

    //atualização do estado em que está sofrendo mudança, no caso o textfild
    const handleCommentChange = (e) => setComment(e.target.value)

    //tratativa dos dados antes de enviar e depois envio para o banco de dados
    const handleSaveComment = async () => {
        if (!comment.trim()) return

        const commentData = {
            user_id: user.id,
            project_id: project.id,
            comment
        }

        setLoading(true)

        try {
            await dispatch(addComment(commentData))
            await dispatch(getComments(project.id))
            setComment('')
            setShowCommentBox(false)
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <React.Fragment>
            <Card sx={{ maxWidth: 400, height: '100%', border: '1px solid #ccc', borderTopRightRadius: 3, borderTopLeftRadius: 3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative', }} >
                <Box sx={{ position: 'relative', height: 500, background: '#121212' }}>
                    <HighlightOffIcon onClick={handleCloseComments} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', '&:hover': { color: '#ff5722' }, }} />
                    <CardContent>
                        <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                            Comentários do Projeto
                        </Typography>
                        {showCommentBox && (
                            <>
                                <TextField
                                    value={comment}
                                    onChange={handleCommentChange}
                                    multiline
                                    rows={3}
                                    placeholder="Escreva seu comentário aqui..."
                                    fullWidth
                                    variant="outlined"
                                    disabled={loading}
                                    sx={{ mb: 2, background: '#ffffff', borderColor: '#ff5722' }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Typography onClick={handleSaveComment} variant="contained" sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <IoCheckmarkCircleSharp style={{ marginRight: 8 }} />
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </Typography>
                                    <Typography onClick={handleCancelComment} variant="contained" sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <IoCloseCircleSharp style={{ marginRight: 8 }} />
                                        Cancelar
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {!loadingComments && comments.length === 0 && (
                            <Typography sx={{ color: '#fff', mt: 2 }}>Nenhum comentário ainda.</Typography>
                        )}

                        {comments.length > 0 && (
                            <Box sx={{ maxHeight: '100%', overflowY: 'auto', mt: 2, mb: 2 }}>
                                {comments.map((c) => (
                                    <Box key={c.id} sx={{ mb: 1, p: 1, backgroundColor: '#222', borderRadius: 1 }}>
                                        <Typography sx={{ color: '#fdb913', fontWeight: 'bold', fontSize: 14 }}>
                                            {c.profiles?.username || 'Anônimo'}:
                                        </Typography>
                                        <Typography sx={{ color: '#fff', fontSize: 12 }}>
                                            {c.comment}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, color: '#cdcdcd' }}>
                                            <Tooltip title="Editar comentário" arrow >
                                                <RiEditLine style={{ cursor: 'pointer' }} />
                                            </Tooltip>
                                            <Tooltip title="Deletar comentário" arrow>
                                                <MdDeleteForever style={{ cursor: 'pointer' }} />
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                    {!showCommentBox && (
                        <Tooltip title="Adicionar Comentário" arrow>
                            <Link onClick={handleIconAddComment} underline="none" sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', color: '#ffffff', fontWeight: 'bold', transition: 'color 0.3s ease', '&:hover': { color: '#ff5722' }, '& svg': { marginRight: 1, transition: 'color 0.3s ease' }, }}>
                                <IoAddCircle fontSize={32} />
                            </Link>
                        </Tooltip>
                    )}
                </Box>
            </Card>
        </React.Fragment>
    )
}
