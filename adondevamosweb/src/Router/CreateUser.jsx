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
        Container,
        Typography,
        Box
    } from '@mui/material';

import CountriesSelectList from "../Component/Catalogues/CountriesSelectList";
import StateSelect from "../Component/Catalogues/StateSelect";
import CitiesSelect from "../Component/Catalogues/CitiesSelect";

import config from "../Resources/config";

function CreateUser(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States:`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            Users:`${config.api.baseUrl}${config.api.endpoints.Users}`,
        }
    );
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

    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            id : 1,
            name:"MEXICO"
        }
    ]);

    const [catStates, setCatStates] = useState([
        {
            id : 1,
            name : "SINALOA"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            id : 1,
            name : "Culiacan"
        },
        {
            id : 2,
            name : "Los mochis"
        }
    ]);

    // user info
    const [formCreateUser, setFormCreateUser] = useState({
        name: '',
        secondName:'',
        lastName:'',
        countryid: 1,
        stateid: 0,
        cityid: 0,
        description: '',
        email:'',
        tag:'',
        password:''
    });
 
    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCreateUser(prev => ({
          ...prev,
          [name]: value
        }));
        switch (name){
            case 'countryid':
                getStates(value);
            break
            case 'stateid':
                getCities(value);
            break
        }
    };
    const handleChangeConfirmPassword = (e) => {
        const { name, value } = e.target;
        setConfirmPassword(value);
    }

    
    const handleSelect = (event) => {
        handleChange(event);
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
            throw new Error('User name is required');
        }

        // Validate for field Last Name
        if (!formCreateUser.lastName.trim()) {
            throw new Error('User Last name is required');
        }
        
        // Validate for field Tag
        if (!formCreateUser.tag.trim()) {
            throw new Error('tag is required');
        }

        // Validate for field Password
        if (!formCreateUser.password.trim()) {
            throw new Error('password is required');
        }

        if (formCreateUser.password.trim() != confirmPassword) {
            throw new Error('confirm password required');
        }

        // Validate for field Email
        if (!formCreateUser.email.trim()) {
            throw new Error('email is required');
        }

        // Validate for field Country
        if (!formCreateUser.countryid) {
            throw new Error('CountryID is required');
        }

        // Validate for field State
        if (!formCreateUser.stateid) {
            throw new Error('StateID is required');
        }

        // Validate for field City
        if (!formCreateUser.cityid) {
            throw new Error('cityID is required');
        }

        // API call to create user
        const response = await axios.post(URLsCatalogService.Users, {
            name: formCreateUser.name.trim(),
            secondName: formCreateUser.secondName.trim(),
            lastName: formCreateUser.lastName.trim(),
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

        // Handle success
        setSubmitSuccess(true);
        console.log('User created:', response.data);
        
        // Reset form after successful submission
        setFormCreateUser(
            {
            name: '',
            secondName:'',
            lastName:'',
            countryID: '',
            stateID: '',
            cityID: '',
            description: '',
            email:'',
            tag:'',
            password:''
            }
        );
        
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message);
            console.error('Error creating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //getCountries
    const getCountries = async( ) =>{
        axios.get(URLsCatalogService.Countries)
        .then(resp => {
            setCatCountries(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getStates
    const getStates = async( item ) =>{
        axios.get(URLsCatalogService.States + '/ByCountryID/' + item)
        .then(resp => {
            setCatStates(resp.data.info);
            handleChange({target:{cityid:0}});
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getCities
    const getCities = async( item ) =>{
        axios.get(URLsCatalogService.Cities + '/ByState/' + item)
        .then(resp => {
            setCatCities(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //verifytag
    const verifyTag = async( item ) =>{
        if(item.length > 0){
            setTagWasVerify(true);
            axios.get(URLsCatalogService.User + '/Verify/Tag/' + item)
            .then(resp => {
                setTagistaken(false);
            })
            .catch(error => { 
                setTagistaken( (error.status == 409 ));
            console.error("Error verification of tag")});    
        }
        
    };

    //verifyemail
    const verifyEmail = async( item ) =>{
        setEmailWasVerify(true);
        axios.get(URLsCatalogService.User + '/Verify/Email/' + item)
        .then(resp => {
            setEmailIsUsed(false);
        })
        .catch(error => { 
            setTagistaken((error.status == 409));
            console.error("Error verification of tag")}
        );
    };

    const handleConfirmPassword =() => {
        setPasswordWasVerify( (formCreateUser.password == confirmPassword) );
    };

    useEffect(()=> {
        getCountries();
    },[]);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
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
                />
                {
                    tagwasVerify ? (<Typography variant="body1" component="body1" gutterBottom align="center">
                    { tagistaken ? "Tag is already taken" : "Tag is available" }
                    </Typography>) : <></>
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
                    emailwasVerify ? (<Typography variant="body1" component="body1" gutterBottom align="center">
                    { emailIsUsed ? "Email is already registed" : "Email is available" }
                    </Typography>) : <></>
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
                />
                {
                    passwordWasVerify ? (
                    <Typography variant="body1" component="body1" gutterBottom align="center">
                    Password is confirmed
                    </Typography>) : 
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
                    id="secondName"
                    name="secondName"
                    label="Second Name"
                    placeholder="Second Name"
                    onChange={handleChange}
                    value={formCreateUser.secondName}
                    fullWidth
                />

                <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    placeholder="User Last Name"
                    onChange={handleChange}
                    value={formCreateUser.lastName}
                    fullWidth
                />

                <TextField
                    fullWidth
                    name="description"
                    id="description"
                    label="Description"
                    placeholder="About you"
                    onChange={handleChange}
                    value={formCreateUser.description}
                />
                <Typography variant="h6" component="h6" gutterBottom align="center">
                    Ubication
                </Typography>

                
                <CountriesSelectList 
                val={formCreateUser.countryid} 
                onChangecall={handleSelect} 
                catCountries={catCountries} />

                <StateSelect 
                val={formCreateUser.stateid}
                onChangecall={handleSelect}
                catStates={catStates}
                />

                <CitiesSelect 
                val={formCreateUser.cityid}
                onChangecall={handleSelect}
                catCities={catCities}
                />

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Create User
                </Button>

            </Box>
        </Container>
    );
}

export default CreateUser;