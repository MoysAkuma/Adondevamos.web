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
        Slide,
        Tooltip
} from '@mui/material';

import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

import FormFacility from './FormFacility';
import config from '../../Resources/config';
import FacilityIcon from '../Commons/FacilityIcon';

function Facilitymanager({ 
    facilities,  
    id, 
    callbackAddFacility, 
    callbackUpdateFacility }) {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [facilityid, setFacilityID] = useState(null);
    const [showFacilityForm, setShowFacilityForm] = useState(false);
    const URLSERVICE = `${config.api.baseUrl}${config.api.endpoints.Catalogues}`;

    const toggleShowFacilities = ( e ) => {
        setShowFacilityForm(true);
    };

    const formSuccess = ()=>{
        setFacilityID(null);
        setShowFacilityForm(false);
    };

    const toggleVisibilityFacility = async( item ) =>{
        setLoading(true);
        try {
            const response = await axios.patch(URLSERVICE + '/facility/' + item.id , {
                hide: !item.hide
            });
            if (response.status !== 200){
                console.error("Error updating facility visibility", response);
                return;
            }
            reloadFacilities();
        } catch (error) {
            console.error("Error updating facility visibility", error);
        }
        finally{
            setLoading(false);
        }
    };

    const reloadFacilities = async() => {
        setLoading(true);
        try {
                const response = 
                await axios.get(URLSERVICE+'/facilities');
                const data = response.data.info;
                callbackUpdateFacility(data);
            
        } catch (error) {
            console.error("Error getting catalogue of facilities", error);
            
        }
        finally{
            setLoading(false);
        }
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
                                <Tooltip title={ x.hide ? "Show Facility" : "Hide Facility" }>  
                                { x.hide ? 
                                    <Visibility onClick={()=> toggleVisibilityFacility(x)} /> 
                                    : <VisibilityOff onClick={()=> toggleVisibilityFacility(x)}/>
                                }
                                </Tooltip>
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