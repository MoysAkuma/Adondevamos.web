import { useState, useEffect } from 'react';
import axios from 'axios';
import FormCountry from './FormCountry';
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

import config from '../../Resources/config';

function CountryManager(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [catCountries, setCatCountries] = useState([]);
    const [URLCountry, setURLCountry] = useState(`${config.api.baseUrl}${config.api.endpoints.Country}`);
    const [URLCountryService, setURLCountryService] = useState(`${config.api.baseUrl}${config.api.endpoints.Countries}`);
    const [catFacilities, setCatFacilities] = useState([]);

    const deleteCountry = async( item ) =>{
        try {
            const urldelete = URLCountry + '/' + item;
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

    //getCountries
    const getCountries = async( ) =>{
        axios.get(URLCountryService)
        .then(resp => {
            setCatCountries(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    useEffect(()=> {
        getCountries();
    },[]);

    return (
        <>
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Countries 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button >Add</Button>
        </ButtonGroup>
        
        <FormCountry id={null} />
        
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                !loading && catCountries.length > 0 ? catCountries.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.code} />
                            <IconButton edge="end" aria-label="add">
                                <Delete onClick={() => deleteCountry(x.id)} />
                            </IconButton>
                            <IconButton edge="end">
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No countries added" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
        </>
    )
}

export default CountryManager;