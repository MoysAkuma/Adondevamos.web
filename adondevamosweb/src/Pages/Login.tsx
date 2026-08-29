import { useState } from "react";
import axios from 'axios';
import { useSeoMeta } from '@unhead/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Button,
  useMediaQuery,
  useTheme,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle, PersonAdd } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../context/AuthContext';
import config from '../Resources/config';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';
import RecoverPassword from '../Component/Users/RecoverPassword';
import SnackbarNotification from '../Component/Commons/SnackbarNotification';
import {
  PixelTypography,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledLoginContainer,
  StyledContentCard,
  StyledContentArea,
  LoginButton,
  PixelTextField,
} from '../Css/Login.styles';

function Login(){
    useSeoMeta({
        title: 'Login - AdondeVamos',
        description: 'Sign in to your AdondeVamos account to manage trips and places.',
        ogTitle: 'Login - AdondeVamos',
    });
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
            <StyledLoginContainer>
                {/* Header Section */}
                <StyledHeaderCard>
                    <StyledHeaderContent>
                        <PixelTypography 
                            variant="h4" 
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.3rem' },
                                color: '#FFFFFF',
                                mb: 1,
                                lineHeight: 1.6
                            }}
                        >
                            AdondeVamos.net
                        </PixelTypography>
                        <PixelTypography 
                            variant="body2" 
                            sx={{
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                color: '#98C1D9',
                                lineHeight: 1.6
                            }}
                        >
                            Log in to your account
                        </PixelTypography>
                    </StyledHeaderContent>
                </StyledHeaderCard>

                {/* Login Form Card */}
                <StyledContentCard>
                    <StyledContentArea>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2.5,
                            }}
                        >
                            <PixelTextField
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
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <AccountCircle sx={{ color: '#3D5A80' }} />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                />

                            <PixelTextField
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
                                component={LoginButton}
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                size="large"
                                endIcon={<LoginIcon />}
                                sx={{
                                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                    py: 1.5,
                                    backgroundColor: '#3D5A80',
                                    color: '#FFFFFF',
                                    '&:hover': { backgroundColor: '#2C4563' },
                                    '&:disabled': { backgroundColor: '#95a5a6', color: '#FFFFFF' },
                                }}
                            >
                                {isSubmitting ? 'Loading...' : 'Log In'}
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <RecoverPassword />
                        </Box>
                        <Divider 
                                sx={{ 
                                    my: 2,
                                    borderColor: '#2C2C2C',
                                    borderWidth: '2px'
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: '#2C2C2C', 
                                        fontWeight: 600,
                                        px: 2
                                    }}
                                >
                                    Don't have an account?
                                </Typography>
                            </Divider>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <Button
                                    component={LoginButton}
                                    type="button"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    size="large"
                                    startIcon={<PersonAdd />}
                                    href="/Create/User"
                                    sx={{
                                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                        py: 1.5,
                                        backgroundColor: '#52B788',
                                        color: '#FFFFFF',
                                        '&:hover': { backgroundColor: '#40916C' },
                                    }}
                                >
                                    Create Account
                                </Button>
                            </Box>
                            

                        

                    </StyledContentArea>
                </StyledContentCard>
                
                <SnackbarNotification
                    open={snackbar.open}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </StyledLoginContainer>
        </CenteredTemplate>
    );
}
export default Login;
