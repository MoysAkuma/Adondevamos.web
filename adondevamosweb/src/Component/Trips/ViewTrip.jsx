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
import { Visibility, Edit, FavoriteBorder } from '@mui/icons-material'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import ViewMemberList from '../View/ViewMemberList'
import ViewItinerary from './Itinerary/ViewItinerary'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import utils from "../../Resources/utils";
import config from "../../Resources/config";
import ImageCarousel from "../Commons/ImageCarousel";

function ViewTrip(){
    //Get id
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLogged, user, loading } = useAuth();
    const [loadingPage, setLoading] = useState(false);
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
                if (isLogged) {
                    headers['user-id'] = user;
                }
                const response = await axios.get(
                    URLsCatalogService.Trips + '/' + id,
                    { headers }
                );
                setTripInfo( response.data.info );
                setLiked( response.data.info.userVoted || false );
                console.log("Owner ID:", response.data.info.owner.id, "User ID:", user);
                setIsOwner( user && (response.data.info.owner.id === parseInt(user))  
            );
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            } 
        }
        fetchTrip();  
    },[id, user, isLogged]);

    const handleVoteTrip = () => {
        if (!user) {
            alert('You must be logged in to like a trip.');
            return;
        }
        axios.post(
            `${URLsCatalogService.Votes}/${user}`,
            {
                "tripid": id
            },
        ).then( (response) => {
            updateVotes();
            setLiked( prevLiked => !prevLiked );
        }).catch( (error) => {
            console.error("There was an error liking the trip!", error);
        });
    };

    const updateVotes = () => {
        axios.get(
            URLsCatalogService.Votes + '/Trip/' + id
        ).then( (response) => {
            setTripInfo( prevTripInfo => ({
                ...prevTripInfo,
                statics: {
                    ...prevTripInfo.statics,
                    Votes: { Total: response.data.info.summary }
                }
            }));
            console.log("Trip info updated with new votes.", tripInfo);
        }).catch( (error) => {
            console.error("There was an error fetching the votes!", error);
        });
    };

    const handleEdit = () => {
        navigate(`/Edit/Trip/${id}`);
    };

    const handleShare = () => {
        const tripUrl = window.location.href;
        navigator.clipboard.writeText(tripUrl).then(() => {
            
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
            gap: 1,
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
            <Typography variant="span" component="div">
                Created by
            </Typography>
            <Typography variant="b" component="b" align="right">
            {
                tripInfo.owner.tag
            }
            </Typography>

            <Typography variant="span" component="div">
                Initial Date
            </Typography>
            <Typography variant="span" component="div" align="right">
            {
                utils.formatDate(tripInfo.initialdate)
            }
            </Typography>

            <Typography variant="span" component="div">
                Final Date
            </Typography>
            <Typography variant="span" component="div" align="right">
            {
                utils.formatDate(tripInfo.finaldate)
            }
            </Typography>

            <Typography variant="h6" component="div">
                Members
            </Typography>
            {
                tripInfo.members.length != 0 ? 
                (
                    <>
                        <ViewMemberList 
                        memberlist={tripInfo.members}/>
                    </>
                ) : 
                (
                    <>
                        <Alert 
                            severity="warning">
                                This trip has no member list yet.
                        </Alert>
                    </>
                )
            }
            
            <Typography 
                variant="h6" 
                component="div">
                Itinerary
            </Typography>
            <ViewItinerary itinerary={tripInfo.itinerary} />
            <Divider />
            <Typography 
                variant="h6" 
                component="div">
                Gallery
            </Typography>
            <ImageCarousel images={tripInfo.gallery} />
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
                
                {
                isOwner && (
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