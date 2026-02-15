import React from "react";

import { 
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Tooltip,
    IconButton,
    Box,
    Chip
 } from "@mui/material";
 import { useNavigate, Link } from 'react-router-dom';
 import { Edit, Visibility, LocationOn, Home } from "@mui/icons-material"; 
 import { useAuth } from '../../context/AuthContext'

 export default function PlacesResultSearch({results}){
    //navigate
    const navigate = useNavigate();
    
    //Valida if is admin
    const auth = useAuth();
    
    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }; 
        
        const goToEditPlace = (place) => {
          if (place.id == undefined) return;
          navigate('/Edit/Place/' + place.id);
        };
    
        const goToViewPlace = (place) => {
          if (place.id == undefined) return;
          navigate('/View/Place/' + place.id);
        };

        return (
                <>
                    {
                        (results.length === 0) ? 
                        (<Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No places found.
                        </Typography>) : ( 
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {
                                results.map(
                                    (place) => (
                                        <Grid item xs={12} key={place.id}>
                                            <Card 
                                                elevation={3}
                                                sx={{ 
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: 6
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ flexGrow: 1, py: 2 }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        component="h2" 
                                                        gutterBottom
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            color: "#000",
                                                            mb: 1
                                                        }}
                                                    >
                                                        {place.name}
                                                    </Typography>
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                        <LocationOn 
                                                            sx={{ 
                                                                fontSize: 18, 
                                                                mr: 1, 
                                                                color: 'text.secondary',
                                                                mt: 0.2
                                                            }} 
                                                        />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {place.City.name}, {place.State.name}, {place.Country.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <Home 
                                                            sx={{ 
                                                                fontSize: 18, 
                                                                mr: 1, 
                                                                color: 'text.secondary',
                                                                mt: 0.2
                                                            }} 
                                                        />
                                                        <Tooltip title={place.address}>
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                            >
                                                                {place.address}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Box>
                                                </CardContent>
                                                
                                                <CardActions sx={{ justifyContent: 'flex-end', px: 2, alignItems: 'center' }}>
                                                    <Tooltip title="View Place">
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="view"
                                                            onClick={() => goToViewPlace(place)}
                                                            size="small"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {auth.role === "Admin" && (
                                                        <Tooltip title="Edit Place">
                                                            <IconButton
                                                                color="primary"
                                                                aria-label="edit"
                                                                onClick={() => goToEditPlace(place)}
                                                                size="small"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )
                                ) 
                            }
                        </Grid>
                     )
                    }
                </>
            )
}