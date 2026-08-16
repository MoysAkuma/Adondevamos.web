import { Snackbar, Alert } from '@mui/material';

/**
 * Reusable Snackbar notification component
 * @param {boolean} open - Whether the snackbar is visible
 * @param {Function} onClose - Callback when snackbar closes
 * @param {string} message - Message to display
 * @param {string} severity - Alert severity: 'success', 'error', 'warning', 'info'
 * @param {number} autoHideDuration - Time in ms before auto-hiding (default: 6000)
 * @param {string} variant - Alert variant: 'filled', 'outlined', 'standard'
 * @param {object} anchorOrigin - Position of snackbar
 */
function SnackbarNotification({ 
  open = false,
  onClose,
  message,
  severity = 'success',
  autoHideDuration = 6000,
  variant = 'filled',
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' }
}) {
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarNotification;
