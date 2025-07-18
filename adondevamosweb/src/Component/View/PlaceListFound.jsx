import { useState, useEffect } from 'react';

import 
    {
        List,
        ListItem,
        ListItemAvatar,
        ListItemIcon,
        ListItemText
} from '@mui/material';

import {  LocationCity, Add } from '@mui/icons-material';


function PlaceListFound({ placeList, callback }){
    const [dense, setDense] = useState(false);

    return ( 
        <List dense={dense}>
            {
                placeList.length > 0 ? 
                    placeList?.map(
                        (place) => (
                            <ListItem>
                                <ListItemIcon>
                                    <LocationCity />
                                </ListItemIcon>
                                <ListItemText
                                    primary={place.name}
                                    
                                />
                                <ListItemIcon edge="end" aria-label="add">
                                    <Add onClick={ () => callback(place.id)} />
                                </ListItemIcon>
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