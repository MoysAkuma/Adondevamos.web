import { Container, Box, Grid } from '@mui/material';
import TripCardSkeleton from './TripCardSkeleton';

function TripSkeletonList({ count = 6, maxWidth = "lg" }) {
  return (
    <Container maxWidth={maxWidth} sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {Array.from({ length: count }, (_, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0px)',
                  },
                },
              }}
            >
              <TripCardSkeleton />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TripSkeletonList;