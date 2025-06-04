import React, {useState, useEffect} from "react";
import axios from 'axios';
import FormCities from "./FormCities";

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

import { Delete, Visibility, VisibilityOff } from '@mui/icons-material';

import config from '../../Resources/config';
function CitiesManager(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    //Catalogues
    const [catStates, setCatStates] = useState([]);
    const [catCountries, setCatCountries] = useState([]);
    const [catCities, setCatCities] = useState([]);

    //URLS
        const [URLStates, setURLStates] = useState(`${config.api.baseUrl}${config.api.endpoints.State}`);
        const [URLStatesSearch, setURLStatesSearch] = useState(`${config.api.baseUrl}${config.api.endpoints.States}`);
        const [URLCountrySearch, setURLCountrySearch] = useState(`${config.api.baseUrl}${config.api.endpoints.Countries}`);
        const [URLCities, setURLCities] = useState(`${config.api.baseUrl}${config.api.endpoints.Cities}`);
    //deletestate
    const deleteState = async( id ) =>{};
    //getStates
    const getStates = async( ) =>{
        axios.get(URLStatesSearch)
        .then(resp => {
            setCatStates(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of states"));
    };

    //getCountries
    const getCountries = async( ) =>{
        axios.get(URLCountrySearch)
        .then(resp => {
            setCatCountries(resp.data.info);
            setLoading(false);
            getStates();
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    useEffect(()=> {
            getCountries();
    },[]);
    return (<Box
        sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Cities 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button >Add</Button>
        </ButtonGroup>
        
        <FormCities id={null} />
        
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                !loading && catCities.length > 0 ? catCities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={ catStates.filter( state => state.id = x.countryid )[0].name +', ' + catCountries.filter( s => s.id = x.stateid )[0].name } />
                            <IconButton edge="end" aria-label="add">
                                <Delete onClick={() => deleteState(x.id)} />
                            </IconButton>
                            <IconButton edge="end">
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No states added yet" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default CitiesManager;