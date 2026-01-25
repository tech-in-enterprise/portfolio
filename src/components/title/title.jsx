import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'



export default function Title({title}) {
  return (
  <Box sx={{m: 2, textAlign: 'center', display: { xs: 'none', sm: 'block'} }}>
    <Typography variant="h4" className="font-bold text-center" sx={{fontWeight: 'bold'}}>
        {title}
      </Typography>
  </Box>
  )
}
