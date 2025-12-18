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
        Box
    } from '@mui/material';

import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";

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
               setCatStates( allCatalogues.states.filter( item => item.countryid == value ) );
               setFormCreateUser( prev => ({
                ...prev,
                stateid: 0,
                cityid: 0
               }) );
            break
            case 'stateid':
                setCatCities( allCatalogues.cities.filter( item => item.stateid == value ) );
                setFormCreateUser( prev => ({
                    ...prev,
                    cityid: 0
                   }) );
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
        setEmailWasVerify(true);
        if( !utils.validateEmail(item) ) return;
        axios.get(URLsCatalogService.Users + '/Verify/email/' + item)
        .then(resp => {
            console.log(resp);
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

    useEffect(()=> {
        //getCatalogues
        const getCatalogues = async() => {
            try {
                const response = await axios.get(`${URLsCatalogService.Catalogues}/all`);
                const data = response.data.info;
                console.log("Catalogues fetched:", data);
                setAllCatalogues(data);
                setCatCountries(data.countries);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching catalogues:", error);
            }
        };
        
        getCatalogues();
    },[]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
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

                {
                    (formCreateUser.countryid != 0) ?
                    (
                        <>
                            <StateSelect 
                            val={formCreateUser.stateid}
                            onChangecall={handleSelect}
                            catStates={catStates}
                            />
                        </>
                    )
                    :
                    <></>
                }

                {
                    (formCreateUser.stateid != 0) ?
                    (
                        <>
                            <CitiesSelect 
                            val={formCreateUser.cityid}
                            onChangecall={handleSelect}
                            catCities={catCities}
                            />
                        </>
                    )
                    :
                    <></>
                }

                

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="text"
                    onClick={handleSubmit}
                >
                    Create User
                </Button>

            </Box>
        </>
    );
}

export default CreateUser;