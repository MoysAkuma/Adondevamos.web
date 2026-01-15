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
        Modal
} from '@mui/material';

import { Delete, Visibility, VisibilityOff, Close, Edit } from '@mui/icons-material';

import config from '../../Resources/config';

function StatesManager({ states = [], countries = [], callback }){ 
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
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
                if (callback) {
                    callback();
                }
            })
            .catch(error => console.error("Error deleting a state"));
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error deleting of facility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editState = (id) => {
        setStateID(id);
        setShowForm(true);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowForm(false);
        setStateID(null);
    };

    const showformToCreate = ( ) =>{
        setStateID(null);
        setShowForm(true);
        setOpenModal(true);
    };

    const formSucess = () => {
        setShowForm(false);
        setOpenModal(false);
        setStateID(null);
        if (callback) {
            callback();
        }
    };

    const toggleVisibilityState = async( item ) =>{
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await axios.patch(`${URLStates}/${item.id}/toggle`);
            if (callback) {
                callback();
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error toggling state visibility:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const showFilters = () => {
        
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
            <Button onClick={() => showformToCreate()} >Add</Button>
            <Button onClick={() => showFilters()} > Set Filters </Button>
        </ButtonGroup>
        
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
                {showForm && (<FormStates id={stateid} callback={formSucess}/> )}
            </Box>
        </Modal>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                !loading && states.length > 0 ? states.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={countries?.filter(c => c.id === x.countryid)[0]?.acronym || ''} />
                            <IconButton 
                                edge="end"
                                aria-label="edit"
                                onClick={() => editState(x.id)}
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
                )): <ListItem> 
                    <ListItemText 
                    primary="No states added yet" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default StatesManager;