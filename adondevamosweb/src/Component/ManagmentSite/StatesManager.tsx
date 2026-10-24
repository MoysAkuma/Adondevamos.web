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
        Slide,
        Modal,
        Divider
} from '@mui/material';

import { Delete, Visibility, VisibilityOff, Close, Edit, FilterList } from '@mui/icons-material';

import config from '../../Resources/config';

function StatesManager({ states = [], countries = [], callback, onUpdate }){ 
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [countryidfilter, setCountryIDFilter]= useState(null);
    const [stateid, setStateID]= useState(null);
    const [infoToEdit, setInfoToEdit] = useState(null);
    const URLStates = `${config.api.baseUrl}${config.api.endpoints.Catalogues}`;
    
    // Filter states by country
    const filteredStates = countryidfilter 
        ? states.filter(s => s.countryid === countryidfilter)
        : states;
    
    const getSelectedCountryName = () => {
        if (!countryidfilter) return null;
        const country = countries.find(c => c.id === countryidfilter);
        return country ? country.name : null;
    };
    
    const handleApplyFilter = (countryId) => {
        setCountryIDFilter(countryId);
        setOpenFilterModal(false);
    };
    
    const handleClearFilter = () => {
        setCountryIDFilter(null);
        setOpenFilterModal(false);
    };
    
    
    const realoadStates = async() => {
        try {
                const response = 
                await axios.get(`${URLStates}/states`);
                if (response.status !== 200){
                    return;
                }
                const data = response.data.info;
                if (callback) {
                    callback(data);
                }
        } catch (error) {
            console.error('Error reloading states:', error);
        }
    };

    const editState = (item) => {
        setInfoToEdit(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setInfoToEdit(null);
    };

    const formSucess = () => {
        setShowForm(false);
        setOpenModal(false);
        setInfoToEdit(null);
        realoadStates();
        
        // Refresh cached catalogues
        if (onUpdate) {
            onUpdate();
        }
    };

    const toggleVisibilityState = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await axios.patch(`${URLStates}/state/${item.id}/`, {hide: !item.hide} );
            realoadStates();
            
            // Refresh cached catalogues
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling state visibility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <Button onClick={() => setOpenModal(true)} >Add</Button>
            <Button 
                onClick={() => setOpenFilterModal(true)} 
                startIcon={<FilterList />}
                color={countryidfilter ? "primary" : "inherit"}
            >
                Filter {countryidfilter && `(${getSelectedCountryName()})`}
            </Button>
            {countryidfilter && (
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
                        Filter by Country
                    </Typography>
                    <IconButton onClick={() => setOpenFilterModal(false)} size="small">
                        <Close />
                    </IconButton>
                </Box>
                <TextField
                    select
                    fullWidth
                    label="Select Country"
                    value={countryidfilter || ''}
                    onChange={(e) => handleApplyFilter(e.target.value || null)}
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
            aria-labelledby="state-modal-title"
            aria-describedby="state-modal-description"
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
                    <Typography id="state-modal-title" variant="h6" component="h2">
                        {stateid ? 'Edit State' : 'Add New State'}
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <Close />
                    </IconButton>
                </Box>
                {(<FormStates 
                formData={infoToEdit} callback={formSucess} countries={countries} />)}
            </Box>
        </Modal>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && filteredStates.length > 0 ? filteredStates.map(
                    (x)=>(
                        <>
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={countries?.filter(c => c.id === x.countryid)[0]?.acronym || ''} />
                            <IconButton 
                                edge="end"
                                aria-label="edit"
                                onClick={() => editState(x)}
                                disabled={isSubmitting}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton 
                                edge="end"
                                aria-label="toggle visibility"
                                onClick={() => toggleVisibilityState(x)}
                                disabled={isSubmitting}
                            >
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                        <Divider />
                        </>
                )): <ListItem> 
                    <ListItemText 
                    primary={countryidfilter ? "No states for selected country" : "No states added yet"} ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default StatesManager;