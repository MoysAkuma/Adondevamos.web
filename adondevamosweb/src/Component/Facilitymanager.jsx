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
import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

function Facilitymanager(){
    //catalogues
    const [catFacilities, setCatFacilities] = useState([
        {
            id : 1,
            name : "WC",
            value : false
        },
        {
            id : 2,
            name : "Wi-FI",
            value : true
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
            Facility manager 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button>Add</Button>
        </ButtonGroup>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                catFacilities.length > 0 ? catFacilities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.description} />
                            <IconButton edge="end" aria-label="add">
                                <Delete />
                                { x.value ? <Visibility  /> : <VisibilityOff/>}
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

export default Facilitymanager;