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
 import { Edit, Visibility, CalendarToday, Person } from "@mui/icons-material"; 
 import { useAuth } from '../../context/AuthContext'

export default function TripsResultSearch({
    results
}) {
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
    
    const goToEditTrip = (trip) => {
      if (trip.id == undefined) return;
      navigate('/Edit/Trip/' + trip.id);
    };

    const goToViewTrip = (trip) => {
      if (trip.id == undefined) return;
      navigate('/View/Trip/' + trip.id);
    };
    
    return (
        <>
            {
            (results.length === 0) ? 
            ( <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                No trips found.
            </Typography> ) : ( 
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {
                        results.map(
                            (trip) => (
                                <Grid item xs={12} key={trip.id}>
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
                                                    color: '#000',
                                                    mb: 1
                                                }}
                                            >
                                                {trip.name}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarToday 
                                                    sx={{ 
                                                        fontSize: 18, 
                                                        mr: 1, 
                                                        color: 'text.secondary'
                                                    }} 
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Start:</strong> {formatDate(trip.initialdate)}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarToday 
                                                    sx={{ 
                                                        fontSize: 18, 
                                                        mr: 1, 
                                                        color: 'text.secondary'
                                                    }} 
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>End:</strong> {formatDate(trip.finaldate)}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Person 
                                                    sx={{ 
                                                        fontSize: 18, 
                                                        mr: 1, 
                                                        color: 'text.secondary'
                                                    }} 
                                                />
                                                <Chip 
                                                    label={trip.owner.tag} 
                                                    size="small" 
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </CardContent>
                                        
                                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, alignItems: 'center' }}>
                                            <Tooltip title="View Trip">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="view"
                                                    onClick={() => goToViewTrip(trip)}
                                                    size="small"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            {auth.role === "Admin" && (
                                                <Tooltip title="Edit Trip">
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="edit"
                                                        onClick={() => goToEditTrip(trip)}
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