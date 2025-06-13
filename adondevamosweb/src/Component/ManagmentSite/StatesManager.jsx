import React,{ useState, useEffect } from 'react';

import axios from 'axios';

import FormStates from './FormStates';

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

function StatesManager(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [catStates, setCatStates] = useState([]);
    const [catCountries, setCatCountries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [countryidfilter, setCountryIDFilter]= useState(null);
    const [stateid, setStateID]= useState(null);
    
    const [URLStates, setURLStates] = useState(`${config.api.baseUrl}${config.api.endpoints.State}`);
    const [URLStatesSearch, setURLStatesSearch] = useState(`${config.api.baseUrl}${config.api.endpoints.States}`);
    const [URLCountrySearch, setURLCountrySearch] = useState(`${config.api.baseUrl}${config.api.endpoints.Countries}`);
    
    
    const deleteState = async( item ) =>{
        try {
            const urldelete = URLStates + '/' + item;
            axios.delete(urldelete)
            .then(resp => {
                //Stop loading form
                setLoading(false);
            })
            .catch(error => console.error("Error deleting a state"));
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error deleting of facility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const showformToCreate = ( ) =>{
        setShowForm(true);
    };

    const formSucess = () => {
        console.log("Entro");
        getStates();
        setShowForm(false);
        setStateID(null);
    };

    const showFilters = () => {
        
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
            States 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={() => showformToCreate()} >Add</Button>
            <Button onClick={() => showFilters()} > Set Filters </Button>
        </ButtonGroup>
        
        {showForm && (<FormStates id={stateid} callback={formSucess}/> )}
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && catStates.length > 0 ? catStates.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={ catCountries?.filter(c => c.id == x.countryid)[0].name  } />
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
export default StatesManager;