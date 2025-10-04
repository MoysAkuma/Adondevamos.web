import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 
    {
        Typography  
    } from '@mui/material';

function ConfirmEmail(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    useEffect(() => {
        const confirmEmail = async () => {
          const url ="http://localhost:3000/ConfirmEmail";
          try {
            const resp = await axios.get(url);
            setArrMostVotedPlaces(resp.Info);
            console.log(resp);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        confirmEmail();
      }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (<Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h5"  gutterBottom align="center">
        Your email was confirmed!
      </Typography>
    </Container>);
}

export default ConfirmEmail;