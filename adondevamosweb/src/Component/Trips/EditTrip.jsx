import { useState, useEffect } from 'react';
import 
    { 
        Button,
        Typography,
        Box,
        CircularProgress,
        useMediaQuery,
        useTheme,
        Collapse,
        IconButton,
        Skeleton
} from '@mui/material';

import { Save, ExpandMore, ExpandLess
} from '@mui/icons-material'
import MemberSearch from './MembersList/MemberSearch';
import ManageItinerary from './Itinerary/ManageItinerary';
import MemberList from './MembersList/MemberList';
import ManageMemberList from './MembersList/ManageMemberList';
import SnackbarNotification from '../Commons/SnackbarNotification';
import { useNavigate, useParams } from 'react-router-dom';
import FormTrips from './FormTrips';
import { useAuth } from "../../context/AuthContext";
import GalleryListManager from '../Commons/GalleryListManager';
import useTripMutationApi from '../../hooks/Trips/useTripMutationApi';
import useTripDetailsApi from '../../hooks/Trips/useTripDetailsApi';
import useGalleryUpload from '../../hooks/useGalleryUpload';

function EditTrip(){
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { loading } = useAuth();
  const { uploadImages, isUploading } = useGalleryUpload();
    const [isUser, setIsUser] = useState(false);
    const [isFetchingTrip, setIsFetchingTrip] = useState(true);
    const navigate = useNavigate();
  const { getTrip, updateTrip } = useTripMutationApi();
  const { saveItinerary, saveGallery, removeGalleryImage, saveMembers } = useTripDetailsApi();

    //Trip id
    const { id } = useParams();
    
    const [errors, setErrors] = useState({
      duplicatedplace : false,
      duplicateduser : false,
      tripinfo : false
    });

    //Show managers of sections
    const [showManager, setShowManager] = useState({
      itinerary : false,
      memberlist : false,
      gallery: false
    });

    //addedImages
    const [addedImages, setAddedImages] = useState([]);

    // trip info
    const [formTrip, setFormTrip] = useState({
        name : '',
        description : '',
        initialdate : '',
        finaldate : '',
        owner:{
          id : null,
          tag : ''
        },
        itinerary:[],
        members:[]
    });

    //copy of original trip info for comparison
    const [originalTrip, setOriginalTrip] = useState(null);
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormTrip(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

      // Validate for field initialDate
      if (formTrip.initialdate === "") {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (formTrip.finaldate === "") {
        throw new Error('set final date');
      }
      
      // API call to create trip
      const response = await updateTrip(id, {
        name : formTrip.name.trim(),
        description : formTrip.description,
        initialdate : formTrip.initialdate,
        finaldate : formTrip.finaldate,
      });

      if(response.status == 201 
        || response.status == 200){
        setMessageSnack("Trip info was updated.");
      } 

      if (
        originalTrip &&
        JSON.stringify(originalTrip.itinerary) !== JSON.stringify(formTrip.itinerary)
      ) {
        setMessageSnack("Saving itinerary...");
        await saveTripItinerary();
      }

      if (
        originalTrip &&
        JSON.stringify(originalTrip.members) !== JSON.stringify(formTrip.members)
      ) {
        setMessageSnack("Saving member list...");
        await saveMemberlist();
      }

      if (addedImages.length > 0) {
        await uploadImages({
          images: addedImages,
          buildPayload: (normalizedImages) => ({
            images: normalizedImages.map((image) => ({
              data: image.data,
              mimetype: image.mimetype,
              extension: image.extension
            }))
          }),
          uploadRequest: (payload) => saveGallery(id, payload)
        });
        setMessageSnack("Photos were added to gallery.");
      }

      // Handle success
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/View/Trip/' + id );
      }, 3000);
    
    } catch (error) {
      setMessageSnack(`Error updating trip: ${error.message}`);
      console.error('Error updating trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  

    //saveMemberlist
    const saveMemberlist = async( ) =>{
        const lst = formTrip.members.map(member => ({
          userid : member.user.id,
          hide : false
        }));

        const rq = {
          "Members" : lst
        };
        try {
          await saveMembers(id, rq, 'put');
          setMessageSnack("Member list was saved.");
        } catch (error) {
          console.error("Error saving member list", error);
        }
    };

    //save itinerary
    const saveTripItinerary = async( ) =>{
        const lst = formTrip.itinerary.map(itinerary => ({
          "placeid" : itinerary.place.id ,
          "initialdate" : itinerary.initialdate,
          "finaldate" : itinerary.finaldate
        }));

        const rq = {
          "Itinerary" : lst
        };

        try {
          await saveItinerary(id, rq, 'put');
          setMessageSnack("Itinerary was saved.");
        } catch (error) {
          console.error("Error saving itinerary", error);
        }
    };

  const handlePlaceAdd = (item) => {
    //Search if exist in itinerary
    const foundInList = formTrip.itinerary.filter( x => x.place.id == item.place.id );
    
    //if not found, add to itinerary
    if ( foundInList.length == 0 ){
        setFormTrip(
            prev => (
              {
              ...prev,
                itinerary :[...prev.itinerary, item]
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

  const removePhoto = async (item) => {
    try {
      const response = await removeGalleryImage(id, item.id);
      if (response.status === 200 || response.status === 204) {
        setMessageSnack("Photo was removed from gallery.");
        // Update originalPlace state to reflect removal
        setOriginalTrip(prev => ({
          ...prev,
          gallery: prev.gallery.filter(img => img.id !== item.id)
        }));
      }
    } catch (error) {
      setMessageSnack(`Error removing photo: ${error.message}`);
      console.error('Error removing photo from gallery:', error);
    }
  };

  const handleUserAdd = (item) => {
    const foundInList = formTrip.members.filter( x => x.user.id == item.id );
    const memberToInsert = {
      user : {
        id : item.id,
        tag : item.tag,  
        name : item.name,
        email : item.email
      },
      hide : false
    };
    if ( foundInList.length == 0 ){
        setFormTrip(
          prev => (
            { ...prev, 
                members : [...prev.members, memberToInsert] 
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
    const foundInList = formTrip.members.filter( x => x.user.id == event);

    if ( foundInList.length == 1 ){
        const filteredList = formTrip.members.filter(item => item.user.id !== event );
        setFormTrip(prev => ({ ...prev, members: filteredList }));
    } 
  };

  const resetMembers = () => {
    setFormTrip(prev => ({ ...prev, members: [] }));
    setErrors(prev => ({ ...prev, duplicateduser: false }));
  };

  const toggleSection = (section) => {
    setShowManager(prev => ({ 
      ...prev, 
      [section]: !prev[section] 
    }));
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

  useEffect(()=> {
      const fetchTrip = async () => {
          if ( !id ) return;
          setIsFetchingTrip(true);
          try {
            const response = await getTrip(id);
            setFormTrip(response.data.info);
            setOriginalTrip(response.data.info);
        } catch (err) {
          console.error("Error getting trip info", err);
          setErrors(prev => (
              {
                ...prev,
                tripinfo : true
              }
            )
          );

        } finally {
          setIsFetchingTrip(false);
        } 
      }
      fetchTrip();
      setIsUser( localStorage.getItem('userid') != null );
  },[id]);
    if ( loading ) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
          </Box>
        );
    }

    if (isFetchingTrip) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            px: 2
          }}
        >
          {/* Title Skeleton */}
          <Skeleton 
            variant="text" 
            width="60%" 
            height={isSmUp ? 60 : 50}
            sx={{ mx: 'auto' }}
          />

          {/* Section Header Skeleton */}
          <Skeleton variant="text" width="30%" height={30} />

          {/* Form Fields Skeletons */}
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={120} />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: isSmUp ? 'row' : 'column' }}>
            <Skeleton variant="rounded" width={isSmUp ? '50%' : '100%'} height={56} />
            <Skeleton variant="rounded" width={isSmUp ? '50%' : '100%'} height={56} />
          </Box>

          {/* Itinerary Section Skeleton */}
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="rounded" width="100%" height={100} sx={{ mt: 1 }} />
          </Box>

          {/* Members Section Skeleton */}
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="rounded" width="100%" height={100} sx={{ mt: 1 }} />
          </Box>

          {/* Gallery Section Skeleton */}
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="rounded" width="100%" height={150} sx={{ mt: 1 }} />
          </Box>

          {/* Submit Button Skeleton */}
          <Skeleton variant="rounded" width={isSmUp ? '20%' : '100%'} height={40} sx={{ mt: 2 }} />
        </Box>
      );
    }

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
            Edit Trip 
          </Typography>
          
          <Typography variant="body1"  align="left">
            About your trip
          </Typography>

          <FormTrips 
            formTrip={formTrip}
            handleChange={handleChange} />
          
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => toggleSection('itinerary')}
            >
              <Typography variant="body1">
                Manage Itinerary {formTrip.itinerary && formTrip.itinerary.length > 0 && `(${formTrip.itinerary.length})`}
              </Typography>
              <IconButton size="small">
                {showManager.itinerary ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={showManager.itinerary}>
              <Box sx={{ mt: 2 }}>
                <ManageItinerary
                  itinerary={formTrip.itinerary}
                  onPlaceAdd={handlePlaceAdd}
                  onPlaceRemove={handleRemove}
                  onClearItinerary={clearItinerary}
                  onDateUpdate={handleDateUpdate}
                />
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => toggleSection('memberlist')}
            >
              <Typography variant="body1">
                Manage Members {formTrip.members && formTrip.members.length > 0 && `(${formTrip.members.length})`}
              </Typography>
              <IconButton size="small">
                {showManager.memberlist ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={showManager.memberlist}>
              <Box sx={{ mt: 2 }}>
                <ManageMemberList
                  memberlist={formTrip.members}
                  onAddMember={handleUserAdd}
                  onRemoveMember={handleRemoveUser}
                  onResetMembers={resetMembers}
                  showDuplicateError={errors.duplicateduser}
                />
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => toggleSection('gallery')}
            >
              <Typography variant="body1">
                Manage Gallery {originalTrip && originalTrip.gallery && originalTrip.gallery.length > 0 && `(${originalTrip.gallery.length})`}
              </Typography>
              <IconButton size="small">
                {showManager.gallery ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={showManager.gallery}>
              <Box sx={{ mt: 2 }}>
                <GalleryListManager
                  items={originalTrip && originalTrip.gallery ? originalTrip.gallery : []}
                  onRemove={removePhoto}
                  pendingImages={addedImages || []}
                  onPendingImagesChange={setAddedImages}
                  showUploader
                  maxPendingImages={10}
                />
              </Box>
            </Collapse>
          </Box>

          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            variant="text"
            startIcon={<Save/>}
            sx={{ mt: 2 }}
          >
            Save changes
          </Button>


          <SnackbarNotification
            open={submitSuccess}
            onClose={handleSnackbarClose}
            message={messageSnack}
            severity="success"
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />

      </Box>
    );
}

export default EditTrip;
