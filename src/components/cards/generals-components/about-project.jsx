import React from 'react'
import { Box, Link, Card, CardContent, Typography } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useSelector } from 'react-redux'
import { FaGithub } from "react-icons/fa" 




export default function AboutProject({ handleResetInfoClick, projectId }) {
    // Buscando os projetos do Redux
    const projects = useSelector((state) => state.projects.projects)
    
    // Encontra o projeto pelo ID ou pega o primeiro como padrão
    const project = projects.find(p => p.id === projectId) || projects[0]

    if (!project) return null

    return (
        <React.Fragment>
            <Card sx={{ maxWidth: 400, border: '1px solid #ccc', borderTopRightRadius: 3, borderTopLeftRadius: 3, boxShadow: 'var(--box-shadow)', backgroundColor: 'var(--background-white)', overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ position: 'relative', height: 470, background: '#121212' }}>
                    <HighlightOffIcon 
                        onClick={handleResetInfoClick} 
                        sx={{ position: 'absolute', top: 5, right: 5, fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-white)', '&:hover': { color: 'var(--color-orange)' } }} 
                    />
                    
                    <CardContent sx={{ textAlign: 'center' }}>
                        {/* Nome do Projeto vindo do Banco */}
                        <Typography variant="h6" sx={{ color: 'var(--color-white)', textAlign: 'center', fontWeight: 'bold' }}>
                            {project.name}
                        </Typography>

                        {/* Descrição Detalhada vinda do Banco */}
                        <Box sx={{ background: '#121212', color: 'var(--color-white)', textAlign: 'initial', mt: 2, p: 2, borderRadius: 2, border: '2px solid', borderColor: 'var(--color-orange)' }}>
                            <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-line' }}>
                                {project.detailed_description}
                            </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ color: 'var(--color-white)', textAlign: 'center', fontWeight: 'bold', mt: 2 }}>
                            Tecnologias utilizadas
                        </Typography>

                        {/* Listagem de Tecnologias (Apenas Texto do Banco) */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 1, flexWrap: 'wrap' }}>
                            {project.technologies?.map((tech, index) => (
                                <Typography 
                                    key={index} 
                                    sx={{ 
                                        color: 'var(--color-orange)', 
                                        fontSize: '13px', 
                                        fontWeight: '500',
                                        backgroundColor: 'rgba(255, 165, 0, 0.1)', // Um fundo bem sutil
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {tech}
                                </Typography>
                            ))}
                        </Box>

                        {/* Link do Github vindo do Banco */}
                        {project.github_url && (
                            <Link 
                                href={project.github_url} 
                                target="_blank" 
                                underline="none" 
                                rel="noopener noreferrer" 
                                sx={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: 15, right: 15, cursor: 'pointer', color: 'var(--color-white)', fontWeight: 'bold', '&:hover': { color: 'var(--color-orange)' } }}
                            >
                                <FaGithub style={{ marginRight: '8px' }} />
                                <Typography sx={{ fontSize: 12 }}>
                                    Ver código no Github
                                </Typography>
                            </Link>
                        )}
                    </CardContent>
                </Box>
            </Card>
        </React.Fragment>
    )
}