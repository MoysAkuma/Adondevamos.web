import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    Button,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Typography,
    Box,
    Alert,
    Snackbar
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import FormUser from "./FormUser";
import config from "../../Resources/config";

function EditUser() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    
    // Get user id from URL params
    const { id } = useParams();
    
    //URLS
    const URLsCatalogService = {
        Catalogues: `${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
        Users: `${config.api.baseUrl}${config.api.endpoints.Users}`
    }

    //Password
    const [confirmPassword, setConfirmPassword] = useState('');

    //AllCatalogues
    const [allCatalogues, setAllCatalogues] = useState({});

    // user info
    const [formEditUser, setFormEditUser] = useState({
        name: '',
        secondname: '',
        lastname: '',
        countryid: 0,
        stateid: 0,
        cityid: 0,
        description: '',
        email: '',
        tag: '',
        password: ''
    });

    // Location state
    const [locationValues, setLocationValues] = useState({
        countryid: 0,
        stateid: 0,
        cityid: 0
    });

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormEditUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeConfirmPassword = (e) => {
        const { name, value } = e.target;
        setConfirmPassword(value);
    }

    // Handle location changes
    const handleLocationChange = (newLocationValues) => {
        setLocationValues(newLocationValues);
        setFormEditUser(prev => ({
            ...prev,
            countryid: newLocationValues.countryid,
            stateid: newLocationValues.stateid,
            cityid: newLocationValues.cityid
        }));
    };

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        try {

            // Validate for field Name
            if (!formEditUser.name.trim()) {
                setSubmitError('User name is required');
                return;
            }

            // Validate for field Last Name
            if (!formEditUser.lastname.trim()) {
                setSubmitError('User Last name is required');
                return;
            }

            // Validate for field Tag
            if (!formEditUser.tag.trim()) {
                setSubmitError('tag is required');
                return;
            }

            // Validate for field Email
            if (!formEditUser.email.trim()) {
                setSubmitError('email is required');
                return;
            }

            // Validate for field Country
            if (!formEditUser.countryid) {
                setSubmitError('CountryID is required');
                return;
            }

            // Validate for field State
            if (!formEditUser.stateid) {
                setSubmitError('StateID is required');
                return;
            }

            // Validate for field City
            if (!formEditUser.cityid) {
                setSubmitError('cityID is required');
                return;
            }

            // API call to update user
            const updateData = {
                name: formEditUser.name.trim(),
                secondname: formEditUser.secondname.trim(),
                lastname: formEditUser.lastname.trim(),
                countryid: formEditUser.countryid,
                stateid: formEditUser.stateid,
                cityid: formEditUser.cityid,
                description: formEditUser.description,
                email: formEditUser.email,
                tag: formEditUser.tag
            };

            const response = await axios.put(
                `${URLsCatalogService.Users}/${id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer your-token-here' // Add if needed
                    }
                }
            );

            //handle response
            if (response.status === 200) {
                setSubmitSuccess(true);
            } else {
                setSubmitError('Failed to update user. Please try again.');
            }

        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        //getCatalogues and user data
        const initializeData = async () => {
            try {
                // Get catalogues
                const cataloguesResponse = await axios.get(`${URLsCatalogService.Catalogues}/all`);
                const cataloguesData = cataloguesResponse.data.info;
                setAllCatalogues(cataloguesData);

                // Get user data
                const userResponse = await axios.get(`${URLsCatalogService.Users}/${id}`);
                const userData = userResponse.data.info;
                
                setFormEditUser({
                    name: userData.name || '',
                    secondname: userData.secondname || '',
                    lastname: userData.lastname || '',
                    description: userData.description || '',
                    email: userData.email || '',
                    tag: userData.tag || '',
                    countryid: userData.Country.id || 0,
                    stateid: userData.State.id || 0,
                    cityid: userData.City.id || 0
                });
                console.log(userData);
                setLocationValues({
                    countryid: userData.Country.id || 0,
                    stateid: userData.State.id || 0,
                    cityid: userData.City.id || 0
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setSubmitError('Failed to load user data');
                setLoading(false);
            }
        };

        if (id) {
            initializeData();
        }
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Edit User
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%'
                }}
            >

                <FormUser
                    formUser={formEditUser}
                    handleChange={handleChange}
                    id={id}
                    allCatalogues={allCatalogues}
                    locationValues={locationValues}
                    onLocationChange={handleLocationChange}
                    confirmPassword={confirmPassword}
                    onConfirmPasswordChange={handleChangeConfirmPassword}
                    size={isMobile ? 'small' : 'medium'}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="text"
                    onClick={handleSubmit}
                    startIcon={<Person />}
                >
                    Update User
                </Button>

            </Box>
            <Snackbar
                open={!!submitError}
                autoHideDuration={6000}
                onClose={() => setSubmitError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSubmitError('')} severity="error" sx={{ width: '100%' }}>
                    {submitError}
                </Alert>
            </Snackbar>
            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSubmitSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    User updated successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default EditUser;
