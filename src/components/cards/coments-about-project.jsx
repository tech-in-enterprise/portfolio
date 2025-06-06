import React, { useState } from 'react'
import { Box, Link, TextField, Button, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IoAddCircle, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5"
import Tooltip from '@mui/material/Tooltip'

export default function ComentsAboutProject({ handleCloseComments }) {
    const [showCommentBox, setShowCommentBox] = useState(false)
    const [comment, setComment] = useState('')

    const handleAddComment = () => setShowCommentBox(true)
    const handleCancelComment = () => {
        setComment('')
        setShowCommentBox(false)
    }
    const handleCommentChange = (e) => setComment(e.target.value)
    const handleSaveComment = () => {
        console.log('Comentário:', comment)
        setComment('')
        setShowCommentBox(false)
    }

    return (
        <React.Fragment>
            <Card
                sx={{
                    maxWidth: 400,
                    border: '1px solid #ccc',
                    borderRadius: 3,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Box sx={{ position: 'relative', height: 500, background: '#121212' }}>
                    <HighlightOffIcon
                        onClick={handleCloseComments}
                        sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: '#ffffff',
                            '&:hover': { color: '#ff5722' },
                        }}
                    />
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
                                    sx={{ mb: 2, background: '#ffffff', borderColor: '#ff5722' }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Typography onClick={handleSaveComment} variant="contained" sx={{ color: '#ffffff', cursor: 'pointer', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center' }}>
                                        <IoCheckmarkCircleSharp style={{ marginRight: 8 }} />
                                        Salvar
                                    </Typography>
                                    <Typography onClick={handleSaveComment} variant="contained" sx={{ color: '#ffffff', cursor: 'pointer', '&:hover': { color: '#e64a19' }, display: 'flex', alignItems: 'center' }}>
                                        <IoCloseCircleSharp style={{ marginRight: 8 }} />
                                        Cancelar
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </CardContent>
                    {!showCommentBox && (
                        <Tooltip title="Adicionar Comentário" arrow>
                            <Link
                                onClick={handleAddComment}
                                underline="none"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    bottom: 5,
                                    right: 5,
                                    cursor: 'pointer',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    transition: 'color 0.3s ease',
                                    '&:hover': { color: '#ff5722' },
                                    '& svg': { marginRight: 1, transition: 'color 0.3s ease' },
                                }}
                            >
                                <IoAddCircle fontSize={32} />
                            </Link>
                        </Tooltip>
                    )}
                </Box>
            </Card>
        </React.Fragment>
    )
}
