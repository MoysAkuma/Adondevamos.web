import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 
    {
        useMediaQuery,
        useTheme,
        ButtonGroup,
        Stack,
        Avatar,
        Typography,
        Paper,
        Button
    } from '@mui/material';
import { FlightTakeoff, AccountCircle, AddLocation, Favorite, Flight, WhereToVote } from '@mui/icons-material';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import { Box } from "@mui/system";
import { styled } from '@mui/material/styles';


function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    
    return (
          <CenteredTemplate>
            <Typography variant="h3"  gutterBottom align="center" >
              AdondeVamos
            </Typography>
            
            <Typography variant="h5"  gutterBottom align="center">
              What is Adondevamos?
            </Typography>
            <Typography variant="h5"  gutterBottom align="center">
              How to use it?
            </Typography>
             <Box sx={{ flexGrow: 3, overflow: 'hidden', px: 3 }}>
                <Stack spacing={2} direction="row" sx={{ align: 'left', mb: 4 }}>

                  <Avatar>
                    <FlightTakeoff />
                  </Avatar>
                  <Typography noWrap variant="p" > Add your trip</Typography>
                </Stack>

                <Stack spacing={2} direction="row" sx={{ alignContent:'right', mb: 4 }}>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                  <Typography noWrap>Add your friends</Typography>
                </Stack>

                <Stack spacing={2} direction="row" sx={{ align: 'left', mb: 4 }}>
                  <Avatar>
                    <AddLocation />
                  </Avatar>
                  <Typography noWrap>Add places that you and your friend want to go</Typography>
                </Stack>
                
                <Stack spacing={2} direction="row" sx={{ align: 'left', mb: 4 }}>
                  <Avatar>
                    <Favorite />
                  </Avatar>
                  <Typography noWrap>Vote and decide adondevamos</Typography>
                </Stack>
            </Box>
            <Typography variant="h5"  gutterBottom align="center">
              Where you want to go today?
            </Typography>
            <ButtonGroup 
                        variant="contained" 
                        color="primary" 
                        fullWidth sx={{ mt: 2, mb: 4 }}> 
              <Button 
                variant="contained" 
                startIcon={ <Flight/> }
                href="/Trips" >
                  Explore Trips 
            </Button>

            <Button 
                variant="outlined" 
                startIcon={ <WhereToVote/> }
                href="/Places" >
                  Explore Places 
            </Button>

            </ButtonGroup>
          </CenteredTemplate>
    );
  };
  export default Home;