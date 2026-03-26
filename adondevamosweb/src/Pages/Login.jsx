import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
        AlertTitle,
        Divider
    } from '@mui/material';

import {  Visibility, VisibilityOff, AccountCircle, PersonAdd, Gamepad } from '@mui/icons-material';
import LoginIcon  from '@mui/icons-material/Login';
import { useAuth }  from '../context/AuthContext'

import config from '../Resources/config';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import RecoverPassword from "../Component/Users/RecoverPassword";
import SnackbarNotification from "../Component/Commons/SnackbarNotification";

function Login(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    //showpassword
    const [showPassword, setShowPassword] = useState(false);
    const { login, authError } = useAuth();
    
    // Get redirect location from state, or default to home
    const from = location.state?.from?.pathname || "/";
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

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setErrors({ login: false });
        
        try {
            //Validate email or tag
            if (!formLogIn.email.trim()) {
                setErrors(prev => ({ ...prev, login: true }));
                setSubmitError('User email or tag is required');
                showSnackbar('User email or tag is required', 'warning');
                return;
            }
            if (!formLogIn.password.trim()) {
                setErrors(prev => ({ ...prev, login: true }));
                setSubmitError('Password is required');
                showSnackbar('Password is required', 'warning');
                return;
            }
            
            //call backend to log in
            const response = await login(
                formLogIn.email.trim(), 
                formLogIn.password.trim()
            );
            
            if(response.success){
                setSubmitSuccess(true);
                showSnackbar('Login successful', 'success');
                // Redirect to the page they tried to visit or home
                navigate(from, { replace: true });
            } else {
                setErrors(prev => ({ ...prev, login: true }));
                const message = response.message || 'Login failed. Please check your credentials.';
                setSubmitError(message);
                showSnackbar(message, 'error');
            }
        }
        catch(err){
            setErrors(prev => ({ ...prev, login: true }));
            const message = err?.response?.data?.message || err?.message || 'Unexpected error during login';
            setSubmitError(message);
            showSnackbar(message, 'error');
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
                <Typography 
                    variant={isMobile ? "h4" : "h3"} 
                    align="center"
                    sx={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#2c3e50',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        lineHeight: 1.6,
                        mb: 1
                    }}
                >
                    AdondeVamos.net
                </Typography>

                <Divider sx={{ width: '100%', mb: 3 }} />
                
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        width: '100%',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Typography 
                            variant="h5" 
                            sx={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: isMobile ? '0.9rem' : '1.1rem',
                                color: '#34495e',
                                lineHeight: 1.6
                            }}
                        >
                            Log in
                        </Typography>
                    </Box>
                    

                    <TextField
                        id="email"
                        name="email"
                        label="Email or Tag"
                        placeholder="Enter your email or tag"
                        variant="outlined"
                        onChange={handleChange}
                        size={isMobile ? 'small' : 'medium'}
                        value={formLogIn.email}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover fieldset': {
                                    borderColor: '#3498db',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2980b9',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 500
                            }
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccountCircle sx={{ color: '#95a5a6' }} />
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
                        placeholder="Enter your password"
                        variant="outlined"
                        onChange={handleChange}
                        size={isMobile ? 'small' : 'medium'}
                        value={formLogIn.password}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover fieldset': {
                                    borderColor: '#3498db',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2980b9',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 500
                            }
                        }}
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

                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        variant="contained"
                        size="large"
                        endIcon={<LoginIcon />}
                        sx={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: isMobile ? '0.6rem' : '0.7rem',
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: '#3498db',
                            boxShadow: '0 4px 0 #2980b9',
                            transition: 'all 0.1s',
                            '&:hover': {
                                backgroundColor: '#2980b9',
                                boxShadow: '0 2px 0 #21618c',
                                transform: 'translateY(2px)'
                            },
                            '&:active': {
                                boxShadow: '0 0 0 #21618c',
                                transform: 'translateY(4px)'
                            },
                            '&:disabled': {
                                backgroundColor: '#bdc3c7',
                                boxShadow: '0 4px 0 #95a5a6'
                            }
                        }}
                    >
                        {isSubmitting ? 'Loading...' : 'Log In'}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <RecoverPassword />
                    </Box>

                    <Divider sx={{ my: 1 }}>
                        <Typography variant="caption" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                            Don't have an account?
                        </Typography>
                    </Divider>
                    
                    <Button 
                        type="button" 
                        disabled={isSubmitting}
                        variant="outlined"
                        size="large"
                        startIcon={<PersonAdd />}
                        href="/Create/User"
                        sx={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: isMobile ? '0.6rem' : '0.7rem',
                            py: 1.5,
                            borderRadius: 2,
                            borderWidth: 2,
                            borderColor: '#2ecc71',
                            color: '#27ae60',
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: '#27ae60',
                                backgroundColor: 'rgba(46, 204, 113, 0.1)'
                            }
                        }}
                    >
                        Create Account
                    </Button>
                    
                </Box>
                <SnackbarNotification
                    open={snackbar.open}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </>
        </CenteredTemplate>
    );
}
export default Login;
