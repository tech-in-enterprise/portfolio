import React, { useState, useEffect } from 'react'
import { Box, Link, TextField } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IoAddCircle } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { IoIosCloseCircleOutline } from "react-icons/io"
import Tooltip from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, deleteComment, fetchCommentsTotal, getComments, updateComment } from '../../redux/commentsSlice'
import { setModalOpen } from '../../redux/authSlice'
import { MdDeleteOutline } from "react-icons/md"
import { RiEditLine } from "react-icons/ri"

export default function ComentsAboutProject({ project, handleCloseComments }) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const comments = useSelector((state) => state.comments.comments)
    const loadingComments = useSelector((state) => state.comments.loading)


    useEffect(() => {
        console.log("ID do Projeto recebido:", project?.id); // Verifique se o ID chega
        if (project?.id) {
            dispatch(getComments(project.id)).then((res) => {
                console.log("Resultado do GetComments:", res.payload); // Verifique se o banco retorna algo
            });
        }
    }, [dispatch, project?.id])


    const [showCommentBox, setShowCommentBox] = useState(false)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedText, setEditedText] = useState('')


    //botão para entrar o componente textfild para adicionar comentário caso o haja usuário, se não tiver, abre o modal de login
    const handleIconAddComment = () => {
        if (!user) {
            dispatch(setModalOpen(true))
            return
        }
        setShowCommentBox(true)
        setEditingCommentId(null)
        setEditedText('')
    }

    // cancela a entrada de texto no textfild
    const handleCancelComment = () => {
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

    // Quando clicar no ícone de editar
    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id)
        setEditedText(comment.comment)
        setShowCommentBox(false)
    }

    //para salvar a edição
    const handleSaveEditedComment = async () => {
        if (!editedText.trim()) return

        setLoading(true)
        try {
            await dispatch(updateComment({ comment_id: editingCommentId, updatedComment: editedText }))
            setEditingCommentId(null)
            setEditedText('')
        } catch (error) {
            console.error('Erro ao salvar comentário editado:', error)
        } finally {
            setLoading(false)
        }
    }


    // cancelar edição
    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setEditedText('')
    }

    //deletar comentário
    const handleDeleteComment = async (comment_id) => {
        try {
            await dispatch(deleteComment(comment_id))
            await dispatch(fetchCommentsTotal(project.id))
        } catch (error) {
            console.error('Erro ao excluir comentário:', error)
        }
    }

    // Função para comparar ids (string ou number)
    const isUserProjectOwner = () =>
        user?.id?.toString() === project?.user_id?.toString()

    const isUserCommentOwner = (commentUserId) =>
        user?.id?.toString() === commentUserId?.toString()





    return (
        <Card sx={{ maxWidth: 400, border: '1px solid #ccc', borderTopRightRadius: 3, borderTopLeftRadius: 3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative' }} >
            <Box sx={{ position: 'relative', height: 500, background: '#121212' }}>
                <HighlightOffIcon onClick={handleCloseComments} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', '&:hover': { color: '#ff5722' } }} />
                <CardContent>
                    <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                        Comentários do Projeto
                    </Typography>


                    {showCommentBox && (
                        <>
                            <TextField value={comment} onChange={handleCommentChange} multiline rows={3} placeholder="Escreva seu comentário aqui..." fullWidth variant="outlined" disabled={loading} sx={{
                                mb: 2, background: '#222', borderColor: '#ff5722',
                                '& .MuiInputBase-input': {
                                    color: '#ffffff',
                                    fontSize: 12,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#fdb913',
                                    }
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fdb913',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fdb913',
                                },
                            }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography onClick={handleSaveComment} sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <IoIosCheckmarkCircleOutline size={22} style={{ marginRight: 8 }} />
                                </Typography>
                                <Typography onClick={handleCancelComment} sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <IoIosCloseCircleOutline size={22} style={{ marginRight: 8 }} />
                                </Typography>
                            </Box>
                        </>
                    )}

                    {!loadingComments && comments.length === 0 && (
                        <Typography sx={{ color: '#fff', mt: 2 }}>Nenhum comentário ainda.</Typography>
                    )}

                    {comments.length > 0 && (
                        <Box
                            sx={{
                                mt: 2,
                                mb: 2,
                                height: 400,
                                overflowY: 'hidden',
                                position: 'relative',
                                '&:hover': {
                                    overflowY: 'auto',
                                },
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    width: '0px',
                                },
                            }}
                        >
                            {comments.map((c) => (
                                <Box key={c.id} sx={{ mb: 1, p: 1, backgroundColor: '#222', borderRadius: 1, border: '1px solid #fdb913', }}>
                                    <Typography sx={{ color: '#fdb913', fontWeight: 'bold', fontSize: 14 }}>
                                        {c.profiles?.username || 'Anônimo'}:
                                    </Typography>

                                    {editingCommentId === c.id ? (
                                        <>
                                            <TextField
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                multiline
                                                rows={2}
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    background: '#222',
                                                    mb: 1,
                                                    '& .MuiInputBase-input': {
                                                        color: '#ffffff',
                                                        fontSize: 12,
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: '#fdb913',
                                                        }
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#fdb913',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fdb913',
                                                    },
                                                }}
                                            />

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <Tooltip title="Salvar edição" arrow >
                                                    <Box sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' } }}>
                                                        <IoIosCheckmarkCircleOutline onClick={handleSaveEditedComment} />
                                                    </Box>
                                                </Tooltip>
                                                <Tooltip title="Cancelar edição" arrow>
                                                    <Box sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' } }}>
                                                        <IoIosCloseCircleOutline onClick={handleCancelEdit} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ color: '#fff', fontSize: 12 }}>{c.comment}</Typography>

                                            {(isUserCommentOwner(c.user_id) || isUserProjectOwner()) && (
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, color: '#cdcdcd' }}>
                                                    {isUserCommentOwner(c.user_id) && (
                                                        <Tooltip title="Editar comentário" arrow>
                                                            <Box sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' } }}>
                                                                <RiEditLine onClick={() => handleEditComment(c)} style={{ cursor: 'pointer' }} />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title="Deletar comentário" arrow>
                                                        <Box sx={{ color: '#ffffff', '&:hover': { color: '#e64a19' } }}>
                                                            <MdDeleteOutline onClick={() => handleDeleteComment(c.id)} style={{ cursor: 'pointer' }} />
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </CardContent>

                {!showCommentBox && (
                    <Tooltip title="Adicionar Comentário" arrow>
                        <Link onClick={handleIconAddComment} underline="none" sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', color: '#ffffff', fontWeight: 'bold', transition: 'color 0.3s ease', '&:hover': { color: '#ff5722' } }}>
                            <IoAddCircle fontSize={32} />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </Card>
    )
}