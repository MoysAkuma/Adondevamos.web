import React from "react";
import { Box, IconButton, Menu, MenuItem, 
    Tooltip, Avatar, Typography, 
    Button} from '@mui/material';

export default function ProfileDetails({ user }) {
    const userid = localStorage.getItem("userid");
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center" ><strong> { user.tag } </strong> </Typography>
            
            <Typography align="left"><strong>Email:</strong></Typography>
            <Typography align="right" sx={{ wordWrap: 'break-word' }}>{user.email}</Typography>
            
            <Typography align="left"><strong>Name:</strong></Typography>
            <Typography align="right">{user.name}</Typography>
            
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
            
            <Typography align="left"><strong>Ubication:</strong></Typography>
            <Typography align="right"> 
                { user.City.name + ", " + 
                    user.State.name + ", " + 
                    user.Country.acronym 
                }

            </Typography>
            <Button 
            variant="contained"
            sx={{ mt: 2 }} 
            href={`/Edit/User/${userid}`}>
                Edit Profile
            </Button>
        </Box>
    );
}