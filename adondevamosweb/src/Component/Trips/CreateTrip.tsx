import { useState, useEffect } from 'react';
import {
        Button,
        Typography,
        Box,
        useMediaQuery,
  useTheme
} from '@mui/material';

import ManageItinerary from './Itinerary/ManageItinerary';
import ManageMemberList from './MembersList/ManageMemberList';
import SnackbarNotification from '../Commons/SnackbarNotification';
import FormTrips from './FormTrips';
import TripGallerySection from './TripGallerySection';
import { FlightTakeoff } from '@mui/icons-material';
import useTripMutationApi from '../../hooks/Trips/useTripMutationApi';
import useTripDetailsApi from '../../hooks/Trips/useTripDetailsApi';
import useGalleryUpload from '../../hooks/useGalleryUpload';
import { useNavigate } from 'react-router-dom';
import {
  buildGalleryUploadPayload,
  buildItineraryPayload,
  buildMembersPayload,
  validateTripInfo
} from './tripGallery.utils';

function CreateTrip( ) {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const navigate = useNavigate();
    const { createTrip } = useTripMutationApi();
    const { saveItinerary, saveGallery, saveMembers } = useTripDetailsApi();
    const { uploadImages, isUploading } = useGalleryUpload();

    //Set error list to handle error messages
    const [errors, setErrors] = useState({
      duplicatedplace : false,
      duplicateduser : false,
      nameempty : false
    });
    
    //Show managers of sections
    const [showManager, setShowManager] = useState({
      itinerary : false,
      memberlist : false
    });

    //Form info
    const [formTrip, setFormTrip] = useState(
      {
        name : '',
        description : '',
        initialdate : '',
        finaldate : '',
        owner:{
          id : null,
          tag : ''
        },
        itinerary:[],
        memberlist:[],
        gallery:[]
      }
    );

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [coverImageIndex, setCoverImageIndex] = useState(null);

    //Message snack text
    const [messageSnack, setMessageStack] = useState('');
    
    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormTrip(prev => ({
        ...prev,
        [name]: value
        }));
        if (name === 'initialdate') {
          setFormTrip(prev => ({
            ...prev,
            finaldate: value
          }));
        }
    };

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false); 

    try {
      validateTripInfo(formTrip);

      const rq = {
        name : formTrip.name.trim(),
        description : formTrip.description.trim(),
        initialdate : formTrip.initialdate,
        finaldate : formTrip.finaldate
      };

      // API call to create trip
      const response = await createTrip(rq);

      if(response.status == 201) {
        //created trip id
        const tripId = response.data.info.id;
        //Show message of saved countries
        setMessageStack("Trip was saved.");

        // Handle success
        setSubmitSuccess(true);

        //Save member list
        if  ( formTrip.memberlist.length > 0 ) {
          await saveMemberlist({ id: tripId });
        }

        //Save itinerary
        if ( formTrip.itinerary.length > 0 ) {
          await saveTripItinerary({ id: tripId });
        }

        if (formTrip.gallery.length > 0) {
          await saveTripGallery({ id: tripId });
        }
        // Navigate to the new place after a short delay
          setTimeout(() => {
            navigate('/View/Trip/' + tripId);
          }, 2000);
      }       
    } catch (error) {
      setMessageStack(`Error creating trip: ${error.message}`);
      
      console.error('Error creating trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

    //saveMemberlist
    const saveMemberlist = async( item ) => {
      const id = item.id;
      const rq = buildMembersPayload(formTrip.memberlist);

      try {
        await saveMembers(id, rq, 'post');
        setFormTrip(
          prev => (
            {
            ...prev,
              memberlist : []
            }
          ) 
        );
        setMessageStack("Members were saved");
      } catch (error) {
        console.error("Error saving member list", error);
      }
    };

    //save itinerary
    const saveTripItinerary = async( item ) =>{
      const id = item.id;
      const rq = buildItineraryPayload(formTrip.itinerary, true);
      try {
        await saveItinerary(id, rq, 'post');
        setMessageStack("Itinerary was saved.");
        setFormTrip(
          prev => (
            {
            ...prev,
              itinerary : []
            }
          ) 
        );
      } catch (error) {
        console.error("Error saving itinerary", error);
      }
    };

    const saveTripGallery = async (item) => {
      const id = item.id;
      const batchSize = 3;
      const images = formTrip.gallery;

      try {
        // Upload images in batches of 3
        for (let i = 0; i < images.length; i += batchSize) {
          const batch = images.slice(i, i + batchSize);
          
          // Calculate the cover index relative to this batch
          const batchStartIndex = i;
          const batchCoverIndex = coverImageIndex !== null && 
                                   coverImageIndex >= batchStartIndex && 
                                   coverImageIndex < batchStartIndex + batchSize
            ? coverImageIndex - batchStartIndex
            : null;
          
          await uploadImages({
            images: batch,
            context: {},
            coverImageIndex: batchCoverIndex,
            buildPayload: (normalizedImages, uploadContext, coverIdx) => ({
              ...buildGalleryUploadPayload(batch, normalizedImages, coverIdx)
            }),
            uploadRequest: (payload) => saveGallery(id, payload)
          });
          
          setMessageStack(`Uploaded ${Math.min(i + batchSize, images.length)} of ${images.length} images...`);
        }
        
        setMessageStack("Gallery was saved.");
      } catch (error) {
        console.error("Error saving gallery", error);
      }
    };

  const handlePlaceAdd = (item) => {
    //Search if exist in itinerary
    const foundInList = formTrip.itinerary.filter( x => x.place.id == item.place.id );
    
    //if not found, add to itinerary
    if ( foundInList.length == 0 ){
        setFormTrip( 
          prev => (
            { ...prev, 
                itinerary : [...prev.itinerary, item] 
            }
          )
        );

        setShowManager( prev => ( { ...prev, itinerary : false } ) );
    } else {
        setErrors(prev => (
          {
            ...prev,
            duplicatedplace : true
          }
        )
      );
    }
        
  };

  const handleRemove = (event) => {
    //Item exist in list
    const foundInList = formTrip.itinerary.filter( x => x.place.id == event);
    // if found, filter list and set to form itinerary
    if ( foundInList.length == 1 ){
        const filteredList = formTrip.itinerary.filter(item => item.place.id !== event )
        setFormTrip( prev => ({...prev, itinerary : filteredList } ));
    } 
  }

  const handleDateUpdate = (placeId, initialdate, finaldate) => {
    setFormTrip(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(item => 
        item.place.id === placeId 
          ? { ...item, initialdate, finaldate }
          : item
      )
    }));
  };

  const handleUserAdd = (item) => {
    const foundInList = formTrip.memberlist.filter( x => x.id == item.id );

    if ( foundInList.length == 0 ){
        setFormTrip(
          prev => (
            { ...prev, 
                memberlist : [...prev.memberlist, item] 
            }
          )
        );
        setErrors(prev => ({ ...prev, duplicateduser : false }));
    } else {
        setErrors(prev => (
          {
            ...prev,
            duplicateduser : true
          }
        )
      );
    }
  };

  const handleRemoveUser = (event) => {
    //Item exist in list
    const foundInList = formTrip.memberlist.filter( x => x.id == event);

    if ( foundInList.length == 1 ){
        const filteredList = formTrip.memberlist.filter(item => item.id !== event );
        setFormTrip(prev => ({ ...prev, memberlist: filteredList }));
    } 
  };

  const resetMembers = () => {
    setFormTrip(prev => ({ ...prev, memberlist: [] }));
    setErrors(prev => ({ ...prev, duplicateduser: false }));
  };

  const showSearch = (item) => {
    if ( item == 1 ) {
      setShowManager( prev => ( { ...prev, itinerary : true } ) );
    } else {
      setShowManager( prev => ( { ...prev, memberlist : true } ) );
    }
  };
  
  const clearItinerary = () => {
    setFormTrip(
          prev => (
            { ...prev, 
                itinerary : []
            }
          )
        );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSubmitSuccess(false);
  };

  useEffect(() => {
      setFormTrip(
        prev => ( 
            { ...prev, 
              owner : { 
                id : localStorage.getItem('userid'), 
                tag : localStorage.getItem('tag') } 
              } 
            )
          );
        if(submitSuccess){
          const timer = setTimeout(() => {
            setSubmitSuccess(false);
          }, 3000);
          return () => clearTimeout(timer);
        }
  }, [ submitSuccess ] );
    return (
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
        <Typography 
            variant={isSmUp ? "h3" : "h4"} 
            align="center"
            sx={{
                fontFamily: "'Press Start 2P', cursive",
                color: '#2c3e50',
                fontSize: isSmUp ? '1.5rem' : '1.2rem',
                lineHeight: 1.6,
                mb: 1
            }}
        >
            Create Trip
        </Typography>

        <Typography variant="body1"  align="left">
          About your trip
        </Typography>

        <FormTrips formTrip={formTrip} 
        handleChange={handleChange} />

        <ManageItinerary
          itinerary={formTrip.itinerary}
          onPlaceAdd={handlePlaceAdd}
          onPlaceRemove={handleRemove}
          onClearItinerary={clearItinerary}
          onDateUpdate={handleDateUpdate}
        />  

        <ManageMemberList
          memberlist={formTrip.memberlist}
          onAddMember={handleUserAdd}
          onRemoveMember={handleRemoveUser}
          onResetMembers={resetMembers}
          showDuplicateError={errors.duplicateduser}
        />

        <TripGallerySection
          items={[]}
          onRemove={() => {}}
          pendingImages={formTrip.gallery}
          onPendingImagesChange={(images) => setFormTrip(prev => ({ ...prev, gallery: images }))}
          itinerary={formTrip.itinerary}
          showUploader
          enableImageMetadata
          maxPendingImages={10}
          coverImageIndex={coverImageIndex}
          onSetCover={(index, autoSet) => {
            setCoverImageIndex(index);
            if (!autoSet) {
              console.log('Cover image set to index:', index);
            }
          }}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting || isUploading}
          variant="text"
          startIcon={<FlightTakeoff />}
          >
          Create Trip
        </Button>

        <SnackbarNotification 
          open={submitSuccess}
          onClose={handleSnackbarClose}
          message={messageSnack}
          severity="success"
        />
      </Box>
  );
}

export default CreateTrip;
