import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import {
    TextField,
    Typography,
    Alert,
    useMediaQuery,
    useTheme
} from '@mui/material';

import UbicationSelector from "../Commons/Ubication/UbicationSelector";
import config from "../../Resources/config";
import utils from "../../Resources/utils";

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
                    console.log(resp);
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
            <Typography variant="h6" 
            component="h1" gutterBottom align="center" sx={{ fontFamily: "'Press Start 2P', cursive" }}>
                Unique as You
            </Typography>
            { 
                (id && id > 0) ? 
                <>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        align="left"
                        color="textSecondary"
                    >
                        <strong>Tag:</strong> {  formUser.tag }
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        align="left"
                        color="textSecondary"
                    >
                        <strong>Email:</strong> {  formUser.email }
                    </Typography>
            </> 
            :
            <>
                <TextField
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
                            <Alert variant="outlined"
                                gutterBottom
                                align="center"
                                severity={tagistaken ? "error" : "success"}>
                                {tagistaken ? "Tag is already taken" : "Tag is available"}
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
                    onBlur={() => verifyEmail(formUser.email)}
                    size={fieldSize}
                    value={formUser.email}
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
                            severity={emailIsUsed ? "error" : "success"} >
                            {emailIsUsed ? "Email is already registed" : "Email is available"}
                        </Alert>) :
                        <></>
                }
                <Typography variant="h6" 
                component="h1" 
                gutterBottom align="center" 
                sx={{ fontFamily: "'Press Start 2P', cursive" }}>
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
                    size={fieldSize}
                    value={formUser.password}
                    fullWidth
                    required
                    error={passwordWasVerify === false && confirmPassword && confirmPassword.length > 0}
                />

                <TextField
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
                        <Alert
                            variant="outlined"
                            component="body1"
                            gutterBottom
                            align="center"
                            severity={passwordWasVerify ? "success" : "error"} >
                            {passwordWasVerify ? "Passwords match" : "Passwords do not match"}
                        </Alert>
                    ) :
                        <></>
                }
                </>
                }
            

            

            <Typography variant="h6" 
            component="h1" gutterBottom 
            align="center" sx={{ fontFamily: "'Press Start 2P', cursive" }}>
                Your name
            </Typography>
            <TextField
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

            <TextField
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

            <TextField
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

            <TextField
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
