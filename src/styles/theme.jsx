import { createTheme } from '@mui/material/styles'

let theme = createTheme({
    // Configurações Globais 
    mixins: {
        toolbar: {
            minHeight: 44,
        },
    },
})

// Extensão do tema para incluir variáveis CSS e componentes
theme = {
    ...theme,
    components: {

        // 1. Definição das Variáveis CSS Nativas no :root
        MuiCssBaseline: {
            styleOverrides: {
                // Estas variáveis CSS podem ser acessadas em qualquer lugar com var(--nome-da-variavel)
                ':root': {
                    //background principais
                    '--background-dark': '#000000', // Fundo Preto para background
                    '--background-white': '#ffffff', //branco puro para color
                    '--box-shadow': '0 8px 16px rgba(0, 0, 0, 0.2)',
                    
                    //cores principais
                    '--color-white': 'rgba(255, 255, 255, 1)', // Branco Puro 
                    '--color-dark': '#000000', // Preto Puro para color
                    '--color-black-matte': '#262626', //preto fosco
                    '--color-orange': '#ff5722', // laranja (Destaque)
                    '--color-text-inactive': 'rgba(255, 255, 255, 0.43)', // Cinza (Texto Inativo)
                    '--color-gray-easy': '#dbdbdb', // Cinza (Texto Inativo)

                    '--linear-gradient-principal': 'linear-gradient(to right, rgba(255, 5, 5, 0.5) 20%, rgba(79, 75, 75, 0.5) 100%)' 
                },
                
                '@keyframes slide-text': {
                    '0%': { transform: 'translateX(100%)' },  // Começa fora da tela (direita)
                    '100%': { transform: 'translateX(-100%)' }, // Termina fora da tela (esquerda)
                },

            },
        },



   
    },
}

export default theme