import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  FlightTakeoff,
  AccountCircle,
  AddLocation,
  Favorite,
  Flight,
  WhereToVote
} from '@mui/icons-material';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";

const StepCard = ({ icon: Icon, title, subtitle }) => (
  <Paper
    elevation={1}
    sx={{
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      p: 2,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.9)'
    }}
  >
    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
      <Icon sx={{ fontSize: 28 }} />
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Paper>
);

function Home() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <CenteredTemplate>
      <Box sx={{ width: '100%' }}>
        <Typography variant={isSmUp ? "h3" : "h4"} gutterBottom align="center">
          AdondeVamos
        </Typography>

        <Typography variant="h6"  align="center">
          What is Adondevamos?
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          AdondeVamos is a platform that helps you and your friends to decide <b>where to go</b> on your next trip.
          You can create <b>trips</b>, add <b>places</b>, <b>invite your friends</b>, and <b>vote</b> for the best options.
          It's easy and fun!
        </Typography>
        <Typography variant="h6" align="center" sx={{ mt: 1 }}>
          Where you want to go today?
        </Typography>

          <ButtonGroup
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            <Button
              startIcon={<Flight />}
              component={Link}
              to="/Trips"
            >
              Explore Trips
            </Button>

            <Button
              variant="outlined"
              startIcon={<WhereToVote />}
              component={Link}
              to="/Places"
            >
              Explore Places
            </Button>
          </ButtonGroup>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          How to use it?
        </Typography>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6}
          >
            <StepCard
              icon={FlightTakeoff}
              title="Add your trip"
              subtitle="You just need a cool name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StepCard
              icon={AccountCircle}
              title="Add your friends"
              subtitle="Invite others to join the plan"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StepCard
              icon={AddLocation}
              title="Add places"
              subtitle="Add places that you and your friends want to visit"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StepCard
              icon={Favorite}
              title="Vote"
              subtitle="Vote and decide where to go"
            />
          </Grid>
        </Grid>

        
      </Box>
    </CenteredTemplate>
  );
}

export default Home;