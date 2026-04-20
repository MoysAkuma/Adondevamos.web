import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, Lock, ArrowBack } from '@mui/icons-material';
import useResetPasswordApi from '../hooks/Session/useResetPasswordApi';
import useVerifyResetTokenApi from '../hooks/Session/useVerifyResetTokenApi';

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '500px !important',
  margin: '0 auto',
  padding: theme.spacing(2),
  marginTop: theme.spacing(8)
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#FFFFFF',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  '&:hover': {
    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
  },
  '&:active': {
    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
    transform: 'translate(2px, 2px)',
  }
}));

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { verifyToken, isLoading: isVerifying, error: verifyError, isValid, email } = useVerifyResetTokenApi();
  const { resetPassword, isLoading: isResetting, error: resetError, success } = useResetPasswordApi();

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setValidationError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    verifyToken(token);
  }, [token, verifyToken]);

  // Redirect to login on success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/Login', { 
          state: { message: 'Password reset successfully! Please login with your new password.' } 
        });
      }, 2000);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setValidationError('Both password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Submit password reset
    await resetPassword(token, newPassword);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <StyledContainer>
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying reset link...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  // Error state - invalid or expired token
  if (verifyError || !isValid) {
    return (
      <StyledContainer>
        <StyledCard>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Reset Link Invalid
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {verifyError || 'This password reset link is invalid or has expired.'}
            </Alert>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Password reset links expire after 1 hour for security reasons.
              Please request a new password reset.
            </Typography>
            <StyledButton
              fullWidth
              variant="contained"
              onClick={() => navigate('/Login')}
              startIcon={<ArrowBack />}
            >
              Back to Login
            </StyledButton>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledCard>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Lock sx={{ fontSize: 60, color: '#3D5A80' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              Reset Password
            </Typography>
            {email && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Resetting password for: <strong>{email}</strong>
              </Typography>
            )}
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successfully! Redirecting to login...
            </Alert>
          )}

          {(resetError || validationError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetError || validationError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isResetting || success}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={isResetting || success}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText="At least 6 characters"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isResetting || success}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={isResetting || success}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isResetting || success}
            >
              {isResetting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </StyledButton>

            <StyledButton
              fullWidth
              variant="outlined"
              onClick={() => navigate('/Login')}
              disabled={isResetting}
              startIcon={<ArrowBack />}
            >
              Back to Login
            </StyledButton>
          </Box>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};

export default ResetPassword;
