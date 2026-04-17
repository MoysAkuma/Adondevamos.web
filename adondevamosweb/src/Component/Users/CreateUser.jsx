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
        Snackbar,
        Card,
        CardContent
    } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person } from '@mui/icons-material';

import FormUser from "./FormUser";
import config from "../../Resources/config";
import useCatalogues from "../../hooks/useCatalogues";

// 8-bit Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: '600px',
    margin: '0 auto',
    padding: theme.spacing(2),
}));

const StyledHeaderCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    marginBottom: theme.spacing(3),
    backgroundColor: '#3D5A80',
}));

const StyledHeaderContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#3D5A80',
    color: '#FFFFFF',
    padding: theme.spacing(3),
    textAlign: 'center',
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    }
}));

const StyledFormCard = styled(Card)(({ theme }) => ({
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E0AC69',
}));

const StyledFormContent = styled(CardContent)(({ theme }) => ({
    backgroundColor: '#E0AC69',
    padding: theme.spacing(3),
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    }
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const PixelButton = styled(Button)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.7rem',
    border: '4px solid #2C2C2C',
    borderRadius: 0,
    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#52B788',
    color: '#FFFFFF',
    padding: theme.spacing(1.5, 3),
    '&:hover': {
        backgroundColor: '#45a076',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
        transform: 'translate(2px, 2px)'
    },
    '&:disabled': {
        backgroundColor: '#CCCCCC',
        color: '#888888',
        border: '4px solid #999999'
    },
    transition: 'all 0.1s ease'
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    border: '3px solid #2C2C2C',
    borderRadius: 0,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
}));

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

    const handleSubmit = async (e) => {
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

    const { catalogues, loading: cataloguesLoading } = useCatalogues();

    useEffect(() => {
        if (!cataloguesLoading) {
            setAllCatalogues(catalogues);
            setLoading(false);
        }
    }, [cataloguesLoading, catalogues]);

    if (loading) {
        return (
            <StyledContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#52B788' }} />
            </StyledContainer>
        );
    }
    
    return (
        <StyledContainer>
            {/* Header Section */}
            <StyledHeaderCard>
                <StyledHeaderContent>
                    <PixelTypography 
                        variant="h4" 
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            color: '#FFFFFF',
                            lineHeight: 1.6
                        }}
                    >
                        Create Account
                    </PixelTypography>
                    <PixelTypography 
                        variant="body2" 
                        sx={{
                            fontSize: { xs: '0.5rem', sm: '0.6rem' },
                            color: '#E0E0E0',
                            mt: 2,
                            lineHeight: 1.8
                        }}
                    >
                        Join our community!
                    </PixelTypography>
                </StyledHeaderContent>
            </StyledHeaderCard>

            {/* Form Section */}
            <StyledFormCard>
                <StyledFormContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
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

                        <PixelButton 
                            type="submit" 
                            disabled={isSubmitting}
                            fullWidth
                            startIcon={<Person/>}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Account'}
                        </PixelButton>
                    </Box>
                </StyledFormContent>
            </StyledFormCard>

            {/* Error Snackbar */}
            <Snackbar
                open={!!submitError}
                autoHideDuration={6000}
                onClose={() => setSubmitError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <StyledAlert 
                    onClose={() => setSubmitError('')} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {submitError}
                </StyledAlert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <StyledAlert 
                    onClose={() => setSubmitSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    User created successfully!
                </StyledAlert>
            </Snackbar>
        </StyledContainer>
    );
}

export default CreateUser;