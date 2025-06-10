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

function CreatePlace() {
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

  const [catFacilities, setCatFacilities] = useState([
    {
        value:true,
        label:"Wi-fi",
        code:"wifi"
    },
    {
        value:false,
        label:"Bathroom",
        code:"bath"
    }
]);
// State to track checked options
const [checkedFacilities, setCheckedFacilities] = useState({});

const facilitiesChange = (event) => {
  setCheckedFacilities({
    ...checkedFacilities,
      [event.target.name]: event.target.checked,
  });
};
  // placeinfo
  const [formCreatePlace, setformCreatePlace] = useState({
    name: '',
    countryID: '',
    stateID: '',
    cityID: '',
    description: '',
    address:'',
    facilities:[],
    isInternational: false
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //update request
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformCreatePlace(prev => ({
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
      // Validate for field PlaceName
      if (!formCreatePlace.name.trim()) {
        throw new Error('Place name is required');
      }
      // Validate for field Description
      if (!formCreatePlace.description.trim()) {
        throw new Error('Place description is required');
      }
      // Validate for field Address
      if (!formCreatePlace.address.trim()) {
        throw new Error('Place address is required');
      }
      // Validate for field Country
      if (!formCreatePlace.countryID != null) {
        throw new Error('CountryID is required');
      }

      // Validate for field State
      if (!formCreatePlace.stateID != null) {
        throw new Error('StateID is required');
      }

      // Validate for field City
      if (!formCreatePlace.cityID != null) {
        throw new Error('cityID is required');
      }
      // Validate for field City
      if (!formCreatePlace.itinerary != null) {
        throw new Error('select at least one place is required');
      }
      

      // API call to create product
      const response = await axios.post('http://localhost/CreatePlace', {
        name: formCreatePlace.name.trim(),
        countryID: formCreatePlace.countryID,
        stateID: formCreatePlace.stateID,
        cityID: formCreatePlace.cityID,
        description: formCreatePlace.description,
        address:formCreatePlace.address,
        facilities:formCreatePlace.facilities,
        isInternational: formCreatePlace.isInternational
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });

      // Handle success
      setSubmitSuccess(true);
      console.log('Place created:', response.data);
      
      // Reset form after successful submission
      setformCreatePlace({
        name: '',
        countryID: '',
        stateID: '',
        cityID: '',
        description: '',
        address:'',
        facilities:[],
        isInternational: false
      });
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h6" component="h6" gutterBottom align="center">
          Create Place
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
          Place Info
        </Typography>

        <TextField
            id="name"
            name="name"
            label="Name"
            placeholder="Name of place"
            variant="outlined"
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
            value={formCreatePlace.name}
            fullWidth
            required
        />

        <TextField
          fullWidth
          name="description"
          id="description"
          label="Description"
          placeholder="About this place"
          onChange={handleChange}
          value={formCreatePlace.description}
        />

        <TextField
          fullWidth
          name="address"
          id="address"
          label="Address"
          onChange={handleChange}
          value={formCreatePlace.address}
        />

        <Typography variant="h6" component="h6" gutterBottom align="center">
            Ubication
        </Typography>

        <TextField
                id="countryID"
                name="countryID"
                select
                label="Country"
                defaultValue="1"
                helperText="Please select your Country"
                value={formCreatePlace.countryID}
                onChange={handleChange}
                >
                {catCountries.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
        </TextField>

        <TextField
                id="stateID"
                name="stateID"
                select
                label="State"
                defaultValue="1"
                helperText="Please select your state"
                value={formCreatePlace.stateID}
                onChange={handleChange}
                >
                {catStates.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
        </TextField>

        <TextField
                id="cityID"
                name="cityID"
                select
                label="City"
                defaultValue="1"
                helperText="Please select your city"
                value={formCreatePlace.cityID}
                onChange={handleChange}
                >
                {catCities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
        </TextField>
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Facilities
        </Typography>
        <FormGroup>
          {
            catFacilities.map((opt)=>(
              <FormControlLabel
                key={opt.code}
                label={opt.label}
                control={
                  <Checkbox name={opt.code} value={opt.value} checked={checkedFacilities[opt.code] || false} onChange={facilitiesChange} />
              } />
            ))
          }
        </FormGroup>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="contained"
          >
          Create Place
        </Button>
      </Box>
    </Container>
  );
};

export default CreatePlace;