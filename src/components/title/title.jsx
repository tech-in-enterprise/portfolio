import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'



export default function Title({title}) {
  return (
  <Box sx={{m: 2, textAlign: 'center' }}>
    <Typography variant="h4" className="font-bold text-center">
        {title}
      </Typography>
  </Box>
  )
}
