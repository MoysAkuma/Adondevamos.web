import { useState, useEffect } from "react";
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        List,
        ListItem,
        ListItemText
    } from '@mui/material';

import Memberlist from '../Component/Memberlist'
import { X } from "@mui/icons-material";

function ViewTrip(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tripMock, setTripMock] = useState({
        name: 'Nihon Trip 2024',
        description: 'A two weeks trip i made to reach my dream to see japan',
        itinerary:[
            {
                Place:{
                    name:"Donkey Xote",
                    facilities : [
                        {
                            id:1,
                            name:"WC"
                        }
                    ]
                }
            }
        ],
        initialDate:"02/02/2024",
        finalDate:"18/02/2024",
        isInternational:true,
        countryID: 2,
        stateID: null,
        cityID: null,
        memberlist:[
            {
                id : 1,
                name : "Moises Moran",
                role : "Admin"
            }
        ]
    });
    return (<Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography gutterBottom variant="h5" component="div">
            View Trip
            </Typography>
            
            <Typography gutterBottom variant="h6" component="div">
                Name
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                tripMock.name
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Description
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                tripMock.description
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Initial Date
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                tripMock.initialDate
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Final Date
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                tripMock.finalDate
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Members
            </Typography>

            <Memberlist members={tripMock.memberlist}/>

            <Typography gutterBottom variant="h6" component="div">
                Itinerary
            </Typography>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    tripMock.itinerary.map((item) => (
                        <>
                        <ListItem key={item.id}>
                                <ListItemText 
                                    primary={item.Place.name} 
                                    secondary={item.Place.facilities.map(y=>y.name).join(",")} />
                            </ListItem>
                        </>
                    ))
                }
            </List>
        </Box>
    </Container>);
}

export default ViewTrip;