import { useState, useEffect } from "react";
import 
    {
        CircularProgress,
        Typography,
        Box,
        IconButton,
        Badge,
        List,
        ListItem,
        ListItemText,
        Alert,
        Divider,
        Paper,
        Tooltip
    } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ViewMemberList from '../View/ViewMemberList'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import utils from "../../Resources/utils";
import { Visibility, Edit, FavoriteBorder } from '@mui/icons-material'
import config from "../../Resources/config";
import { useAuth } from '../../context/AuthContext';

function ViewTrip(){
    //Get id
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tripInfo, setTripInfo] = useState(null);
    const [liked, setLiked] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Trips :`${config.api.baseUrl}${config.api.endpoints.Trips}`,
            Votes :`${config.api.baseUrl}${config.api.endpoints.Votes}`
        }
    );

    useEffect(()=> {
        const fetchTrip = async () => {
            if(!id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try{
                const headers = {};
                if (auth.user) {
                    headers['user-id'] = auth.user;
                }
                const response = await axios.get(
                    URLsCatalogService.Trips + '/' + id,
                    { headers }
                );
                setTripInfo( response.data.info );
                setLiked( response.data.info.userVoted || false );
                console.log("Owner ID:", response.data.info.owner.id, "User ID:", auth.user);
                setIsOwner( auth.user && (response.data.info.owner.id === parseInt(auth.user))  
            );
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            } 
        }
        fetchTrip();  
    },[id, auth.user]);

    const handleVoteTrip = () => {
        if (!auth.user) {
            alert('You must be logged in to like a trip.');
            return;
        }
        axios.post(
            `${URLsCatalogService.Votes}/${auth.user}`,
            {
                "tripid": id
            },
        ).then( (response) => {
            setLiked(!liked);
        }).catch( (error) => {
            console.error("There was an error liking the trip!", error);
        });
    };

    const handleEdit = () => {
        navigate(`/Edit/Trips/${id}`);
    };

    const handleShare = () => {
        const tripUrl = window.location.href;
        navigator.clipboard.writeText(tripUrl).then(() => {
            alert('Trip link copied to clipboard!');
        });
    };

    

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
            </Alert>
        );
    }
    
    if (!tripInfo) {
        return (
            <Alert severity="warning" sx={{ mt: 2 }}>
                Trip not found
            </Alert>
        );
    }
    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >

            <Typography gutterBottom variant="h4" component="h4" align="center">
            {
                tripInfo.name
            }
            </Typography>

            <Typography  variant="body1" component="div" align="right">
            {
                tripInfo.description
            }
            </Typography>

            
            <Divider />
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
                tripInfo.members.length != 0 ? 
                (
                <>
                    <ViewMemberList memberlist={tripInfo.members}/>
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
                    <List sx={{ width: '100%', bgcolor: 'background.paper'  }}>
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
                                {
                                    item.place.id ? (
                                    <IconButton edge="end" aria-label="actions" href={"/View/Places/" + item.place.id} >
                                        <Visibility  />
                                    </IconButton>) : null
                                }
                                
                                </>
                            }
                            >
                            <ListItemText 
                                        primary={item.place.name} 
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
                    <Alert 
                        severity="warning">
                            This trip has no itinerary yet.
                    </Alert>
                </>)
            }
            <Divider />
            <Paper 
                elevation={2} 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: 1
                }}
            >
                <Tooltip title={liked ? "Unlike" : "Vote this trip"}>
                    <IconButton 
                        color={liked ? "error" : "default"}
                        onClick={handleVoteTrip}
                        size="medium"
                    >
                        <Badge badgeContent={tripInfo.statics.Votes.Total} color="primary">
                            {liked ? <FavoriteIcon /> : <FavoriteBorder />}
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Share trip">
                    <IconButton 
                        color="default"
                        onClick={handleShare}
                        size="medium"
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                
                {isOwner && (
                    <Tooltip title="Edit trip">
                        <IconButton 
                            color="primary"
                            onClick={handleEdit}
                            size="medium"
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                )}
            </Paper>
            
        </Box>);
}

export default ViewTrip;