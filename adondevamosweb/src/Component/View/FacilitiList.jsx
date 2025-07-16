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


function FacilitiList({ facilityList }){
    const [dense, setDense] = useState(false);

    return ( 
        <List dense={dense}>
            {
                facilityList.length > 0 ? 
                    facilityList?.map(
                        (facility) => (
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle />
                                </ListItemIcon>
                                <ListItemText
                                    primary={facility.name}
                                />
                            </ListItem>
                        ),
                    ) : 
                    (
                        <ListItem> 
                            <ListItemText primary="No facilities added" ></ListItemText>
                        </ListItem>
                    )
            }
        </List>
    );
}

export default FacilitiList;