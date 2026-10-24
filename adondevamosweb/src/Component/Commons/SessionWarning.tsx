import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SessionWarning = () => {
  const { t } = useTranslation();
  const { sessionWarning, extendSession, logout } = useAuth();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (sessionWarning) {
      setCountdown(300);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            logout('Session expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionWarning, logout]);

  useEffect(() => {
    setProgress((countdown / 300) * 100);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtend = () => {
    extendSession();
    setCountdown(300);
  };

  return (
    <Dialog 
      open={sessionWarning} 
      onClose={handleExtend}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          <Typography variant="h6">{t('common.sessionExpiring')}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {t('common.sessionExpires', { time: formatTime(countdown) })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
          {t('common.stayLoggedInHint')}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={progress > 50 ? 'primary' : progress > 25 ? 'warning' : 'error'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => logout('User logged out')} color="error">
          {t('common.logoutNow')}
        </Button>
        <Button onClick={handleExtend} variant="contained" color="primary" autoFocus>
          {t('common.stayLoggedIn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;
