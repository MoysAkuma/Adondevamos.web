import { useState, useEffect } from 'react';
import 
    { 
        Button,
        Typography,
        Box,
        CircularProgress
} from '@mui/material';

import { Save
} from '@mui/icons-material'
import MemberSearch from './MembersList/MemberSearch';
import ManageItinerary from './Itinerary/ManageItinerary';
import MemberList from './MembersList/MemberList';
import ManageMemberList from './MembersList/ManageMemberList';
import SnackbarNotification from '../Commons/SnackbarNotification';
import { useNavigate, useParams } from 'react-router-dom';
import FormTrips from './FormTrips';
import { useAuth } from "../../context/AuthContext";
import ImageUploader from '../Commons/ImageUploader';
import GalleryListManager from '../Commons/GalleryListManager';
import useTripMutationApi from '../../hooks/Trips/useTripMutationApi';
import useTripDetailsApi from '../../hooks/Trips/useTripDetailsApi';

function EditTrip(){
  const { loading } = useAuth();
    const [isUser, setIsUser] = useState(false);
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
      memberlist : false
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
        await addPhotosToGallery();
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
          "images" : photos
        };
        
        const response = await saveGallery(id, rq);
        
        if (response.status === 200 || response.status === 201) {
          setMessageSnack("Photos were added to gallery.");
        }
      } catch (error) {
        setMessageSnack(`Error adding photos: ${error.message}`);
        console.error('Error adding photos to gallery:', error);
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

  const showSearch = (item) => {
    if ( item == 1 ) {
      setShowManager( prev => ( { ...prev, itinerary : true } ) );
    } else {
      setShowManager( prev => ( { ...prev, members : true } ) );
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

  useEffect(()=> {
      const fetchTrip = async () => {
          if ( !id ) return;
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
          <Typography variant="h5" align="center">
            Edit Trip 
          </Typography>
          
          <Typography variant="body1"  align="left">
            About your trip
          </Typography>

          <FormTrips 
            formTrip={formTrip}
            handleChange={handleChange} />
          
          <ManageItinerary
            itinerary={formTrip.itinerary}
            onPlaceAdd={handlePlaceAdd}
            onPlaceRemove={handleRemove}
            onClearItinerary={clearItinerary}
          />

          <ManageMemberList
            memberlist={formTrip.members}
            onAddMember={handleUserAdd}
            onRemoveMember={handleRemoveUser}
            onResetMembers={resetMembers}
            showDuplicateError={errors.duplicateduser}
          />

          <GalleryListManager
            items={originalTrip && originalTrip.gallery ? originalTrip.gallery : []}
            onRemove={removePhoto}
          />

          <ImageUploader
            images={addedImages || []}
            onChange={(newImages) => setAddedImages(newImages)}
            maxImages={10}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            variant="text"
            startIcon={<Save/>}
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
