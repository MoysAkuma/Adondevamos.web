import React, 
    { useState, 
    useEffect } from "react";
import axios from 'axios';
import 
    {
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

import FormUser from "./FormUser";
import config from "../../Resources/config";

function CreateUser(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    //URLS
    const URLsCatalogService =
        {
            Catalogues:`${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
            Users : `${config.api.baseUrl}${config.api.endpoints.Users}`
        }

    //Password
    const [confirmPassword, setConfirmPassword] = useState('');

    //AllCatalogues
    const [allCatalogues, setAllCatalogues] = useState({});

    // user info
    const [formCreateUser, setFormCreateUser] = useState({
        name: '',
        secondname:'',
        lastname:'',
        countryid: 0,
        stateid: 0,
        cityid: 0,
        description: '',
        email:'',
        tag:'',
        password:''
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
        setFormCreateUser(prev => ({
          ...prev,
          [name]: value
        }));
    };

    const handleChangeConfirmPassword = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
    }

    // Handle location changes
    const handleLocationChange = (newLocationValues) => {
        setLocationValues(newLocationValues);
        setFormCreateUser(prev => ({
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

    const handleSubmit = async (e) => {debugger
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        try {

        // Validate for field Name
        if (!formCreateUser.name.trim()) {
            setSubmitError('User name is required');
            return;
        }

        // Validate for field Last Name
        if (!formCreateUser.lastname.trim()) {
            setSubmitError('User Last name is required');
            return;
        
        }
        
        // Validate for field Tag
        if (!formCreateUser.tag.trim()) {
            setSubmitError('tag is required');
            return;
        }

        // Validate for field Password
        if (!formCreateUser.password.trim()) {
            setSubmitError('password is required');
            return;
        }

        if (formCreateUser.password.trim() !== confirmPassword) {
            setSubmitError('confirm password required');
            return;
        }

        // Validate for field Email
        if (!formCreateUser.email.trim()) {
            setSubmitError('email is required');
            return;
        }

        // Validate for field Country
        if (!formCreateUser.countryid) {
            setSubmitError('CountryID is required');
            return;
        }

        // Validate for field State
        if (!formCreateUser.stateid) {
            setSubmitError('StateID is required');
            return;
        }

        // Validate for field City
        if (!formCreateUser.cityid) {
            setSubmitError('cityID is required');
            return;
        }
        
        // API call to create user
        const response = await axios.post(URLsCatalogService.Users, {
            name: formCreateUser.name.trim(),
            secondname: formCreateUser.secondname.trim(),
            lastname: formCreateUser.lastname.trim(),
            countryid: formCreateUser.countryid,
            stateid: formCreateUser.stateid,
            cityid: formCreateUser.cityid,
            description:formCreateUser.description,
            email:formCreateUser.email,
            tag: formCreateUser.tag,
            password:formCreateUser.password
        }, {
            headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer your-token-here' // Add if needed
            }
        });

        //handle response
        if (response.status !== 201) {
            setSubmitError('Failed to create user. Please try again.');
            return;
        } else {
            setSubmitSuccess(true);
        }
        // Reset form after successful submission
        resetForm();
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormCreateUser({
            name: '',
            secondname:'',
            lastname:'',
            countryid: 0,
            stateid: 0,
            cityid: 0,
            description: '',
            email:'',
            tag:'',
            password:''
        });
        setLocationValues({
            countryid: 0,
            stateid: 0,
            cityid: 0
        });
        setConfirmPassword('');
    };

    useEffect(()=> {
        //getCatalogues
        const getCatalogues = async() => {
            try {
                const response = await axios.get(`${URLsCatalogService.Catalogues}/all`);
                const data = response.data.info;
                setAllCatalogues(data);
                setLoading(false);
            } catch (error) {

            }
        };
        
        getCatalogues();
    },[URLsCatalogService.Catalogues]);

    if (loading) {
        setLoading(false)
        return <CircularProgress />;
    }
    return (
        <>
            <Typography variant="h5" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ fontFamily: "'Press Start 2P', cursive" }}>
                Create Account
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
                    formUser={formCreateUser}
                    handleChange={handleChange}
                    id={null}
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
                    variant="outlined"
                    size="small"
                    onClick={handleSubmit}
                    startIcon={ <Person/> }
                >
                    Create Account
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
                message="User created successfully!"
            />
        </>
    );
}

export default CreateUser;