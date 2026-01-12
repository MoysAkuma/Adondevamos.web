import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    { 
        Button,
        ButtonGroup,
        Typography,
        Box,
        Alert,
        AlertTitle,
        CircularProgress
} from '@mui/material';

import { Save
} from '@mui/icons-material'
import MemberSearch from './MembersList/MemberSearch';
import ManageItinerary from './Itinerary/ManageItinerary';
import MemberList from './MembersList/MemberList';
import ManageMemberList from './MembersList/ManageMemberList';
import SnackbarNotification from '../Commons/SnackbarNotification';
import config from "../../Resources/config";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FormTrips from './FormTrips';
import { useAuth } from "../../context/AuthContext";

function EditTrip(){
    const { isLogged, loading } = useAuth();
    const [isUser, setIsUser] = useState(false);
    const navigate = useNavigate();

    //Trip id
    const { id } = useParams();
    
    //URLS
    const URLsCatalogService = 
    {
        User : `${config.api.baseUrl}${config.api.endpoints.User}`,
        Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
    };


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
    const [messageSnack, setMessageStack] = useState('');
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
      if (!formTrip.initialdate != "") {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finaldate != "") {
        throw new Error('set final date');
      }
      
      // API call to create trip
      const response = await axios.put(URLsCatalogService.Trips + '/' + id, {
        name : formTrip.name.trim(),
        description : formTrip.description,
        initialdate : formTrip.initialdate,
        finaldate : formTrip.finaldate,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });
      if(response.status == 201 
        || response.status == 200){
        setMessageStack("Trip info was updated.");
      } 

      // Handle success
      setSubmitSuccess(true);
    
    } catch (error) {
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
      //compare original trip with form trip and save changes
      if ( JSON.stringify(originalTrip.itinerary) 
        != JSON.stringify(formTrip.itinerary) ){
        setMessageStack("Saving itinerary...");
        saveItinerary();
      }
      if ( JSON.stringify(originalTrip.members) 
        != JSON.stringify(formTrip.members) ){
        setMessageStack("Saving member list...");
        saveMemberlist();
      }
      navigate('/View/Trip/' + id );
    }
  };

  

    //saveMemberlist
    const saveMemberlist = async( ) =>{
        const lst = formTrip.members.map(member => ({
          userid : member.id,
          hide : false
        }));
        const rq = {
          "Members" : lst
        };
        axios.post(
          URLsCatalogService.Trips +'/' + id+ '/Members', rq)
        .then(resp => {
            
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //save itinerary
    const saveItinerary = async( ) =>{
        const lst = formTrip.itinerary.map(itinerary => ({
          "placeid" : itinerary.place.id ,
          "initialdate" : itinerary.initialdate,
          "finaldate" : itinerary.finaldate
        }));

        const rq = {
          "Itinerary" : lst
        };
        axios.put(URLsCatalogService.Trips+'/' + id + '/Itinerary', rq )
        .then(resp => {
            setMessageStack("Itinerary was saved.");
        })
        .catch(error => console.error("Error getting catalogue of countries"));
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

  const handleUserAdd = (item) => {
    console.log("Adding user to member list:", item);
    const foundInList = formTrip.members.filter( x => x.user.id == item );

    if ( foundInList.length == 0 ){
        setFormTrip(
          prev => (
            { ...prev, 
                members : [...prev.members, item] 
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
            axios.get(URLsCatalogService.Trips + '/' + id)
            .then(resp => {
                setFormTrip( resp.data.info );
                setOriginalTrip( resp.data.info );
            })
            .catch(error => console.error("Error getting trip info"));
        } catch (err) {
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
