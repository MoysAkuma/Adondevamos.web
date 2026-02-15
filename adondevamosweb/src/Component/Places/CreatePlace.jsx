import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Typography,
        Box,
        FormGroup,
        FormControlLabel,
        Checkbox,
        CircularProgress
} from '@mui/material';

import { Save } from '@mui/icons-material';
import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";
import SnackbarNotification from "../Commons/SnackbarNotification";
import ImageUploader from '../Commons/ImageUploader';
import LocationPicker from '../Commons/LocationPicker';
import config from "../../Resources/config";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

function CreatePlace({
  catCountries,
    catStates,
    catCities,
    catFacilities
}) {
  const { isLogged, loading: authLoading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  //URLS
  const [URLsCatalogService, setURLsCatalogService] = useState(
      {
          Places:`${config.api.baseUrl}${config.api.endpoints.Places}`
      }
  );
  
  //filtered data
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  
  // Added images
  const [addedImages, setAddedImages] = useState([]);

  const [errors, setErrors] = useState({
    place: false,
    facilities: false
  });

  const [responseSuceess, setResponseSuccess] = useState({
    place: false,
    facilities: false
  });

  // State to track checked options
  const [checkedFacilities, setCheckedFacilities] = useState({});

  const facilitiesChange = (event) => {
    setCheckedFacilities({
      ...checkedFacilities,
      [event.target.name]: event.target.checked,
    });
  };
  // Place info
  const [formCreatePlace, setformCreatePlace] = useState({
    name: '',
    countryid: 0,
    stateid: 0,
    cityid: 0,
    description: '',
    address: '',
    ispublic: false,
    latitude: 24.8091,
    longitude: -107.3940
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');

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
      if (!formCreatePlace.countryid ) {
        throw new Error('CountryID is required');
      }

      // Validate for field State
      if (!formCreatePlace.stateid) {
        throw new Error('StateID is required');
      }

      // Validate for field City
      if (!formCreatePlace.cityid) {
        throw new Error('cityID is required');
      }

      //Validate for facilities of place
      if(Object.keys(checkedFacilities || {}).length === 0){
        throw new Error('select at least a facility is required');
      }
      
      // API call to create place
      const response = await axios.post(
        URLsCatalogService.Places, 
        {
          name: formCreatePlace.name.trim(),
          countryid: formCreatePlace.countryid,
          stateid: formCreatePlace.stateid,
          cityid: formCreatePlace.cityid,
          description: formCreatePlace.description,
          address: formCreatePlace.address,
          ispublic: formCreatePlace.ispublic,
          latitude: formCreatePlace.latitude,
          longitude: formCreatePlace.longitude
        }, 
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });
      if (response.status === 200 || response.status === 201) {
        setMessageSnack("Place was created successfully!");
        setSubmitSuccess(true);
        
        const placeId = response.data.info[0]?.id;
        
        // Save facilities
        if (placeId) {
          await saveSelectedFacilities(placeId);
          
          // Upload images if added
          if (addedImages.length > 0) {
            await addPhotosToGallery(placeId);
          }
          
          // Navigate to the new place after a short delay
          setTimeout(() => {
            navigate('/View/Place/' + placeId);
          }, 2000);
        }
      }
      
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      setMessageSnack(`Error creating place: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle select controller
  const handleSelect = (event) => {
    const { name, value } = event.target;
    handleChange(event);
    switch(name){
      case "countryid":
        setFilteredStates(
          catStates.filter(
            (state) => state.countryid === parseInt(value)
          )
        );
        setFilteredCities([]);
        setformCreatePlace(prev => ({
          ...prev,
          stateid: 0,
          cityid: 0
        }));
        break;
      case "stateid":
        setFilteredCities(
          catCities.filter(
            (city) => city.stateid === parseInt(value)
          )
        );
        setformCreatePlace(prev => ({
          ...prev,
          cityid: 0
        }));
        break;
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setErrors(prev => ({
      place: false,
      facilities: false
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSubmitSuccess(false);
    setSubmitError('');
  };
    

  // Save selected facilities
  const saveSelectedFacilities = async(placeId) => {
    const checkedFacilitiesToSave = Object.keys(checkedFacilities).map(key => ({
      facilityid: Number(key),
      value: checkedFacilities[key]
    }));

    const formSaveFacilities = {  
      Facilities: checkedFacilitiesToSave
    };

    const url = `${URLsCatalogService.Places}/${placeId}/Facilities`;
    
    try {
      await axios.post(url, formSaveFacilities);
      setMessageSnack("Facilities were saved successfully.");
    } catch (error) {
      console.error("Error saving facilities", error);
      setMessageSnack("Error saving facilities.");
    }
  };

  // Add photos to gallery
  const addPhotosToGallery = async (placeId) => {
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const photos = await Promise.all(
        addedImages.map(async (photo) => {
          let base64Data;
          let mimetype;
          let extension;

          if (photo.file && photo.file instanceof File) {
            base64Data = await convertToBase64(photo.file);
            mimetype = photo.file.type || "image/jpeg";
            extension = photo.name ? photo.name.split('.').pop() : "jpg";
          } else if (photo instanceof File) {
            base64Data = await convertToBase64(photo);
            mimetype = photo.type || "image/jpeg";
            extension = photo.name ? photo.name.split('.').pop() : "jpg";
          }

          return {
            name: `place_${placeId}_${Date.now()}`,
            base64: base64Data,
            mimetype: mimetype,
            extension: extension
          };
        })
      );

      const url = `${URLsCatalogService.Places}/${placeId}/Photos`;
      await axios.post(url, { Photos: photos });
      setMessageSnack("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos", error);
      setMessageSnack("Error uploading photos.");
    }
  };
    

  useEffect(() => {
    const loadData = async () => {

      setLoading(false);
    };
    loadData();
  }, []);

  // Show loading state
  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check authentication and permissions
  if (!isLogged) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" align="center">
          You must be logged in to create a place.
        </Typography>
      </Box>
    );
  }

  if (!hasPermission('write')) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" align="center">
          You don't have permission to create places.
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <Typography variant="h6" component="h6" 
      gutterBottom align="center">
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
        <Typography variant="h6" component="h6" 
        gutterBottom align="left">
          Place Info
        </Typography>

        <TextField
            id="name"
            name="name"
            label="Name"
            placeholder="Name of place"
            variant="standard"
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
          variant="standard"
          placeholder="About this place"
          align="left"
          onChange={handleChange}
          value={formCreatePlace.description}
        />

        <Typography variant="h6" component="h6" gutterBottom align="left">
          Ubication
        </Typography>

        <TextField
          fullWidth
          name="address"
          id="address"
          label="Address"
          variant="standard"
          placeholder="Address of place"
          onChange={handleChange}
          value={formCreatePlace.address}
        />
        
        <CountriesSelectList 
          val={formCreatePlace.countryid} 
          onChangecall={handleSelect} 
          catCountries={catCountries} 
        />

        {
          formCreatePlace.countryid ? (  
            <StateSelect 
              val={formCreatePlace.stateid}
              onChangecall={handleSelect}
              catStates={filteredStates}
            /> 
          ) : (
            <Typography variant="caption" color="text.secondary">
              Please select a country first.
            </Typography>
          )
        }

        {
          formCreatePlace.stateid ? (
            <CitiesSelect 
              val={formCreatePlace.cityid}
              onChangecall={handleSelect}
              catCities={filteredCities}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Please select a state first.
            </Typography>
          )
        }
                
        <Typography variant="h6" component="h6" 
          gutterBottom align="left">
          Location Coordinates
        </Typography>

        <LocationPicker
          latitude={formCreatePlace.latitude}
          longitude={formCreatePlace.longitude}
          onLocationChange={(lat, lng) => {
            setformCreatePlace(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }));
          }}
        />

        <Typography variant="h6" component="h6" 
          gutterBottom align="left" sx={{ mt: 3 }}>
          Images
        </Typography>

        <ImageUploader
          images={addedImages}
          onImagesChange={setAddedImages}
          maxImages={5}
        />

        <Typography variant="h6" component="h6" 
          gutterBottom align="left" sx={{ mt: 3 }}>
          Facilities
        </Typography>

        <FormGroup>
          {
            catFacilities?.map((opt)=>(
              <FormControlLabel
                key={opt.id}
                label={opt.name}
                control={
                  <Checkbox 
                    name={opt.id}  
                    checked={checkedFacilities[opt.id] || false} 
                    onChange={facilitiesChange} 
                  />
                } 
              />
            )
          )
          }

        </FormGroup>
        
        <SnackbarNotification
          open={submitSuccess}
          onClose={handleSnackbarClose}
          message={messageSnack || "Place created successfully!"}
          severity="success"
        />
        
        <SnackbarNotification
          open={!!submitError}
          onClose={() => setSubmitError('')}
          message={submitError}
          severity="error"
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
          fullWidth
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Creating Place...' : 'Create Place'}
        </Button>
      </Box>
    </>
  );
};

export default CreatePlace;