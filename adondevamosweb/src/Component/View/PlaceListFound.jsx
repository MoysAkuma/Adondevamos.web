import { useState, useEffect } from 'react';

import 
    {
        IconButton,
        List,
        ListItem,
        ListItemAvatar,
        ListItemIcon,
        ListItemText
} from '@mui/material';

import {  LocationCity, Add } from '@mui/icons-material';


function PlaceListFound({ placeList, callback, itinerary }){
    const [dense, setDense] = useState(false);

    return ( 
        <List dense={dense}>
            {
                placeList.length > 0 ? 
                    placeList?.map(
                        (place) => (
                            <ListItem 
                                key={place.id}
                                secondaryAction={
                                    <IconButton edge="end" 
                                        aria-label='actions'
                                    >
                                    {   
                                        (itinerary?.length == 0) ||
                                        (itinerary?.filter(
                                            addedplace =>
                                                addedplace.id == place.id 
                                        ).length == 0) ? 
                                            (<><Add onClick={ () => callback(place.id)} /></>) : 
                                            (<></>)    
                                    }
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    <LocationCity />
                                </ListItemIcon>
                                <ListItemText
                                    primary={place.name}
                                />
                            </ListItem>
                        ),
                    ) : 
                    (
                        <ListItem> 
                            <ListItemText primary="No places added" ></ListItemText>
                        </ListItem>
                    )
            }
        </List>
    );
}

export default PlaceListFound;