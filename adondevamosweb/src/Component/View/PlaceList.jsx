import { useState, useEffect } from 'react';

import 
    {
        List,
        ListItem,
        ListItemAvatar,
        ListItemIcon,
        ListItemText
} from '@mui/material';

import {  CheckCircle } from '@mui/icons-material';


function PlaceList({ placeList }){
    const [dense, setDense] = useState(false);

    return ( 
        <List dense={dense}>
            {
                placeList.length > 0 ? 
                    placeList?.map(
                        (place) => (
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle />
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

export default PlaceList;