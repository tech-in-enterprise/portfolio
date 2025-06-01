import React from 'react'
import { Box, Link } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IoAddCircle } from "react-icons/io5"
import Tooltip from '@mui/material/Tooltip'


export default function ComentsAboutProject({ handleCloseComments }) {

    return (
        <React.Fragment>
            <Card sx={{ maxWidth: 400, border: '1px solid #ccc', borderRadius: 3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ position: 'relative', height: 500, background: '#121212' }}>
                    <HighlightOffIcon onClick={handleCloseComments} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: '#ffffff', '&:hover': { color: '#ff5722' } }} />
                    <CardContent>
                        <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>
                            Comentários do Projeto
                        </Typography>
                        <Box sx={{ mt: 2, color: '#ffffff' }}>
                            <Typography sx={{ fontSize: '14px', mb: 2 }}>
                                Adicione seus comentários aqui:
                            </Typography>
                        </Box>
                    </CardContent>
                    <Tooltip title="Adicionar Comentário" arrow>
                        <Link target="_blank" underline="none" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', color: '#ffffff', fontWeight: 'bold', transition: 'color 0.3s ease', '&:hover ': { color: '#ff5722' }, '& svg': { marginRight: 1, transition: 'color 0.3s ease' } }}>
                            <IoAddCircle fontSize={32} />
                        </Link>
                    </Tooltip>
                </Box>
            </Card>

        </React.Fragment>
    )
}
