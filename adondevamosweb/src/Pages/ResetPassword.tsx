import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import {
  CardContent,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, ArrowBack } from '@mui/icons-material';
import useResetPasswordApi from '../hooks/Session/useResetPasswordApi';
import useVerifyResetTokenApi from '../hooks/Session/useVerifyResetTokenApi';
import {
  StyledResetContainer,
  StyledResetCard,
  ResetButton,
} from '../Css/ResetPassword.styles';

const ResetPassword = () => {
  useSeoMeta({
    title: 'Reset Password - AdondeVamos',
    description: 'Set a new password for your AdondeVamos account.',
    ogTitle: 'Reset Password - AdondeVamos',
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      <StyledResetContainer>
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying reset link...
          </Typography>
        </Box>
      </StyledResetContainer>
    );
  }

  // Error state - invalid or expired token
  if (verifyError || !isValid) {
    return (
      <StyledResetContainer>
        <StyledResetCard>
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
            <ResetButton
              fullWidth
              variant="contained"
              onClick={() => navigate('/Login')}
              startIcon={<ArrowBack />}
            >
              Back to Login
            </ResetButton>
          </CardContent>
        </StyledResetCard>
      </StyledResetContainer>
    );
  }

  return (
    <StyledResetContainer>
      <StyledResetCard>
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

            <ResetButton
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
            </ResetButton>

            <ResetButton
              fullWidth
              variant="outlined"
              onClick={() => navigate('/Login')}
              disabled={isResetting}
              startIcon={<ArrowBack />}
            >
              Back to Login
            </ResetButton>
          </Box>
        </CardContent>
      </StyledResetCard>
    </StyledResetContainer>
  );
};

export default ResetPassword;
