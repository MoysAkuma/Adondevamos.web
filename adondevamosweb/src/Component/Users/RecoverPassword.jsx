import React from "react";
import { useState } from "react";
import { Typography, Box, TextField, 
    Alert, Snackbar } from "@mui/material";
import { Button, Modal } from "@mui/material";
import { Help } from "@mui/icons-material";
import axios from "axios";
import config from "../../Resources/config";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24, 
  pt: 2,
  px: 4,
  pb: 3,
};

export default function RecoverPassword() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [anonEmail, setAnonEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    // Email validation regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleOpen = () => {
        setOpen(true);
        setEmailError("");
        setSuccessMessage("");
        setAnonEmail("");
    };

    const handleClose = () => {
        setOpen(false);
        setEmailError("");
        setSuccessMessage("");
        setAnonEmail("");
        setTimeout(() => {
            setShowMessage(false);
        }, 10000);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setAnonEmail(value);
        
        // Clear error when user starts typing
        if (emailError) {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email
        if (!anonEmail) {
            setEmailError("Email is required");
            return;
        }
        
        if (!isValidEmail(anonEmail)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        handleClose();
        await callRecoverPasswordAPI(anonEmail);
    };

    const callRecoverPasswordAPI = async (email) => {
        setIsSubmitting(true);
        setEmailError("");
        
        try {
            const response = await axios.post(
                `${config.api.baseUrl}/Users/RecoverPassword`, 
                { email },
                { withCredentials: true }
            );
            setSuccessMessage('Instructions sent to your email.');
            setShowMessage(true);
        } catch (error) {
            setEmailError(error.response?.data?.message || 'Error sending instructions. Please try again.');
            
        }
        finally {
            setIsSubmitting(false);
        }
        
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
    };

    return (
        <>
            <Button 
                type="button" 
                disabled={isSubmitting}
                variant="text"
                size="small"
                endIcon={<Help/>}
                sx={{ color:"#000"}}
                onClick={handleOpen}
            >
                Recover Password
            </Button>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <Typography id="parent-modal-title" variant="h6" component="h2">
                        Insert Email
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={anonEmail}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        
                        <Typography id="parent-modal-description" sx={{ mt: 2 }}>
                            We will send you an email with instructions to recover your password.
                        </Typography>

                        {successMessage && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {successMessage}
                            </Alert>
                        )}
                        
                        <Box sx={{ 
                            display:'flex', 
                            justifyContent: 'flex-end',
                            mt: 2,
                            gap: 1
                        }}>
                            <Button 
                                type="button"
                                variant="outlined"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !anonEmail}
                                variant="contained"
                            >
                                {isSubmitting ? "Sending..." : "Send Instructions"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={showMessage} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}>
                <Alert
                    onClose={handleCloseAlert}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Password recovery instructions sent successfully.
                </Alert>
                </Snackbar>
        </>
    );
}