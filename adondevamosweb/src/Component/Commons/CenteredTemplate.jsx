import React from 'react';
import { Box, Container } from '@mui/material';

const CenteredTemplate = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(/Background.JPEG)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    
    <Container maxWidth="sm" sx={{ py: 9, backgroundColor: 'white', borderRadius: 3, boxShadow: 3 }}>
      <a href="/">
        <img 
          src="/Logo.png" 
          width="120" 
          height="120" 
          alt="Logo" 
          style={
            { 
              marginBottom: '8px', 
              display: 'block', 
              marginLeft: 'auto', 
              marginRight: 'auto',
              colorScheme: 'light only'
            }
          } 
        />
      </a>
      {children}
    </Container>
    <Box sx={{ mt: 1, mb: 2, textAlign: 'center', color: 'white' }}>
      Site made by <b>@MoysAkuma</b>
    </Box>
  </Box>
);

export default CenteredTemplate;