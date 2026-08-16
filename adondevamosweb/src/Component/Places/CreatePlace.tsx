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
        CircularProgress
} from '@mui/material';

import { Save } from '@mui/icons-material';
import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";
import SnackbarNotification from "../Commons/SnackbarNotification";
import GalleryListManager from '../Commons/GalleryListManager';
import LocationPicker from '../Commons/LocationPicker';
import FacilityIcon from '../Commons/FacilityIcon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import useGalleryUpload from '../../hooks/useGalleryUpload';
import usePlaceMutationApi from '../../hooks/Places/usePlaceMutationApi';
import usePlaceDetailsApi from '../../hooks/Places/usePlaceDetailsApi';

function CreatePlace({
  catCountries,
    catStates,
    catCities,
    catFacilities
}) {
  const { isLogged, loading: authLoading, hasPermission } = useAuth();
  const { uploadImages, isUploading } = useGalleryUpload();
  const { createPlace } = usePlaceMutationApi();
    const { saveFacilities, saveGalleryImages } = usePlaceDetailsApi();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  
  //filtered data
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  
  // Added images
  const [addedImages, setAddedImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(null);

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
      
      // API call to create place
      const response = await createPlace({
        name: formCreatePlace.name.trim(),
        countryid: formCreatePlace.countryid,
        stateid: formCreatePlace.stateid,
        cityid: formCreatePlace.cityid,
        description: formCreatePlace.description,
        address: formCreatePlace.address,
        ispublic: formCreatePlace.ispublic,
        latitude: formCreatePlace.latitude,
        longitude: formCreatePlace.longitude
      });
      if (response.status === 200 || response.status === 201) {
        setMessageSnack("Place was created successfully!");
        setSubmitSuccess(true);
        
        const placeId = response.data.info?.id;
        console.log("Created place ID:", placeId);
        console.log("Added images count:", addedImages.length);

        // Save facilities
        if (placeId) {
          await saveSelectedFacilities(placeId);
          
          // Upload images if added
          if (addedImages.length > 0) {
            try {
              console.log("Starting image upload for", addedImages.length, "images");
              const uploadResult = await uploadImages({
                images: addedImages,
                context: { placeId },
                coverImageIndex: coverImageIndex,
                buildPayload: (normalizedImages, uploadContext, coverIdx) => ({
                  images: normalizedImages.map((image, index) => ({
                    name: `place_${uploadContext.placeId}_${Date.now()}_${index}`,
                    data: image.data,
                    mimetype: image.mimetype,
                    extension: image.extension,
                    iscover: coverIdx !== null && index === coverIdx
                  }))
                }),
                uploadRequest: (payload) => saveGalleryImages(placeId, payload)
              });
              
              console.log("Upload result:", uploadResult);
              
              if (uploadResult?.uploaded) {
                setMessageSnack(`Place created! ${uploadResult.count} photo(s) uploaded successfully!`);
              } else {
                setMessageSnack("Place created but no photos were uploaded.");
              }
            } catch (uploadError) {
              console.error("Error uploading images:", uploadError);
              console.error("Upload error details:", uploadError.response?.data);
              setMessageSnack("Place created but image upload failed: " + (uploadError.response?.data?.message || uploadError.message));
            }
          } else {
            setMessageSnack("Place created successfully!");
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

    try {
      await saveFacilities(placeId, formSaveFacilities, 'post');
      setMessageSnack("Facilities were saved successfully.");
    } catch (error) {
      console.error("Error saving facilities", error);
      setMessageSnack("Error saving facilities.");
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
          multiline
          minRows={3}
          placeholder="About this place"
          align="left"
          onChange={handleChange}
          value={formCreatePlace.description}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="ispublic"
              checked={formCreatePlace.ispublic}
              onChange={(e) => setformCreatePlace(prev => ({
                ...prev,
                ispublic: e.target.checked
              }))}
            />
          }
          label="Is a Public place?"
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
          onChange={(lat, lng) => {
            setformCreatePlace(prev => ({
              ...prev,
              latitude: Number(lat),
              longitude: Number(lng)
            }));
          }}
        />

        <GalleryListManager
          items={[]}
          pendingImages={addedImages}
          onPendingImagesChange={setAddedImages}
          showUploader
          maxPendingImages={5}
          coverImageIndex={coverImageIndex}
          onSetCover={(index, autoSet) => {
            setCoverImageIndex(index);
            if (!autoSet) {
              console.log('Cover image set to index:', index);
            }
          }}
        />

        <Typography variant="h6" component="h6" 
          gutterBottom align="left" sx={{ mt: 3 }}>
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
          disabled={isSubmitting || isUploading}
          variant="contained"
          startIcon={(isSubmitting || isUploading) ? <CircularProgress size={20} /> : <Save />}
          fullWidth
          sx={{ mt: 3 }}
        >
          {(isSubmitting || isUploading) ? 'Creating Place...' : 'Create Place'}
        </Button>
      </Box>
    </>
  );
};

export default CreatePlace;