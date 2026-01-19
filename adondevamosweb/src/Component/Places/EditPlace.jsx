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
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

function EditPlace({
    catCountries,
    catStates,
    catCities,
    catFacilities
}) {
  const { isLogged, loading } = useAuth();
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Place id
  const { id } = useParams();

  //filtered data
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  //urls
    const URLsCatalogService =
    {
        Places :`${config.api.baseUrl}${config.api.endpoints.Places}`
    };

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

  // Added images
  const [addedImages, setAddedImages] = useState([]);

  const facilitiesChange = (event) => {
    setCheckedFacilities({
      ...checkedFacilities,
      [event.target.name]: event.target.checked,
    });
  };

  // Place info
  const [formEditPlace, setFormEditPlace] = useState({
    name: '',
    countryid: '',
    stateid: '',
    cityid: '',
    description: '',
    address: '',
    ispublic: false,
    latitude: 24.8091,
    longitude: -107.3940
  });

  // Copy of original place info for comparison
  const [originalPlace, setOriginalPlace] = useState(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');

  // Update request
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEditPlace(prev => ({
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
      if (!formEditPlace.name.trim()) {
        throw new Error('Place name is required');
      }

      // Validate for field Description
      if (!formEditPlace.description.trim()) {
        throw new Error('Place description is required');
      }

      // Validate for field Address
      if (!formEditPlace.address.trim()) {
        throw new Error('Place address is required');
      }

      // Validate for field Country
      if (!formEditPlace.countryid) {
        throw new Error('CountryID is required');
      }

      // Validate for field State
      if (!formEditPlace.stateid) {
        throw new Error('StateID is required');
      }

      // Validate for field City
      if (!formEditPlace.cityid) {
        throw new Error('cityID is required');
      }

      // API call to update place
      const response = await axios.put(
        URLsCatalogService.Places + '/' + id, 
        {
          name: formEditPlace.name.trim(),
          countryid: formEditPlace.countryid,
          stateid: formEditPlace.stateid,
          cityid: formEditPlace.cityid,
          description: formEditPlace.description,
          address: formEditPlace.address,
          ispublic: formEditPlace.ispublic,
          latitude: formEditPlace.latitude,
          longitude: formEditPlace.longitude
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessageSnack("Place info was updated.");
        setSubmitSuccess(true);
      }

    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      setMessageSnack(`Error updating place: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      
      // Save facilities if changed
      if (JSON.stringify(originalPlace?.facilities) !== JSON.stringify(checkedFacilities)) {
        saveSelectedFacilities();
      }
      
      // Upload images if added
      if (addedImages.length > 0) {
        addPhotosToGallery();
      }
      
      setTimeout(() => {
        navigate('/View/Place/' + id);
      }, 3000);
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
        setFormEditPlace(prev => ({
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

        setFormEditPlace(prev => ({
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
  };
    

  // Save selected facilities
  const saveSelectedFacilities = async() => {
    const checkedFacilitiesToSave = Object.keys(checkedFacilities).map(key => ({
      facilityid: Number(key),
      value: checkedFacilities[key]
    }));
    console.log("Facilities to save:", checkedFacilitiesToSave);
    const formSaveFacilities = {  
      Facilities: checkedFacilitiesToSave
    };

    const url = URLsCatalogService.Places + '/' + id + '/Facilities';
    
    axios.put(url, formSaveFacilities)
      .then(resp => {
        setMessageSnack("Facilities were updated.");
      })
      .catch(error => {
        console.error("Error updating facilities");
        setMessageSnack("Error updating facilities.");
      });
  };

  // Add photos to gallery
  const addPhotosToGallery = async () => {
    // Convert images to base64
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

          // If photo has a file property (ImageUploader format: {file: File, preview: string, name: string})
          if (photo.file && photo.file instanceof File) {
            base64Data = await convertToBase64(photo.file);
            mimetype = photo.file.type || "image/jpeg";
            extension = photo.name ? photo.name.split('.').pop() : "jpg";
          }
          // If it's a File object directly
          else if (photo instanceof File) {
            base64Data = await convertToBase64(photo);
            mimetype = photo.type || "image/jpeg";
            extension = photo.name ? photo.name.split('.').pop() : "jpg";
          }
          // If it's a Blob
          else if (photo instanceof Blob) {
            base64Data = await convertToBase64(photo);
            mimetype = photo.type || "image/jpeg";
            extension = "jpg";
          }
          // If photo is already a data URL (base64)
          else if (typeof photo === 'string' && photo.startsWith('data:')) {
            base64Data = photo;
            mimetype = photo.substring(photo.indexOf(':') + 1, photo.indexOf(';'));
            extension = mimetype.split('/')[1];
          }
          // If photo has a data property that's already base64
          else if (photo.data && typeof photo.data === 'string' && photo.data.startsWith('data:')) {
            base64Data = photo.data;
            mimetype = photo.mimetype || photo.data.substring(photo.data.indexOf(':') + 1, photo.data.indexOf(';'));
            extension = photo.extension || mimetype.split('/')[1];
          }
          // Default fallback
          else {
            console.warn("Unknown image format:", photo);
            base64Data = photo.data || photo;
            mimetype = photo.mimetype || "image/jpeg";
            extension = photo.extension || "jpg";
          }

          return {
            data: base64Data,
            mimetype: mimetype,
            extension: extension
          };
        })
      );

      const rq = {
        "images": photos
      };
      
      const response = await axios.post(
        URLsCatalogService.Places + '/' + id + '/Images',
        rq,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        setMessageSnack("Photos were added to gallery.");
      }
    } catch (error) {
      setMessageSnack(`Error adding photos: ${error.message}`);
      console.error('Error adding photos to gallery:', error);
    }
  };

  // Fetch place data
  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      try {
        const response = await axios.get(URLsCatalogService.Places + '/' + id);
        const placeData = response.data.info;
        
        setFormEditPlace({
          name: placeData.name || '',
          countryid: placeData.Country.id || '',
          stateid: placeData.State.id || '',
          cityid: placeData.City.id || '',
          description: placeData.description || '',
          address: placeData.address || '',
          ispublic: placeData.ispublic || false,
          latitude: placeData.latitude || 24.8091,
          longitude: placeData.longitude || -107.3940
        });
        
        setOriginalPlace(placeData);
        
        // Load facilities
        if (placeData.facilities) {
          const facilitiesObj = {};
          catFacilities.forEach(facility => {
            facilitiesObj[facility.id] = 
            placeData.facilities.some(f => f.name === facility.name);
          });
          
          setCheckedFacilities(facilitiesObj);
        }

        // Set filtered states and cities based on place data
        setFilteredStates(
          catStates.filter(
            (state) => state.countryid === placeData.Country.id
          )
        );
        setFilteredCities(
          catCities.filter(
            (city) => city.stateid === placeData.State.id
          )
        );
        
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          place: true
        }));
        console.error("Error getting place info:", err);
      }
    };
    
    fetchPlace();
    setIsUser(localStorage.getItem('userid') != null);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Edit Place
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
        <Typography variant="h6" component="h6" gutterBottom align="left">
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
          value={formEditPlace.name}
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
          value={formEditPlace.description}
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
          value={formEditPlace.address}
        />
        
        <CountriesSelectList 
          val={formEditPlace.countryid} 
          onChangecall={handleSelect} 
          catCountries={catCountries} 
        />

        {
          formEditPlace.countryid != 0? (  
            <StateSelect 
              val={formEditPlace.stateid}
              onChangecall={handleSelect}
              catStates={filteredStates}
            />
          ) : <>Please, select a country.<br/></>
        }

        {
          formEditPlace.stateid != 0 ? (
            <CitiesSelect 
              val={formEditPlace.cityid}
              onChangecall={handleSelect}
              catCities={filteredCities}
            />
          ) : <>Please, select a state.<br/></>
        }

        <Typography variant="h6" component="h6" gutterBottom align="left">
          Map Location
        </Typography>

        <LocationPicker
          latitude={formEditPlace.latitude}
          longitude={formEditPlace.longitude}
          onChange={(lat, lng) => {
            setFormEditPlace(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }));
          }}
          zoom={13}
          height={400}
        />
                
        <Typography variant="h6" component="h6" gutterBottom align="left">
          Facilities
        </Typography>

        <FormGroup>
          {
            catFacilities?.map((opt) => (
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
            ))
          }
        </FormGroup>

        <Typography variant="h6" component="h6" gutterBottom align="left">
          Gallery
        </Typography>

        <ImageUploader
          images={addedImages || []}
          onChange={(newImages) => setAddedImages(newImages)}
          maxImages={10}
        />
        
        <SnackbarNotification
          open={!!submitError}
          onClose={() => setSubmitError('')}
          message={submitError}
          severity="error"
        />
        
        <SnackbarNotification
          open={submitSuccess}
          onClose={handleSnackbarClose}
          message={messageSnack}
          severity="success"
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="text"
          startIcon={<Save/>}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
}

export default EditPlace;
