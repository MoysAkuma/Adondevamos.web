import { useEffect, useState } from 'react';
import axios from 'axios';
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
    const [loading, setLoading] = useState(true);
    //catalogues
    const [catFacilities, setCatFacilities] = useState([]);
    const [URLSERVICE, setURLSERVICE] = useState('http://localhost:3001/Facilities');
    useEffect(()=> {
        axios.get(URLSERVICE)
        .then(resp => {
            setCatFacilities(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of facilities"));
    },[]);

    

    return (<>
    <Box
        sx={{
                    display: 'grid',
                    gap: 2,
                    width: '100%'
                }}
    >
        <Typography variant="body1" component="body1" gutterBottom align="center">
            Facilities 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button>Add</Button>
            <Button>Delete</Button>
        </ButtonGroup>
        
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                !loading && catFacilities.length > 0 ? catFacilities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.code} />
                            <IconButton edge="end" aria-label="add">
                                <Delete />

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

export default Facilitymanager;