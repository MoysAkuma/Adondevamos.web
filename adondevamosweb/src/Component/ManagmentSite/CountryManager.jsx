import { Fragment, useState, useEffect } from 'react';
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
        Modal,
        Divider
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff, Close } from '@mui/icons-material';

import config from '../../Resources/config';

function CountryManager({ countries = [], callback: onCountryUpdate }){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [countryid, setCountryID] = useState(null);
    const [URLCountry] = useState(`${config.api.baseUrl}${config.api.endpoints.Catalogues}`);
    const [infoToEdit, setInfoToEdit] = useState(null); 

    const editCountry = (item) => {
        setInfoToEdit(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        
        setCountryID(null);
    };

    const editsuccess = () => {
        
        setOpenModal(false);
        reloadCountries();
        setCountryID(null);
    }

    const reloadCountries = async() => {
        try {
                const response = 
                await axios.get(URLCountry+'/countries');
                
                if (response.status !== 200){
                    return;
                }

                const data = response.data.info;
                if (onCountryUpdate)
                    onCountryUpdate(data);
            
        } catch (error) {
            console.error("Error getting catalogue of countries", error);
            
        }
        finally{
            
        }
    };

    const toggleVisibilityCountry = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            
            await axios.patch(`${URLCountry}/country/${item.id}`, {hide: !item.hide} );
            reloadCountries();
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling country visibility:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                <Button onClick={() => setOpenModal(true)} disabled={isSubmitting}> Add </Button>
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
                    { (<FormCountry 
                    formData={infoToEdit} callback={ editsuccess} />) }
                </Box>
            </Modal>
        
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    countries.length > 0 ? countries.map(
                        (x)=>(<Fragment key={x.id}>
                            <ListItem>
                                <ListItemText 
                                    primary={x.name} 
                                    secondary={x.acronym} />
                                <IconButton 
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => editCountry(x)}
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
                            <Divider />
                            </Fragment>
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