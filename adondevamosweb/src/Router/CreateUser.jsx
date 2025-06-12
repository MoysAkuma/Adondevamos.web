import React, 
    { useState, 
    useEffect } from "react";
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem
    } from '@mui/material';

import CountriesSelectList from "../Component/Catalogues/CountriesSelectList";
import StateSelect from "../Component/Catalogues/StateSelect";
import CitiesSelect from "../Component/Catalogues/CitiesSelect";

import config from "../Resources/config";
function CreateUser(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States:`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            User:`${config.api.baseUrl}${config.api.endpoints.User}`,
        }
        );
    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            id:1,
            name:"MEXICO"
        }
    ]);
    const [catStates, setCatStates] = useState([
        {
            value:1,
            label:"SINALOA"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            value:1,
            label:"Culiacan"
        },
        {
            value:2,
            label:"Los mochis"
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
        console.log(name);
        switch (name){
            case 'countryid':
                getStates(value);
            case 'tag':
                verifyTag(value);
            default:
                return null;
        }
    };

    
    const handleSelect = (event) => {
        handleChange(event);
        console.log(formCreateUser);
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

        // Validate for field Email
        if (!formCreateUser.email.trim()) {
            throw new Error('email is required');
        }

        // Validate for field Country
        if (!formCreateUser.countryid != null) {
            throw new Error('CountryID is required');
        }

        // Validate for field State
        if (!formCreateUser.stateid != null) {
            throw new Error('StateID is required');
        }

        // Validate for field City
        if (!formCreateUser.cityid != null) {
            throw new Error('cityID is required');
        }

        // API call to create user
        const response = await axios.post(URLsCatalogService.User, {
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
        setFormCreateUser({
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
        });
        
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
        console.log(URLsCatalogService.User + '/Verify/Tag/' + item);
        axios.get(URLsCatalogService.User + '/Verify/Tag/' + item)
        .then(resp => {
            console.log(resp);
        })
        .catch(error => console.error("Error verification of tag"));
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
                sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
                }}
            >
                
                <Typography variant="h6" component="h1" gutterBottom align="center">
                    Contact Info
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
                    fullWidth
                    required
                />

                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Email accout"
                    variant="outlined"
                    helperText="Your email must be unique"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formCreateUser.email}
                    fullWidth
                    required
                />

                <TextField
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

                <Typography variant="h6" component="h1" gutterBottom align="center">
                    Name
                </Typography>
                <TextField
                    id="name"
                    name="name"
                    label="User Name"
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
                >
                    Create User
                </Button>

            </Box>
        </Container>
    );
}

export default CreateUser;