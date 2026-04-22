import { useState, useEffect } from 'react';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Typography,
        Box,
        FormControlLabel,
        Checkbox,
        CircularProgress,
        Skeleton
} from '@mui/material';

import { Save } from '@mui/icons-material';
import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";
import SnackbarNotification from "../Commons/SnackbarNotification";
import LocationPicker from '../Commons/LocationPicker';
import FacilityIcon from '../Commons/FacilityIcon';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import GalleryListManager from '../Commons/GalleryListManager';
import useGalleryUpload from '../../hooks/useGalleryUpload';
import usePlaceMutationApi from '../../hooks/Places/usePlaceMutationApi';
import usePlaceDetailsApi from '../../hooks/Places/usePlaceDetailsApi';

function EditPlace({
    catCountries,
    catStates,
    catCities,
    catFacilities
}) {
  const { loading } = useAuth();
  const { uploadImages, isUploading } = useGalleryUpload();
  const { updatePlace } = usePlaceMutationApi();
  const { getPlace, saveFacilities, saveGalleryImages, removeGalleryImage } = usePlaceDetailsApi();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Place id
  const { id } = useParams();

  //filtered data
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [errors, setErrors] = useState({
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
  const [isLoadingPlace, setIsLoadingPlace] = useState(true);
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
      const response = await updatePlace(id, {
        name: formEditPlace.name.trim(),
        countryid: formEditPlace.countryid,
        stateid: formEditPlace.stateid,
        cityid: formEditPlace.cityid,
        description: formEditPlace.description,
        address: formEditPlace.address,
        ispublic: formEditPlace.ispublic,
        latitude: formEditPlace.latitude,
        longitude: formEditPlace.longitude
      });

      if (response.status === 200 || response.status === 201) {
        setMessageSnack("Place info was updated.");
      }

      if (JSON.stringify(originalPlace?.facilities) !== JSON.stringify(checkedFacilities)) {
        await saveSelectedFacilities();
      }

      if (addedImages.length > 0) {
        await uploadImages({
          images: addedImages,
          uploadRequest: (payload) => saveGalleryImages(id, payload),
          buildPayload: (normalizedImages) => ({
            images: normalizedImages.map((image) => ({
              data: image.data,
              mimetype: image.mimetype,
              extension: image.extension
            }))
          })
        });
        setMessageSnack("Photos were added to gallery.");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/View/Place/' + id);
      }, 3000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      setMessageSnack(`Error updating place: ${error.message}`);
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
    
    const formSaveFacilities = {  
      Facilities: checkedFacilitiesToSave
    };

    try {
      await saveFacilities(id, formSaveFacilities, 'put');
      setMessageSnack("Facilities were updated.");
    } catch (error) {
      console.error("Error updating facilities");
      setMessageSnack("Error updating facilities.");
      throw error;
    }
  };

  const removePhoto = async (item) => {
    try {
      const response = await removeGalleryImage(id, item.id);
      if (response.status === 200 || response.status === 204) {
        setMessageSnack("Photo was removed from gallery.");
        // Update originalPlace state to reflect removal
        setOriginalPlace(prev => ({
          ...prev,
          gallery: prev.gallery.filter(img => img.id !== item.id)
        }));
      }
    } catch (error) {
      setMessageSnack(`Error removing photo: ${error.message}`);
      console.error('Error removing photo from gallery:', error);
    }
  };

  // Fetch place data
  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      setIsLoadingPlace(true);
      try {
        const response = await getPlace(id);
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
      } finally {
        setIsLoadingPlace(false);
      }
    };
    
    fetchPlace();
  }, [id, getPlace]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isLoadingPlace) {
    return (
      <>
        <Skeleton variant="text" width="40%" height={50} sx={{ mx: 'auto', mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={100} />
          
          <Skeleton variant="text" width="30%" height={40} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          
          <Skeleton variant="text" width="30%" height={40} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={200} />
          
          <Skeleton variant="text" width="30%" height={40} sx={{ mt: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="rectangular" width={100} height={40} />
            ))}
          </Box>
          
          <Skeleton variant="text" width="30%" height={40} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={150} />
          
          <Skeleton variant="rectangular" width={150} height={50} sx={{ mt: 2 }} />
        </Box>
      </>
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
          multiline
          minRows={3}
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

        <Typography variant="h6" 
        component="h6" 
        gutterBottom align="left">
          Map Location
        </Typography>

        <LocationPicker
          latitude={formEditPlace.latitude}
          longitude={formEditPlace.longitude}
          onChange={(lat, lng) => {
            setFormEditPlace(prev => ({
              ...prev,
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
            }));
          }}
          zoom={13}
          height={400}
        />
                
        <Typography variant="h6" component="h6" gutterBottom align="left">
          Facilities
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))'
            },
            gap: 1.5
          }}
        >
          {
            catFacilities?.map((opt) => (
              <FormControlLabel
                key={opt.id}
                sx={{
                  m: 0,
                  p: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: checkedFacilities[opt.id] ? 'action.selected' : 'background.paper',
                  alignItems: 'flex-start'
                }}
                control={
                  <Checkbox
                    name={opt.id}
                    checked={checkedFacilities[opt.id] || false}
                    onChange={facilitiesChange}
                    size="small"
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      minHeight: 74,
                      minWidth: 72,
                      textAlign: 'center'
                    }}
                  >
                    <FacilityIcon code={opt.code} fontSize="small" />
                    <Typography variant="caption">{opt.name}</Typography>
                  </Box>
                }
              />
            ))
          }
        </Box>

        <GalleryListManager 
          items={originalPlace?.gallery || []} 
          onRemove={removePhoto}
          pendingImages={addedImages || []}
          onPendingImagesChange={setAddedImages}
          showUploader
          maxPendingImages={10}
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
          disabled={isSubmitting || isUploading}
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
