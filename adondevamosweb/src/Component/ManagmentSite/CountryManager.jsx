import { useState, useEffect } from 'react';
import axios from 'axios';
import FormCountry from './FormCountry';
import 
    {
        Button,
        Typography,
        Box,
        IconButton,
        List,
        ListItem,
        ListItemText,
        ButtonGroup
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

import config from '../../Resources/config';

function CountryManager({ countries = [], onCountryUpdate }){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [URLCountry] = useState(`${config.api.baseUrl}${config.api.endpoints.Country}`);

    const deleteCountry = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const urldelete = URLCountry + '/' + item;
            await axios.delete(urldelete);
            if (onCountryUpdate) {
                onCountryUpdate();
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error deleting country:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editCountry = (item) => {
        setCountryID(item);
        setShowCountries(true);
    };

    const editsuccess = () => {
        setShowCountries(false);
        if (onCountryUpdate) {
            onCountryUpdate();
        }
        setCountryID(null);
    }

    const toggleVisibilityCountry = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const endpoint = item.hide ? 'Show' : 'Hide';
            await axios.patch(`${URLCountry}/${item.id}/${endpoint}`);
            if (onCountryUpdate) {
                onCountryUpdate();
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling country visibility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const showform = ( ) =>{
        setShowCountries(true);
    };

    return (
        <>
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
            
            {submitError && (
                <Typography color="error" variant="body2" align="center">
                    {submitError}
                </Typography>
            )}
            
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={showform} disabled={isSubmitting}> Add </Button>
            </ButtonGroup>
        
            { showCountries && (<FormCountry id={countryid} callback={editsuccess} />) }
        
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    countries.length > 0 ? countries.map(
                        (x)=>(
                            <ListItem key={x.id}>
                                <ListItemText 
                                    primary={x.name} 
                                    secondary={x.acronym} />
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete"
                                    onClick={() => deleteCountry(x.id)}
                                    disabled={isSubmitting}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton 
                                    edge="end"
                                    aria-label="toggle visibility"
                                    onClick={() => toggleVisibilityCountry(x)}
                                    disabled={isSubmitting}
                                >
                                    { x.hide ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    aria-label="edit"
                                    onClick={() => editCountry(x.id)}
                                    disabled={isSubmitting}
                                >
                                    <Edit />
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