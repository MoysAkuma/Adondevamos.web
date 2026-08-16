import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import {
    TextField,
    Typography,
    Alert,
    useMediaQuery,
    useTheme,
    Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

import UbicationSelector from "../Commons/Ubication/UbicationSelector";
import config from "../../Resources/config";
import utils from "../../Resources/utils";

// 8-bit Styled Components
const PixelTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        backgroundColor: '#FFFFFF',
        fontFamily: "'Courier New', monospace",
        '& fieldset': {
            borderColor: '#2C2C2C',
            borderWidth: 3,
        },
        '&:hover fieldset': {
            borderColor: '#52B788',
            borderWidth: 3,
        },
        '&.Mui-focused fieldset': {
            borderColor: '#52B788',
            borderWidth: 4,
        },
        '&.Mui-error fieldset': {
            borderColor: '#d32f2f',
            borderWidth: 3,
        }
    },
    '& .MuiInputLabel-root': {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '0.7rem',
        '&.Mui-focused': {
            color: '#52B788',
        }
    },
    '& .MuiFormHelperText-root': {
        fontFamily: "'Courier New', monospace",
        fontSize: '0.7rem',
    }
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    border: '3px solid #2C2C2C',
    borderRadius: 0,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    lineHeight: 1.8,
}));

const SectionDivider = styled(Box)(({ theme }) => ({
    borderBottom: '3px solid #2C2C2C',
    margin: `${theme.spacing(3)} 0`,
}));

const FormUser = ({
    formUser,
    handleChange,
    id = null,
    allCatalogues,
    locationValues,
    onLocationChange,
    confirmPassword,
    onConfirmPasswordChange,
    size = 'medium'
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const fieldSize = size || (isMobile ? 'small' : 'medium');

    //URLS
    const URLsCatalogService = {
        Users: `${config.api.baseUrl}${config.api.endpoints.Users}`
    };

    //tag
    const [tagwasVerify, setTagWasVerify] = useState(false);
    const [tagistaken, setTagistaken] = useState(false);
    const tagRef = useRef(null);

    //email
    const [emailwasVerify, setEmailWasVerify] = useState(false);
    const [emailIsUsed, setEmailIsUsed] = useState(false);
    const emailRef = useRef(null);

    //Password
    const [passwordWasVerify, setPasswordWasVerify] = useState(false);

    //verifytag
    const verifyTag = async (item) => {
        if (item.length > 3) {
            setTagWasVerify(true);
            axios.get(URLsCatalogService.Users + '/Verify/tag/' + item)
                .then(resp => {
                    setTagistaken((resp.status == 200));
                })
                .catch(error => {
                    if (error.status == 404) {
                        setTagistaken(false);
                    }
                }
                );
        }
    };

    //verifyemail
    const verifyEmail = async (item) => {
        if (item === "") return;
        if (!utils.validateEmail(item)) return;
        setEmailWasVerify(true);
        axios.get(URLsCatalogService.Users + '/Verify/email/' + item)
            .then(resp => {
                setEmailIsUsed(resp.status == 200);
            })
            .catch(error => {
                if ((error.status == 404) || (error.response?.status == 404)) {
                    setEmailIsUsed(false);
                }
            }
            );
    };

    const handleConfirmPassword = () => {
        setPasswordWasVerify((formUser.password == confirmPassword));
    };

    return (
        <>
            <PixelTypography 
                variant="h6" 
                sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    color: '#2C2C2C',
                    mb: 2,
                    textAlign: 'center',
                    lineHeight: 1.6
                }}
            >
                Unique as You
            </PixelTypography>
            { 
                (id && id > 0) ? 
                <>
                    <PixelTypography
                        variant="body1"
                        sx={{ 
                            fontSize: '0.7rem',
                            mb: 1,
                            color: '#2C2C2C'
                        }}
                    >
                        <strong>Tag:</strong> {formUser.tag}
                    </PixelTypography>
                    <PixelTypography
                        variant="body1"
                        sx={{ 
                            fontSize: '0.7rem',
                            mb: 2,
                            color: '#2C2C2C'
                        }}
                    >
                        <strong>Email:</strong> {formUser.email}
                    </PixelTypography>
                </> 
            :
            <>
                <StyledTextField
                    id="tag"
                    name="tag"
                    label="Tag"
                    placeholder="Tag"
                    variant="outlined"
                    helperText="Your tag must be unique"
                    onChange={handleChange}
                    size={fieldSize}
                    value={formUser.tag}
                    onBlur={() => verifyTag(formUser.tag)}
                    ref={tagRef}
                    fullWidth
                    required
                    error={tagwasVerify && tagistaken}
                />
                {
                    tagwasVerify ?
                        (
                            <StyledAlert 
                                variant="outlined"
                                severity={tagistaken ? "error" : "success"}
                                sx={{ mb: 2 }}
                            >
                                {tagistaken ? "Tag is already taken" : "Tag is available"}
                            </StyledAlert>
                        )
                    : null
                }
                <StyledTextField
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Email account"
                    variant="outlined"
                    helperText="Your email must be unique"
                    onChange={handleChange}
                    onBlur={() => verifyEmail(formUser.email)}
                    size={fieldSize}
                    value={formUser.email}
                    ref={emailRef}
                    fullWidth
                    required
                />
                {
                    emailwasVerify ? (
                        <StyledAlert
                            variant="outlined"
                            severity={emailIsUsed ? "error" : "success"}
                            sx={{ mb: 2 }}
                        >
                            {emailIsUsed ? "Email is already registered" : "Email is available"}
                        </StyledAlert>) :
                        null
                }
                
                <SectionDivider />
                
                <PixelTypography 
                    variant="h6" 
                    sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        color: '#2C2C2C',
                        mb: 2,
                        textAlign: 'center',
                        lineHeight: 1.6
                    }}
                >
                    Security
                </PixelTypography>

                <StyledTextField
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    variant="outlined"
                    onChange={handleChange}
                    size={fieldSize}
                    value={formUser.password}
                    fullWidth
                    required
                    error={passwordWasVerify === false && confirmPassword && confirmPassword.length > 0}
                />

                <StyledTextField
                    type="password"
                    id="confirmpassword"
                    name="confirmpassword"
                    label="Confirm your Password"
                    placeholder="Type again your password"
                    variant="outlined"
                    size={fieldSize}
                    value={confirmPassword}
                    onBlur={handleConfirmPassword}
                    onChange={onConfirmPasswordChange}
                    fullWidth
                    required
                    error={passwordWasVerify === false && confirmPassword && confirmPassword.length > 0}
                />
                {
                    passwordWasVerify ? (
                        <StyledAlert
                            variant="outlined"
                            severity={passwordWasVerify ? "success" : "error"}
                            sx={{ mb: 2 }}
                        >
                            {passwordWasVerify ? "Passwords match" : "Passwords do not match"}
                        </StyledAlert>
                    ) :
                        null
                }
                </>
                }
            
            <SectionDivider />

            <PixelTypography 
                variant="h6" 
                sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    color: '#2C2C2C',
                    mb: 2,
                    textAlign: 'center',
                    lineHeight: 1.6
                }}
            >
                Your Name
            </PixelTypography>
            
            <StyledTextField
                id="name"
                name="name"
                label="Name"
                placeholder="First Name"
                onChange={handleChange}
                size={fieldSize}
                variant="outlined"
                value={formUser.name}
                fullWidth
                required
            />

            <StyledTextField
                id="secondname"
                name="secondname"
                label="Second Name"
                placeholder="Second Name"
                onChange={handleChange}
                size={fieldSize}
                variant="outlined"
                value={formUser.secondname}
                fullWidth
            />

            <StyledTextField
                required
                id="lastname"
                name="lastname"
                label="Last Name"
                placeholder="User Last Name"
                onChange={handleChange}
                size={fieldSize}
                variant="outlined"
                value={formUser.lastname}
                fullWidth
            />

            <StyledTextField
                fullWidth
                name="description"
                id="description"
                label="Description"
                value={formUser.description}
                placeholder="About you"
                onChange={handleChange}
                size={fieldSize}
                variant="outlined"
                multiline
                rows={3}
            />

            <SectionDivider />

            <PixelTypography 
                variant="h6" 
                sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    color: '#2C2C2C',
                    mb: 2,
                    textAlign: 'center',
                    lineHeight: 1.6
                }}
            >
                Location
            </PixelTypography>

            <UbicationSelector
                allCatalogues={allCatalogues}
                selectedValues={locationValues}
                onChange={onLocationChange}
                required={true}
                size={fieldSize}
                showLabels={true}
                variant="outlined"
                showIcon={true}
            />
        </>
    );
};

export default FormUser;
