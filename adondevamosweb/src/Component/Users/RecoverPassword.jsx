import React from "react";
import { useState } from "react";
import { Typography, Box, TextField, Alert, Snackbar } from "@mui/material";
import { Button, Modal } from "@mui/material";
import { Help } from "@mui/icons-material";
import useRecoverPasswordApi from "../../hooks/Session/useRecoverPasswordApi";

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
    const [anonEmail, setAnonEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    // Use the password recovery API hook
    const { recoverPassword, isLoading, error: apiError, resetState } = useRecoverPasswordApi();

    // Email validation regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleOpen = () => {
        setOpen(true);
        setEmailError("");
        resetState(); // Reset API hook state
    };

    const handleClose = () => {
        setOpen(false);
        setEmailError("");
        setSuccessMessage("");
        setAnonEmail("");
        resetState(); // Reset API hook state
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

        // Call the API hook
        const result = await recoverPassword(anonEmail);
        
        if (result.success) {
            setSuccessMessage('Password recovery link sent to your email. Please check your inbox.');
            setShowMessage(true);
            // Close modal and reset form without clearing success message
            setOpen(false);
            setEmailError("");
            setAnonEmail("");
            resetState();
        } else {
            setEmailError(result.error || 'Error sending instructions. Please try again.');
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowMessage(false);
    };

    return (
        <>
            <Button 
                type="button" 
                disabled={isLoading}
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

                        {apiError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {apiError}
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
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading || !anonEmail}
                                variant="contained"
                            >
                                {isLoading ? "Sending..." : "Send Instructions"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Snackbar 
                open={showMessage} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
}