import { useState } from 'react';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        InputAdornment,
        IconButton,
        List,
        ListItem,
        ListItemText,
        ButtonGroup
        
} from '@mui/material';
import { Add, Delete, Visibility, VisibilityOff, Edit } from '@mui/icons-material';

function AdminManagement(){
    //catalogues
    const [catAdmins, setCatAdmins] = useState([
        {
            id : 1,
            name : "User 1",
            role : 1,
            hide : false
        },
        {
            id : 2,
            name : "User 2",
            role : 1,
            hide : true
        }
    ]);

    const [catRoles, setCatRoles] = useState([
        {
            id : 1,
            name : "Admin"
        }
    ]);
    return (<>
    <Box
        sx={{
                    display: 'grid',
                    gap: 2,
                    width: '100%'
                }}
    >
        <Typography variant="body1" component="body1" gutterBottom align="center">
            Admin Management
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button>Add new admin</Button>
        </ButtonGroup>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                catAdmins.length > 0 ? catAdmins.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={catRoles.filter(role=>role.id == x.role )[0].name} />

                            <IconButton edge="end" aria-label="add">
                                <Delete />
                                <Edit/>
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No facilities added" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    </>);
}

export default AdminManagement;