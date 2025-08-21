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
        IconButton,
        Badge,
        FormControlLabel,
        Checkbox,
        List,
        ListItem,
        ListItemText
    } from '@mui/material';
import { useParams } from 'react-router-dom';
import ViewMemberList from '../Component/View/ViewMemberList'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import utils from "../Resources/utils";
import { View } from '@mui/icons-material'

import { X } from "@mui/icons-material";

function ViewTrip(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { TripID } = useParams();
    const [trip, setTrip] = useState({
        id:1,
        name: 'Nihon Trip 2024',
        description: 'A two weeks trip i made to reach my dream to see japan',
        itinerary : [
            {
              id:1,
              name:"Naritasan Shinsho-ji",
              initialdate: "2024-02-04",
              finaldate: "2024-02-04",
              votes : 0
            },
            {
              id:2,
              name:"Hachiko Statue",
              initialdate: "2024-02-05",
              finaldate: "2024-02-05",
              votes : 2
            },
            {
              id:3,
              name:"Sensō-ji",
              initialdate: "2024-02-06",
              finaldate: "2024-02-06",
              votes : 0
            }
          ],
        initialdate:"02/02/2024",
        finaldate:"02/18/2024",
        isInternational:true,
        countryID: 2,
        stateID: null,
        cityID: null,
        owner:{ tag : "MoysAkuma", email:"moises141294@hotmail.com"},
        memberlist:[
            {
                id : 1,
                name : "Moises Moran",
                email : "moises141294@hotmail.com",
                tag : "MoysAkuma",
                role : "Creator"
            },
            {
                id : 2,
                name : "Luis Sotelo",
                email : "luis@hotmail.com",
                tag : "Luison_gon",
                role : "Planner"
            }
        ],
        statics:{
          Votes:{
            Total:99
          }
        }
    });
    return (<Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography gutterBottom variant="h5" component="h5" align="left">
            {
                trip.name
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Description
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                trip.description
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Initial Date
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                utils.formatDate(trip.initialdate)
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Final Date
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                utils.formatDate(trip.finaldate)
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Members
            </Typography>

            <ViewMemberList members={trip.memberlist}/>

            <Typography gutterBottom variant="h6" component="div">
                Itinerary
            </Typography>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    trip.itinerary.map((item) => (
                        <>
                        <ListItem key={item.id}
                        secondaryAction={
                            <>
                            <IconButton edge="end" aria-label="actions">
                                <Badge badgeContent={item.votes} color="primary" >
                                    <FavoriteIcon />
                                </Badge>
                            </IconButton>
                            <IconButton edge="end" aria-label="actions">
                                <ShareIcon />
                            </IconButton>
                            </>
                        }
                        >
                                <ListItemText 
                                    primary={item.name} 
                                    secondary={ utils.formatDate(item.initialdate) 
                                    + " to " 
                                    + utils.formatDate(item.finaldate) } />
                        </ListItem>
                        </>
                    ))
                }
            </List>
        </Box>
    </Container>);
}

export default ViewTrip;