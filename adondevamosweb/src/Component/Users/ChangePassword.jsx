import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Modal,
    Box,
    Typography,
    TextField,
    IconButton,
    Alert
} from '@mui/material';
import { Close } from '@mui/icons-material';
import config from '../../Resources/config';

const ChangePassword = ({ userId }) => {
    const [openModal, setOpenModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async () => {
        // Validate that new password and confirm password match
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation password do not match');
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const rq = {
                current: currentPassword,
                value: newPassword
            };
            const response = await axios.patch(
                `${config.api.baseUrl}${config.api.endpoints.Users}/${userId}/password`,
                rq
            );


            if (response.status === 200) {
                handleCloseModal();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

    return (
        <>
            <Button 
                variant="contained" 
                onClick={handleOpenModal}
                color="primary"
            >
                Change Password
            </Button>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="change-password-modal-title"
                aria-describedby="change-password-modal-description"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="change-password-modal-title" variant="h6" component="h2">
                            Change Password
                        </Typography>
                        <IconButton onClick={handleCloseModal} size="small">
                            <Close />
                        </IconButton>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        margin="normal"
                        disabled={isSubmitting}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        disabled={isSubmitting}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        disabled={isSubmitting}
                        error={confirmPassword && newPassword !== confirmPassword}
                        helperText={
                            confirmPassword && newPassword !== confirmPassword 
                                ? 'Passwords do not match' 
                                : ''
                        }
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button 
                            onClick={handleCloseModal} 
                            variant="outlined"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            variant="contained" 
                            color="primary"
                            disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
                        >
                            {isSubmitting ? 'Changing...' : 'Change Password'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ChangePassword;
