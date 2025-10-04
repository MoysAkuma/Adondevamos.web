import { useState, useEffect } from "react";
import 
    {
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        IconButton,
        Badge,
        List,
        ListItem,
        ListItemText,
        Alert
    } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ViewMemberList from '../Component/View/ViewMemberList'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import utils from "../Resources/utils";
import { View } from '@mui/icons-material'
import config from "../Resources/config";

import { X } from "@mui/icons-material";

function ViewTrip(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const { tripId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tripInfo, setTripInfo] = useState(null);

    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips :`${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    useEffect(()=> {
        const fetchTrip = async () => {
            if(!tripId) return;
         try{
            axios.get(URLsCatalogService.Trips + '/' + tripId)
            .then(resp => {
                setTripInfo( resp.data.info );
            })
            .catch(error => console.error("Error getting trip info"));
         } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user');
         } finally {
            setLoading(false);
         } 
        }
        fetchTrip();  
    },[tripId]);

    if (loading) return <div>Loading trip info...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!tripInfo) return <div>trip not found</div>;
    return (<Container maxWidth="sm"  sx={{ py: 8 }}>
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
                tripInfo.name
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Description
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                tripInfo.description
            }
            </Typography>

            <Typography gutterBottom variant="span" component="div">
                Created by
            </Typography>
            <Typography gutterBottom variant="span" component="div" align="right">
            {
                tripInfo.owner.tag
            }
            </Typography>

            <Typography gutterBottom variant="span" component="div">
                Initial Date
            </Typography>
            <Typography gutterBottom variant="span" component="div" align="right">
            {
                utils.formatDate(tripInfo.initialdate)
            }
            </Typography>

            <Typography gutterBottom variant="span" component="div">
                Final Date
            </Typography>
            <Typography gutterBottom variant="span" component="div" align="right">
            {
                utils.formatDate(tripInfo.finaldate)
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Members
            </Typography>
            {
                tripInfo.memberlist.length != 0 ? 
                (
                <>
                    <ViewMemberList memberlist={tripInfo.memberlist}/>
                </>
                ) : 
                (
                    <><Alert severity="warning">This trip has no member list yet.</Alert></>
                )
            }
            
            <Typography gutterBottom variant="h6" component="div">
                Itinerary
            </Typography>
            {
               tripInfo.itinerary.length != 0 ? (
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    {
                                        tripInfo.itinerary.map((item) => (
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
               ) : 
               (<>
                    <Alert severity="warning">This trip has no itinerary yet.
                </Alert>
                </>)
            }
            
        </Box>
    </Container>);
}

export default ViewTrip;