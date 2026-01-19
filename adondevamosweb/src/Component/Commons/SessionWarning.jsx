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

const SessionWarning = () => {
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
          <Typography variant="h6">Session Expiring Soon</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Your session will expire in <strong>{formatTime(countdown)}</strong> due to inactivity.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
          Click "Stay Logged In" to continue your session, or you will be automatically logged out.
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
          Logout Now
        </Button>
        <Button onClick={handleExtend} variant="contained" color="primary" autoFocus>
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;
