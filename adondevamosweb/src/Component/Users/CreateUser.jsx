import React, 
    { useState, 
    useEffect,
    useRef } from "react";
import axios from 'axios';
import 
    {
        TextField, 
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

import UbicationSelector from "../Commons/Ubication/UbicationSelector";

import config from "../../Resources/config";
import utils from "../../Resources/utils";

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

    //tag
    const [tagwasVerify, setTagWasVerify] = useState(false);
    const [tagistaken, setTagistaken] = useState(false);
    const tagRef = useRef(null);

    //email
    const [emailwasVerify, setEmailWasVerify] = useState(false);
    const [emailIsUsed, setEmailIsUsed] = useState(false);
    const emailRef = useRef(null);

    //Password
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordWasVerify, setPasswordWasVerify] = useState(false);

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
        const { name, value } = e.target;
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

        if (formCreateUser.password.trim() != confirmPassword) {
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


    //verifytag
    const verifyTag = async( item ) =>{
        if(item.length > 3){
            setTagWasVerify(true);
            axios.get(URLsCatalogService.Users + '/Verify/tag/' + item)
            .then(resp => {
                console.log(resp);
                setTagistaken( (resp.status == 200 ));
            })
            .catch(error => { 
                    if(error.status == 404 ){
                        setTagistaken(false);
                    }
                }
            );
        }
        
    };

    //verifyemail
    const verifyEmail = async( item ) =>{
        if (item === "") return;
        if( !utils.validateEmail(item) ) return;
        setEmailWasVerify(true);
        axios.get(URLsCatalogService.Users + '/Verify/email/' + item)
        .then(resp => {
            setEmailIsUsed(resp.status == 200);
        })
        .catch(error => { 
                if( (error.status == 404) || (error.response?.status == 404) ){
                    setEmailIsUsed(false);
                }
            }
        );
    };

    const handleConfirmPassword =() => {
        setPasswordWasVerify( (formCreateUser.password == confirmPassword) );
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
        setTagWasVerify(false);
        setTagistaken(false);
        setEmailWasVerify(false);
        setEmailIsUsed(false);
        setPasswordWasVerify(false);
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
    },[]);

    if (loading) {
        setLoading(false)
        return <CircularProgress />;
    }
    return (
        <>
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Create User
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
                
                <Typography variant="h6" component="h1" gutterBottom align="center">
                    Unique as You
                </Typography>
                <TextField
                    id="tag"
                    name="tag"
                    label="Tag"
                    placeholder="Tag"
                    variant="outlined"
                    helperText="Your tag must be unique"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCreateUser.tag}
                    onBlur={() =>  verifyTag(formCreateUser.tag)}
                    ref={tagRef}
                    fullWidth
                    required
                    error={ tagwasVerify && tagistaken }
                />
                {
                    tagwasVerify ? 
                    ( 
                        <Alert variant="outlined" 
                            gutterBottom 
                            align="center" 
                            severity={ tagistaken ? "error" : "success" }>
                                { tagistaken ? "Tag is already taken" : "Tag is available" }
                        </Alert>
                    )
                    : <></>
                }

                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Email accout"
                    variant="outlined"
                    helperText="Your email must be unique"
                    onChange={handleChange}
                    onBlur={() => verifyEmail(formCreateUser.email)}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCreateUser.email}
                    ref={emailRef}
                    fullWidth
                    required
                />
                {
                    emailwasVerify ? (
                    <Alert 
                        variant="outlined" 
                        component="body1" 
                        gutterBottom 
                        align="center" 
                        severity={ emailIsUsed ? "error" : "success" } >
                        { emailIsUsed ? "Email is already registed" : "Email is available" }
                    </Alert>) : 
                    <></>
                }
                <Typography variant="h6" component="h1" gutterBottom align="center">
                    Security
                </Typography>

                <TextField
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCreateUser.password}
                    fullWidth
                    required
                    error={ passwordWasVerify === false && confirmPassword.length > 0 }
                />

                <TextField
                    type="password"
                    id="confirmpassword"
                    name="confirmpassword"
                    label="Confirm your Password"
                    placeholder="Type again your password"
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    value={confirmPassword}
                    onBlur={handleConfirmPassword}
                    onChange={handleChangeConfirmPassword}
                    fullWidth
                    required
                    error={ passwordWasVerify === false && confirmPassword.length > 0 }
                />
                {
                    passwordWasVerify ? (
                        <Alert 
                            variant="outlined" 
                            component="body1"
                            gutterBottom 
                            align="center" 
                            severity={ passwordWasVerify ? "success" : "error" } >
                            { passwordWasVerify ? "Passwords match" : "Passwords do not match" }
                        </Alert>
                    ) : 
                    <></>
                }

                <Typography variant="h6" component="h1" gutterBottom align="center">
                    Your name
                </Typography>
                <TextField
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="First Name"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    variant="outlined"
                    value={formCreateUser.name}
                    fullWidth
                    required
                />
                
                <TextField
                    id="secondname"
                    name="secondname"
                    label="Second Name"
                    placeholder="Second Name"
                    onChange={handleChange}
                    value={formCreateUser.secondname}
                    fullWidth
                />

                <TextField
                    required
                    id="lastname"
                    name="lastname"
                    label="Last Name"
                    placeholder="User Last Name"
                    onChange={handleChange}
                    value={formCreateUser.lastname}
                    fullWidth
                />

                <TextField
                    fullWidth
                    name="description"
                    id="description"
                    label="Description"
                    value={formCreateUser.description}
                    placeholder="About you"
                    onChange={handleChange}
                    multiline
                    rows={3}
                />

                <UbicationSelector
                    allCatalogues={allCatalogues}
                    selectedValues={locationValues}
                    onChange={handleLocationChange}
                    required={true}
                    size={isMobile ? 'small' : 'medium'}
                    showLabels={true}
                    variant="outlined"
                    showIcon={true}
                />

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="text"
                    onClick={handleSubmit}
                    startIcon={ <Person/> }
                >
                    Create User
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