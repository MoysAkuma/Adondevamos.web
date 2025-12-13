import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Tooltip,
        Typography,
        Box,
        InputAdornment,
        IconButton,
        Alert,
        AlertTitle
    } from '@mui/material';

import {  Visibility, VisibilityOff, AccountCircle, PersonAdd } from '@mui/icons-material';
import LoginIcon  from '@mui/icons-material/Login';
import { useAuth }  from '../context/AuthContext'

import config from '../Resources/config';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import RecoverPassword from "../Component/Users/RecoverPassword";
function Login(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    //showpassword
    const [showPassword, setShowPassword] = useState(false);
    const {login} = useAuth();
    //Urls
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Login : `${config.api.baseUrl}/login`
        }
    );

    //Form info
    const [formLogIn, setFormLogIn] = useState({
        email:'',
        password:''
    });

    //errors
    const [errors, setErrors] = useState({
      login : false
    });

    //navigate
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            //Validate email or tag
            if (!formLogIn.email.trim()) {
                throw new Error('User email or tag is required');
            }
            if (!formLogIn.password.trim()) {
                throw new Error('Password is required');
            }
            //call backend to log in
            const response = 
                await login(formLogIn.email.trim(), 
                formLogIn.password.trim());
            if(response.success){
                navigate("/");
            } else (
                setErrors(prev => ( {...prev, login : true} ))
            )
            setSubmitSuccess(true);
        }
        catch(err){
            switch(err.status){
                case 409:
                    console.log("loging failed");
                    //show message of login failed
                    setErrors(prev => ( {...prev, login : true} ));
                break;
            }
        } 
        finally {
        setIsSubmitting(false);
        }
    }

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormLogIn(
            prev => (
            {
                ...prev,
                [name]: value
            }
            )
        );
  };

  const handleClickShowPassword = (e) => {
    setShowPassword(!showPassword);
  };

  const resetErrorList = () => {

  };

    return (
        <CenteredTemplate>
            <>
                <Typography variant={isMobile ? "h3" : "h4"} gutterBottom align="center">
                    AdondeVamos
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={
                        {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    }
                >
                    <Typography variant={ "h4" } gutterBottom align="center">
                        Log in
                    </Typography>
                    
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="Email or Tag"
                        variant="standard"
                        onChange={handleChange}
                        size={ isMobile ? 'small' : 'medium' }
                        value={formLogIn.email}
                        fullWidth
                        required
                        InputLabelProps={{
                                shrink: true,
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                        >
                                        { <AccountCircle /> }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        variant="standard"
                        onChange={handleChange}
                        size={isMobile ? 'small' : 'medium'}
                        value={formLogIn.password}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                )
                            }
                        }}
                    />
                    {
                        errors.login ? 
                        (<>
                            <Alert severity="error">
                            <AlertTitle>Login failed! </AlertTitle>
                            Credentials not valid
                            </Alert>
                        </>
                        ) : (<></>)
                    }
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        variant="text"
                        size="small"
                        endIcon={ <LoginIcon/> }
                        >
                        Log In
                    </Button>

                    <RecoverPassword />
                    
                    <Button 
                        type="button" 
                        disabled={isSubmitting}
                        variant="text"
                        size="small"
                        startIcon={ <PersonAdd/> }
                        sx={{ color:"#000"}}
                        href="/Create/User"
                    >
                        Create an Account
                    </Button>
                    
                </Box>
            </>
        </CenteredTemplate>
    );
}
export default Login;