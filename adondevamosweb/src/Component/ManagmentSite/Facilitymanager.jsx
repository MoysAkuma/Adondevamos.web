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
        ButtonGroup,
        Slide
} from '@mui/material';

import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

import FormFacility from './FormFacility';
import config from '../../Resources/config';
import FacilityIcon from '../Commons/FacilityIcon';

function Facilitymanager({ facilities,  
    id, callback}){
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [facilityid, setFacilityID] = useState(null);
    const [showFacilityForm, setShowFacilityForm] = useState(false);
    const [URLSERVICE, setURLSERVICE] = useState(`${config.api.baseUrl}${config.api.endpoints.Catalogues}/Facilities`);

    const toggleShowFacilities = ( e ) => {
        setShowFacilityForm(true);
    };

    const formSuccess = ()=>{
        setFacilityID(null);
        setShowFacilityForm(false);
    };

    const toggleVisibilityFacility = async( item ) =>{
        axios.patch(URLSERVICE + '/' + item.id + '/visibility/'+ !item.hide)
        .then(resp => {
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of facilities"));
        
    };

    useEffect(()=> {
        setLoading(false);
    },[]);

    return (<>
    <Box
        sx={{
                    display: 'grid',
                    gap: 2,
                    width: '100%'
                }}
    >
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Facilities 
        </Typography>
        
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={toggleShowFacilities} >Add</Button>
        </ButtonGroup>
        
        { showFacilityForm && (
            <FormFacility id={facilityid} callback={formSuccess} />) }
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && facilities.length > 0 ? facilities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <FacilityIcon code={x.code} sx={{ mr: 2 }} />
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.code} />
                            <IconButton edge="end">
                                { x.hide ? 
                                    <Visibility onClick={()=> toggleVisibilityFacility(x)} /> 
                                    : <VisibilityOff onClick={()=> toggleVisibilityFacility(x)}/>
                                }
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