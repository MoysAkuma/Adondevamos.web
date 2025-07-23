import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar
    , Avatar
 } from '@mui/material';
import { FlightLand, FlightTakeoff, Add, Delete, Edit, ArrowCircleUp, 
    ArrowCircleDown, LocationCity } from '@mui/icons-material';
function Itinerary ({
    itinerary = [
    { 
        id : 0,
        name : "Place Name",
        description : "Place description",
        initialdate : "17/0/2025",
        finaldate : "17/0/2025"
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
            itinerary.map( (visit,index) => ( <> 
                <ListItem
                    key={visit.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="actions">
                            
                            <Delete 
                                onClick={ () => callBackDelete(visit.id)} />
                            {
                                index != 0 ? 
                                ( <ArrowCircleUp  />) : (<></>)
                            }

                            {
                                (index != (itinerary.length - 1)) ? 
                                ( <ArrowCircleDown  />) : (<></>)
                            } 
                            
                        </IconButton>
                    }
                    disablePadding
                >
                    <ListItemAvatar>
                        <Avatar>
                            <LocationCity />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={ visit.name } 
                        secondary={ "Start : " + formatDate(visit.initialdate) +", End : " + formatDate(visit.finaldate)  } 
                    />
                </ListItem>
            </>))
        }
        </List>
    </>);
}

export default Itinerary;