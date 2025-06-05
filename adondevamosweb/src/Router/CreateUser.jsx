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

function CreateUser(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        countryID: '',
        stateID: '',
        cityID: '',
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
    };

    
    const handleSelect = (event) => {
        console.log(event.target.value);
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
        console.log(formCreateUser);
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
        if (!formCreateUser.countryID != null) {
            throw new Error('CountryID is required');
        }

        // Validate for field State
        if (!formCreateUser.stateID != null) {
            throw new Error('StateID is required');
        }

        // Validate for field City
        if (!formCreateUser.cityID != null) {
            throw new Error('cityID is required');
        }

        // API call to create user
        const response = await axios.post('http://localhost/CreateUser', {
            name: formCreateUser.name.trim(),
            secondName: formCreateUser.secondName.trim(),
            lastName: formCreateUser.lastName.trim(),
            countryID: formCreateUser.countryID,
            stateID: formCreateUser.stateID,
            cityID: formCreateUser.cityID,
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
            console.error('Error creating place:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCatalogues = async () =>{
        
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
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

                
                <CountriesSelectList value={formCreateUser.countryID} onChange={handleSelect} countrylist={catCountries}/>

                <TextField
                        id="stateID"
                        name="stateID"
                        select
                        label="State"
                        defaultValue="1"
                        helperText="Please select your state"
                        value={formCreateUser.stateID}
                        onChange={handleChange}
                        >
                        {catStates.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                </TextField>

                <TextField
                        id="cityID"
                        name="cityID"
                        select
                        label="City"
                        defaultValue="1"
                        helperText="Please select your city"
                        value={formCreateUser.cityID}
                        onChange={handleChange}
                        >
                        {catCities.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                </TextField>

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