import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, 
    IconButton, ListItemAvatar, Avatar,
    Tooltip,
    Icon
 } from '@mui/material';
import { Chat, FlightTakeoff, Add, Delete, Edit, ArrowCircleUp, 
    ArrowCircleDown, AccountCircle } from '@mui/icons-material';
function ViewMemberList ({
    memberlist = [
    { 
        id: 0,
        user:{
            id: 0,
            tag: "user1",
            email: "",
            lastname: ""        
        }
    }
    ]
})
{
    return (<>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            memberlist.map( (member,index) => ( 
                <ListItem
                    key={member.user.id}
                    secondaryAction={
                        <>
                            <Tooltip title="Send Message" arrow>
                              <IconButton disabled aria-label="chat" edge="end">
                                <Chat />
                                </IconButton>
                            </Tooltip>
                            {
                                index != 0 && 
                                ( <IconButton aria-label="move up" edge="end">
                                    <ArrowCircleUp />
                                </IconButton>)
                            }

                            {
                                (index != (memberlist.length - 1)) && 
                                ( <IconButton aria-label="move down" edge="end">
                                    <ArrowCircleDown />
                                </IconButton>)
                            } 
                        </>
                    }
                    disablePadding
                >
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={ "@" + member.user.tag } 
                        secondary={ <> 
                            <Typography 
                                component="span" variant="body2" 
                                sx={{ color: 'text.primary', display: 'inline' }} >
                                {
                                    member.user.email
                                }    
                            </Typography> </>   } 
                    />
                </ListItem>
            ))
        }
        </List>
    </>);
}

export default ViewMemberList;