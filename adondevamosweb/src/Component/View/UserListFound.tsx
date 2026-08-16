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

import {  AccountCircle, Add } from '@mui/icons-material';

function UserListFound({ userList, callback, memberList }){
    const [dense, setDense] = useState(false);
    return ( 
        <List dense={dense}>
            {
                userList.length > 0 ? 
                    userList?.map(
                        (user) => (
                            <ListItem 
                                key={user.id}
                                secondaryAction={
                                    <IconButton edge="end" 
                                        aria-label='actions'
                                    >
                                    {   
                                        (memberList?.length == 0) ||
                                        (memberList?.filter(
                                            addedUser =>
                                                addedUser.id == user.id 
                                        ).length == 0) ? 
                                            (<><Add onClick={ () => callback(user.id)} /></>) : 
                                            (<></>)    
                                    }
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    <AccountCircle />
                                </ListItemIcon>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.email}
                                />
                            </ListItem>
                        ),
                    ) : 
                    (
                        <ListItem> 
                            <ListItemText primary="No members added yet" ></ListItemText>
                        </ListItem>
                    )
            }
        </List>
    );

}

export default UserListFound;