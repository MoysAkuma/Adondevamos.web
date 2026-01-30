import { Alert, Box } from '@mui/material';
import { Info } from '@mui/icons-material';

export default function MVPBanner() {
    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }}>
            <Alert 
                severity="info" 
                icon={<Info />}
                sx={{ 
                    borderRadius: 0,
                    justifyContent: 'center',
                    '& .MuiAlert-message': {
                        textAlign: 'center',
                        width: '100%'
                    }
                }}
            >
                Still in development, some features may not work as expected.
            </Alert>
        </Box>
    );
}
