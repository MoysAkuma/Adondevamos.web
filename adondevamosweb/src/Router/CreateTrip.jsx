import { useState } from 'react';
import axios from 'axios';
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

function CreateTrip(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            value:1,
            label:"MEXICO"
        }
    ]);
    const [catStates, setCatStates] = useState([
        {
            value:1,
            label:"SINALOA"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            value:1,
            label:"Culiacan"
        },
        {
            value:2,
            label:"Los mochis"
        }
    ]);
    // trip info
    const [formTrip, setFormTrip] = useState({
        name: '',
        description: '',
        itinerary:[],
        initialDate:"",
        finalDate:"",
        isInternational:false,
        countryID: '',
        stateID: '',
        cityID: '',
        memberlist:[]
    });
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate for field Trip Name
      if (!formTrip.name.trim()) {
        throw new Error('Trip name is required');
      }
      // Validate for field Description
      if (!formTrip.description.trim()) {
        throw new Error('Trip description is required');
      }
      // Validate for field Country
      if (!formTrip.countryID != null) {
        throw new Error('CountryID is required');
      }

      // Validate for field State
      if (!formTrip.stateID != null) {
        throw new Error('StateID is required');
      }

      // Validate for field City
      if (!formTrip.cityID != null) {
        throw new Error('cityID is required');
      }
      // Validate for field itinerary
      if (!formTrip.itinerary != null) {
        throw new Error('select at least one place is required');
      }

      // Validate for field initialDate
      if (!formTrip.initialDate != null) {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finalDate != null) {
        throw new Error('set final date');
      }

      // Validate for field member
      if (!formTrip.memberlist != null ) {
        throw new Error('set member list');
      }
      

      // API call to create product
      const response = await axios.post('http://localhost/CreatePlace', {
        name: formTrip.name.trim(),
        countryID: formTrip.countryID,
        stateID: formTrip.stateID,
        cityID: formTrip.cityID,
        description: formTrip.description,
        isInternational: formTrip.isInternational,
        itinerary:formTrip.itinerary,
        initialDate:formTrip.initialDate,
        finalDate:formTrip.finalDate,
        memberlist:formTrip.memberlist
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });

      // Handle success
      setSubmitSuccess(true);
      console.log('Trip created:', response.data);
      
      // Reset form after successful submission
      setFormTrip({
        name: '',
        description: '',
        itinerary:[],
        initialDate:"",
        finalDate:"",
        isInternational:false,
        countryID: '',
        stateID: '',
        cityID: '',
        memberlist:[]
      });
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h6" component="h6" gutterBottom align="center">
                Create Trip
            </Typography>
            <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
            >
                <Typography variant="h6" component="h6" gutterBottom align="center">
                Trip Info
                </Typography>

                <TextField
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Name of this trip"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formTrip.name}
                    fullWidth
                    required
                />
                
                <Typography variant="h6" component="h6" gutterBottom align="center">
                Ubication
                </Typography>

                <Typography variant="h6" component="h6" gutterBottom align="center">
                Itinerary
                </Typography>

                <Typography variant="h6" component="h6" gutterBottom align="center">
                Members
                </Typography>
            </Box>
        </Container>
    );
}

export default CreateTrip;
