import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar
    , Avatar
 } from '@mui/material';
import { FlightLand, FlightTakeoff, Add, Delete, Edit, ArrowCircleUp, 
    ArrowCircleDown, AccountCircle } from '@mui/icons-material';
function MemberList ({
    memberlist = [
    { 
        id : 0,
        name : "User Name",
        email : "user@domain.com",
        tag : "usertag",
        roleid : 0
    }
    ],
    callBackDelete = function(item){}, 
})
{
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const callBackEdite = (e) => {
        
    };

    return (<>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            memberlist.map( (user,index) => ( <> 
                <ListItem
                    key={user.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="actions">
                            
                            <Delete 
                                onClick={ () => callBackDelete(user.id)} />
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
                        secondary={ user.email  } 
                    />
                </ListItem>
            </>))
        }
        </List>
    </>);
}

export default MemberList;