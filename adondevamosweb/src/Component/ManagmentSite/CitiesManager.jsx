import React, {useState, useEffect} from "react";
import axios from 'axios';
import FormCities from "./FormCities";

import 
    { 
        Button,
        Typography,
        Box,
        IconButton,
        List,
        ListItem,
        ListItemText,
        ButtonGroup,
        Modal,
        Divider,
        TextField,
        MenuItem
} from '@mui/material';

import { Delete, Visibility, VisibilityOff, Close, Edit, FilterList } from '@mui/icons-material';

import config from '../../Resources/config';

function CitiesManager({id, 
    callback,
    cities = [],
    states = [],
    countries = []
}){
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [cityid, setCityID] = useState(null);
    const [infoToEdit, setInfoToEdit] = useState(null);
    const [countryIdFilter, setCountryIdFilter] = useState(null);
    const [stateIdFilter, setStateIdFilter] = useState(null);
    
    // Filter cities by country and/or state
    const filteredCities = cities.filter(city => {
        if (countryIdFilter && city.countryid !== countryIdFilter) return false;
        if (stateIdFilter && city.stateid !== stateIdFilter) return false;
        return true;
    });
    
    // Get states filtered by selected country
    const filteredStatesForFilter = countryIdFilter 
        ? states.filter(s => s.countryid === countryIdFilter)
        : states;
    
    const getSelectedCountryName = () => {
        if (!countryIdFilter) return null;
        const country = countries.find(c => c.id === countryIdFilter);
        return country ? country.name : null;
    };
    
    const getSelectedStateName = () => {
        if (!stateIdFilter) return null;
        const state = states.find(s => s.id === stateIdFilter);
        return state ? state.name : null;
    };
    
    const getFilterLabel = () => {
        const parts = [];
        if (countryIdFilter) parts.push(getSelectedCountryName());
        if (stateIdFilter) parts.push(getSelectedStateName());
        return parts.length > 0 ? `(${parts.join(' / ')})` : '';
    };
    
    const handleCountryFilterChange = (countryId) => {
        setCountryIdFilter(countryId || null);
        setStateIdFilter(null); // Reset state filter when country changes
    };
    
    const handleStateFilterChange = (stateId) => {
        setStateIdFilter(stateId || null);
    };
    
    const handleClearFilter = () => {
        setCountryIdFilter(null);
        setStateIdFilter(null);
        setOpenFilterModal(false);
    };
    
    const editCity = (item) => {
        setCityID(item.id);
        setInfoToEdit(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowForm(false);
        setCityID(null);
        setInfoToEdit(null);
    };

    const toggleFormVisibility = () => {
        setCityID(null);
        setInfoToEdit(null);
        setShowForm(true);
        setOpenModal(true);
    };

    const formSuccess = () => {
        setShowForm(false);
        setOpenModal(false);
        setCityID(null);
        setInfoToEdit(null);
        reloadCities();
    };
    const reloadCities = async() => {
        try {
                const response = 
                await axios.get(`${config.api.baseUrl}${config.api.endpoints.Catalogues}/cities`);
                if (response.status !== 200){
                    return;
                }
                const data = response.data.info;
                if (callback) {
                    callback(data);
                }
        } catch (error) {
            console.error('Error reloading cities:', error);
        }
        finally{
            
        }
    };  

    const toggleVisibilityCity = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await axios.patch(`${config.api.baseUrl}${config.api.endpoints.Catalogues}/city/${item.id}`, { hide: !item.hide });
            reloadCities();
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling city visibility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateUbicationName = ( countryid , stateid ) => {
        
        let countryName = countries.find(c => c.id === countryid)?.name || '';
        let stateName = states.find(s => s.id === stateid)?.name || '';
        return `${stateName}, ${countryName}`;
    }

    useEffect(()=> {
        setLoading(false);
    },[]);

    return (<Box
        sx={{
                display: 'grid',
                gap: 2,
                width: '100%'
            }}
        >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={toggleFormVisibility} >Add</Button>
            <Button 
                onClick={() => setOpenFilterModal(true)} 
                startIcon={<FilterList />}
                color={(countryIdFilter || stateIdFilter) ? "primary" : "inherit"}
            >
                Filter {getFilterLabel()}
            </Button>
            {(countryIdFilter || stateIdFilter) && (
                <Button onClick={handleClearFilter} color="error">
                    Clear
                </Button>
            )}
        </ButtonGroup>
        
        {/* Filter Modal */}
        <Modal
            open={openFilterModal}
            onClose={() => setOpenFilterModal(false)}
            aria-labelledby="filter-modal-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '400px' },
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 3,
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="filter-modal-title" variant="h6" component="h2">
                        Filter Cities
                    </Typography>
                    <IconButton onClick={() => setOpenFilterModal(false)} size="small">
                        <Close />
                    </IconButton>
                </Box>
                <TextField
                    select
                    fullWidth
                    label="Select Country"
                    value={countryIdFilter || ''}
                    onChange={(e) => handleCountryFilterChange(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">
                        <em>All Countries</em>
                    </MenuItem>
                    {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                            {country.name} ({country.acronym})
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Select State"
                    value={stateIdFilter || ''}
                    onChange={(e) => handleStateFilterChange(e.target.value)}
                    disabled={!countryIdFilter}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">
                        <em>All States</em>
                    </MenuItem>
                    {filteredStatesForFilter.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                            {state.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button onClick={handleClearFilter} variant="outlined">
                        Clear Filter
                    </Button>
                    <Button onClick={() => setOpenFilterModal(false)} variant="contained">
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
        
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="city-modal-title"
            aria-describedby="city-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' },
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="city-modal-title" variant="h6" component="h2">
                        {cityid ? 'Edit City' : 'Add New City'}
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <Close />
                    </IconButton>
                </Box>
                { (<FormCities 
                key={infoToEdit?.id || 'new-city'}
                formData={infoToEdit} callback={formSuccess} 
                countries={countries} 
                states={states} />)}
            </Box>
        </Modal>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && filteredCities.length > 0 ? filteredCities.map(
                    (x)=>(
                        <React.Fragment key={x.id}>
                        <ListItem>
                            <ListItemText 
                                primary={x.name} 
                                secondary={generateUbicationName(x.countryid, x.stateid)}
                            />
                            <IconButton 
                                edge="end"
                                aria-label="edit"
                                onClick={() => editCity(x)}
                                disabled={isSubmitting}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton 
                                edge="end"
                                aria-label="toggle visibility"
                                onClick={() => toggleVisibilityCity(x)}
                                disabled={isSubmitting}
                            >
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                        <Divider />
                        </React.Fragment>
                )): <ListItem> 
                    <ListItemText primary={(countryIdFilter || stateIdFilter) ? "No cities for selected filters" : "No cities added yet"} ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default CitiesManager;