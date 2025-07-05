import { useState } from "react";
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';
    
function Login(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formLogIn, setFormLogIn] = useState({
        email:'',
        password:''
    });

    // Handle form submission
    const handleSubmit = async (e) => {

    }

    const handleChange = async (e) => {

    }

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h6"  gutterBottom align="center">
                Log In
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%'

            }}>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Email or Tag"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formLogIn.email}
                    fullWidth
                    required
                />
                <TextField
                    id="pass"
                    name="pass"
                    label="Password"
                    type="password"
                    placeholder="Email or Tag"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formLogIn.pass}
                    fullWidth
                    required
                />
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="contained"
                    size="small"
                    
                    >
                    Log In
                </Button>
            </Box>      
        </Container>);
}
export default Login;