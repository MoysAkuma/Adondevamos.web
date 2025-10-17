import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar
    , Avatar
 } from '@mui/material';
import { 
    FlightLand, 
    FlightTakeoff, 
    Add, 
    Delete, 
    Edit, 
    ArrowCircleUp, 
    ArrowCircleDown, 
    LocationCity 
} from '@mui/icons-material';
function Itinerary ({
    tripinfo = {
        itinerary : [
        { 
            id : 0,
            name : "Place Name",
            description : "Place description",
            initialdate : "2024-03-23",
            finaldate : "2025-02-17"
        }
        ]
    },
    callBackDelete = function(item){}
})
{
    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const callBackEdite = (e) => {
        
    };

    const generateOptions = ( visit, index) => {
        console.log(tripinfo.owner);
        const isOwner = (tripinfo.owner.id == localStorage.getItem('userid'));
        if( !isOwner ) return (<></>);
        return (<>
            <IconButton edge="end" aria-label="actions">
                <Delete 
                    onClick={ () => callBackDelete(visit.id) } 
                />
                
                {
                    index != 0 ? 
                    ( <ArrowCircleUp  />) : (<></>)
                }

                {
                    (index != (tripinfo.itinerary.length - 1)) ? 
                    ( <ArrowCircleDown  />) : (<></>)
                } 
                
            </IconButton>
        </>);
    }
    return (<>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            tripinfo.itinerary.map( 
                (visit, index) => ( <> 
                    <ListItem
                        key={visit.id}
                        secondaryAction={
                            generateOptions( visit, index )
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
                        secondary={  
                            formatDate( visit.initialdate ) + 
                            " to " + 
                            formatDate( visit.finaldate)
                        } 
                    />
                </ListItem>
            </>))
        }
        </List>
    </>);
}

export default Itinerary;