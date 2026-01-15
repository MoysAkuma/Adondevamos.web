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
        Modal
} from '@mui/material';

import { Delete, Visibility, VisibilityOff, Close, Edit } from '@mui/icons-material';

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
    const [countryid, setCountryID] = useState(null);
    const [cityid, setCityID] = useState(null);
    const [isEdit, setisEdit] = useState(false);

    //deletestate
    const deleteState = async( id ) =>{};

    const editCity = (id) => {
        setCityID(id);
        setShowForm(true);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowForm(false);
        setCityID(null);
    };

    const toggleFormVisibility = () => {
        setCityID(null);
        setShowForm(true);
        setOpenModal(true);
    };

    const formSuccess = () => {
        setShowForm(false);
        setOpenModal(false);
        setCityID(null);
        if (callback) {
            callback();
        }
    };

    const toggleVisibilityCity = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await axios.patch(`${config.api.baseUrl}${config.api.endpoints.City}/${item.id}/toggle`);
            if (callback) {
                callback();
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling city visibility:', error);
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
            <Button onClick={toggleFormVisibility} >Add</Button>
        </ButtonGroup>
        
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
                { showForm && (<FormCities id={cityid} callback={formSuccess} />)}
            </Box>
        </Modal>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && cities.length > 0 ? cities.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={states?.filter(s => s.id === x.stateid)[0]?.name || ''
                                }
                            />
                            <IconButton 
                                edge="end"
                                aria-label="edit"
                                onClick={() => editCity(x.id)}
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
                )): <ListItem> 
                    <ListItemText primary="No cities added yet" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default CitiesManager;