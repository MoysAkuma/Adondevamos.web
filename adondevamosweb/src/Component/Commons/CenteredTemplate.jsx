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
    
    <Container maxWidth="sm" sx={{ 
      py : 5,
      pb : 2, 
      backgroundColor: 'white', 
      borderRadius: 3, 
      boxShadow: 3 }}>
      <a href="/">
        <img 
          src="/Logo.png" 
          width="120" 
          height="120" 
          alt="Logo" 
          style={
            { 
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
    <Box sx={{ mt: 1, mb: 0, textAlign: 'center', color: 'white' }}>
      Site made by <a href='https://github.com/MoysAkuma'>@MoysAkuma</a>
    </Box>
  </Box>
);

export default CenteredTemplate;