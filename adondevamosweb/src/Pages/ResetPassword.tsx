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
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  useSeoMeta({
    title: `${t('auth.resetPasswordTitle')} - AdondeVamos`,
    description: t('auth.resetPasswordDescription'),
    ogTitle: `${t('auth.resetPasswordTitle')} - AdondeVamos`,
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
      setValidationError(t('auth.invalidResetLink'));
      return;
    }
    
    verifyToken(token);
  }, [token, verifyToken, t]);

  // Redirect to login on success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/Login', { 
          state: { message: t('auth.resetCompleteMessage') }
        });
      }, 2000);
    }
  }, [success, navigate, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setValidationError(t('auth.bothFieldsRequired'));
      return;
    }

    if (newPassword.length < 6) {
      setValidationError(t('auth.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t('auth.passwordMismatch'));
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
            {t('auth.verifyingReset')}
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
              {t('auth.invalidResetTitle')}
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {verifyError || t('auth.invalidResetMessage')}
            </Alert>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('auth.resetLinkExpiry')}
            </Typography>
            <ResetButton
              fullWidth
              variant="contained"
              onClick={() => navigate('/Login')}
              startIcon={<ArrowBack />}
            >
              {t('auth.backToLogin')}
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
              {t('auth.resetPasswordTitle')}
            </Typography>
            {email && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('auth.resettingFor')} <strong>{email}</strong>
              </Typography>
            )}
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('auth.resetSuccess')}
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
              label={t('auth.newPassword')}
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
              helperText={t('auth.atLeastSixCharacters')}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('auth.confirmNewPassword')}
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
                  {t('auth.resettingPassword')}
                </>
              ) : (
                t('auth.resetPasswordTitle')
              )}
            </ResetButton>

            <ResetButton
              fullWidth
              variant="outlined"
              onClick={() => navigate('/Login')}
              disabled={isResetting}
              startIcon={<ArrowBack />}
            >
              {t('auth.backToLogin')}
            </ResetButton>
          </Box>
        </CardContent>
      </StyledResetCard>
    </StyledResetContainer>
  );
};

export default ResetPassword;
