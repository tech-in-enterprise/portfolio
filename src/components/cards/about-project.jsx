import React from 'react'
import { Box, Link } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { FaGithub, FaPython, FaJsSquare, FaFastForward, FaReact  } from "react-icons/fa"
import { SiAxios, SiVite  } from "react-icons/si"
import { BiLogoPostgresql } from "react-icons/bi"



export default function AboutProject({ handleResetInfoClick }) {

    return (
        <React.Fragment>
            <Card sx={{ maxWidth: 400, border: '1px solid #ccc', borderTopRightRadius: 3, borderTopLeftRadius: 3, boxShadow: 'var(--box-shadow)', backgroundColor: 'var(--background-white)', overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ position: 'relative', height: 470, background: '#121212' }}>
                    <HighlightOffIcon onClick={handleResetInfoClick} sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-white)', '&:hover': { color: 'var(--color-orange)' } }} />
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'var(--color-white)', textAlign: 'center', fontWeight: 'bold' }}>
                            Descrição sobre o projeto
                        </Typography>
                        <Box sx={{ background: '#121212', color: 'var(--color-white)', textAlign: 'initial', mt: 2, p: 2, borderRadius: 2, border: '2px solid', borderColor:'var(--color-orange)'}}>
                            <Typography sx={{ fontSize: '14px' }} gutterBottom>
                                Lembra de como é chegar em uma cidade que você não conhece nada?
                            </Typography>
                            <Typography sx={{ fontSize: '14px' }}>
                                Sentir que você não conseguiu aproveitar tudo que a cidade havia para oferecer?
                            </Typography>
                            <Typography sx={{ fontSize: '14px' }}>
                                Agora imagine ter uma ferramenta que facilita sua vida desde o primeiro momento.
                            </Typography>
                            <Typography sx={{ fontSize: '14px' }}>
                                Bem, esse é o <span style={{ color: 'var(--color-orange)', fontWeight: 'bold' }}>concierge virtual! </span>
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: 'var(--color-white)', textAlign: 'center', fontWeight: 'bold', mt: 2 }}>
                            Tecnologias utilizadas neste projeto
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                            <FaJsSquare title="JavaScript" size={32} color="#F7DF1E" />
                            <SiVite title="Vite" size={32} color="#FBCB68"/>
                            <FaReact title="React" size={32} color="#61DAFB"/>
                            <FaPython title="Python" size={32} color="#3776AB" />
                            <FaFastForward title="FastAPI" size={32} color="#009688" />
                            <BiLogoPostgresql title="PostgreSQL" size={32} color="#336791" />
                            <SiAxios title="Axios" size={32} color="#5A29E4" />
                        </Box>
                        <Link href="https://github.com/tech-in-enterprise/portfolio.git" target="_blank" underline="none" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', color: 'var(--color-white)', fontWeight: 'bold', transition: 'color 0.3s ease', '&:hover ': { color: 'var(--color-orange)' }, '& svg': { marginRight: 1, transition: 'color 0.3s ease' } }}>
                            <FaGithub />
                            <Typography sx={{ fontSize: 12 }}>
                                Ver código no Github
                            </Typography>
                        </Link>
                    </CardContent>
                </Box>
            </Card>
        </React.Fragment>
    )
}
