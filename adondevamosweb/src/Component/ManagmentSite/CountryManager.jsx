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
        ButtonGroup,
        Modal
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff, Close } from '@mui/icons-material';

import config from '../../Resources/config';

function CountryManager({ countries = [], callback: onCountryUpdate }){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [URLCountry] = useState(`${config.api.baseUrl}${config.api.endpoints.Country}`);


    const editCountry = (item) => {
        setCountryID(item);
        setShowCountries(true);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowCountries(false);
        setCountryID(null);
    };

    const editsuccess = () => {
        setShowCountries(false);
        setOpenModal(false);
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
        setOpenModal(true);
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
        
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="country-modal-title"
                aria-describedby="country-modal-description"
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
                        <Typography id="country-modal-title" variant="h6" component="h2">
                            {countryid ? 'Edit Country' : 'Add New Country'}
                        </Typography>
                        <IconButton onClick={handleCloseModal} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                    { showCountries && (<FormCountry 
                    id={countryid} callback={ editsuccess} />) }
                </Box>
            </Modal>
        
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
                                    aria-label="edit"
                                    onClick={() => editCountry(x.id)}
                                    disabled={isSubmitting}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton 
                                    edge="end"
                                    aria-label="toggle visibility"
                                    onClick={() => toggleVisibilityCountry(x)}
                                    disabled={isSubmitting}
                                >
                                    { x.hide ? <Visibility /> : <VisibilityOff />}
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