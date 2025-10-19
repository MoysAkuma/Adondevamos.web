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
        id : 1,
        name : "Moises Moran",
        email : "moises141294@hotmail.com",
        tag : "MoysAkuma",
        role : "Admin"
    }
    ],
    callBackDelete = function(item){}, 
})
{
    return (<>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            memberlist.map( (user,index) => (<> 
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