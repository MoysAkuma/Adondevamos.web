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

function Facilitymanager({ id, callback}){
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [facilityid, setFacilityID] = useState(null);
    const [showFacilityForm, setShowFacilityForm] = useState(false);
    //catalogues
    const [catFacilities, setCatFacilities] = useState([]);
    const [URLSERVICE, setURLSERVICE] = useState(`${config.api.baseUrl}${config.api.endpoints.Facilities}`);
    const [URLFacility, setURLFacility] = useState(`${config.api.baseUrl}${config.api.endpoints.Facility}`);

    const toggleShowFacilities = ( e ) => {
        setShowFacilityForm(true);
    };

    const deleteFacility = async( item ) =>{
        try {
        const urldelete = URLFacility + '/' + item;
        axios.delete(urldelete)
        .then(resp => {
            //Stop loading form
            setLoading(false);
        })
        .catch(error => console.error("Error deleting a facility"));
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error deleting of facility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //getFacilities
    const getFacilities = async( ) =>{
        axios.get(URLSERVICE)
        .then(resp => {
            setCatFacilities(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of facilities"));
    };

    const formSuccess = ()=>{
        getFacilities();
        setFacilityID(null);
        setShowFacilityForm(false);
    };

    const toggleVisibilityFacility = async( item ) =>{
        if(item.hide){
            axios.patch(URLFacility + '/' +item.id + '/Show')
            .then(resp => {
                getFacilities();
                setLoading(false);
            })
            .catch(error => console.error("Error getting catalogue of facilities"));
        } else {
            axios.patch(URLFacility + '/' +item.id + '/Hide')
            .then(resp => {
                getFacilities();
                setLoading(false);
            })
            .catch(error => console.error("Error getting catalogue of facilities"));
        }
        
    };

    useEffect(()=> {
        getFacilities();
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
        
        { showFacilityForm && (<FormFacility id={facilityid} callback={formSuccess} />) }
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && catFacilities.length > 0 ? catFacilities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.code} />
                            <IconButton edge="end" aria-label="add">
                                <Delete onClick={() => deleteFacility(x.id)} />
                            </IconButton>
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