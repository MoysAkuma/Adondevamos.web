import React from "react";
import { Box, Typography, Button, ButtonGroup, Divider } from '@mui/material';
import ChangePassword from "./ChangePassword";
import CreatedTripsList from '../Trips/CreatedTripsList';

export default function ProfileDetails({ user, createdTrips = [], 
    votedTrips = [], 
    voteCounts = { trips: 0, places: 0 } }) {
    const userid = localStorage.getItem("userid");
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center" ><strong> { user.tag } </strong> </Typography>
            
            <Typography align="left"><strong>Email:</strong></Typography>
            <Typography align="right" sx={{ wordWrap: 'break-word' }}>{user.email}</Typography>
            
            <Typography align="left"><strong>Name:</strong></Typography>
            <Typography align="right">{user.name} {user.lastname}</Typography>
            
            {
                user.lastName && (
                    <>
                        <Typography align="left"><strong>Last Name:</strong></Typography>
                        <Typography align="right"> {user.lastName} </Typography>
                    </>)
                
            }

            <Typography align="left"><strong>About you:</strong></Typography>
            <Typography align="right"> {user.description} </Typography>

            <Typography align="left"><strong>Email:</strong></Typography>
            <Typography align="right" sx={{ wordWrap: 'break-word' }}>{user.email}</Typography>
            
            <Typography align="left">
                <strong>Ubication:</strong>
            </Typography>
            <Typography align="right"> 
                { user.City.name + ", " + 
                    user.State.name + ", " + 
                    user.Country.acronym 
                }

            </Typography>
            
            <Divider sx={{ my: 3 }} />

            <Typography align="center" variant="h6" sx={{ mb: 2 }}>
                <strong>Your Stats</strong>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                        {voteCounts.trips + voteCounts.places}
                    </Typography>
                    <Typography variant="body2">Total Votes</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="secondary">
                        {createdTrips.length}
                    </Typography>
                    <Typography variant="body2">Trips Created</Typography>
                </Box>
            </Box>

            <ButtonGroup sx={{ mt: 2, mb: 3, display: 'flex', gap: 1 }}>
                <Button 
                variant="contained"
                href={`/Edit/Profile/${userid}`}>
                    Edit Profile
                </Button>
                
                <ChangePassword userId={userid} />
            </ButtonGroup>

            <Divider sx={{ my: 3 }} />

            {/* Created Trips Section - Shows ALL with pagination */}
            <CreatedTripsList
                trips={createdTrips}
                showPagination={true}
                title="Created Trips"
                emptyMessage="You haven't created any trips yet."
            />

            {/* Voted Trips Section - Shows ALL with pagination */}
            <CreatedTripsList
                trips={votedTrips}
                showPagination={true}
                title="Voted Trips"
                emptyMessage="You haven't voted on any trips yet."
            />
        </Box>
    );
}