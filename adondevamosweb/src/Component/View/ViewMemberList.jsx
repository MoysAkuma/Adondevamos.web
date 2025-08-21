import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar
    , Avatar
 } from '@mui/material';
import { Chat, FlightTakeoff, Add, Delete, Edit, ArrowCircleUp, 
    ArrowCircleDown, AccountCircle } from '@mui/icons-material';
function ViewMemberList ({
    memberlist = [
    { 
        id : 1,
        name : "Moises Moran",
        email : "moises141294@hotmail.com",
        tag : "MoysAkuma",
        role : "Creator"
    }
    ]
})
{
    return (<>
        <List sx={{ width: '80%', bgcolor: 'background.paper' }}>
        {
            memberlist.map( (user,index) => (<> 
                <ListItem
                    key={user.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="actions">
                            <Chat />
                            {
                                index != 0 ? 
                                ( <ArrowCircleUp  />) : (<></>)
                            }

                            {
                                (index != (memberlist.length - 1)) ? 
                                ( <ArrowCircleDown  />) : (<></>)
                            } 
                            
                        </IconButton>
                    }
                    disablePadding
                >
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={ "@" + user.tag } 
                        secondary={ <> 
                            <Typography 
                                component="span" variant="body2" 
                                sx={{ color: 'text.primary', display: 'inline' }} >
                                {
                                    user.email
                                }    
                            </Typography> </>   } 
                    />
                </ListItem>
            </>))
        }
        </List>
    </>);
}

export default ViewMemberList;