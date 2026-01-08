import { useState, useEffect } from 'react';
import axios from 'axios';
import {
        Button,
        Typography,
        Box,
        Alert,
        AlertTitle,
        ButtonGroup,
        Snackbar
} from '@mui/material';

import MemberSearch from './MemberSearch';
import ManageItinerary from './Itinerary/ManageItinerary';
import MemberList from './MemberList';
import config from "../../Resources/config";
import { useAuth } from '../../context/AuthContext';
import FormTrips from './FormTrips';
import { AccountCircle, 
  Add, 
  Delete, 
  FlightTakeoff, 
  WatchLater 
} from '@mui/icons-material'

function CreateTrip( ) {
    const auth = useAuth();
    
    //URLS ro call rest api
    const URLsCatalogService = 
    {
        User : `${config.api.baseUrl}${config.api.endpoints.User}`,
        Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
    };

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
        memberlist:[]
      }
    );

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    //Message snack text
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
      if (!formTrip.initialdate === '') {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finaldate === '') {
        throw new Error('set final date');
      }

      const rq = {
        name : formTrip.name.trim(),
        description : formTrip.description.trim(),
        initialDate : formTrip.initialdate,
        finalDate : formTrip.finaldate,
        ownerid : formTrip.owner.id
      };
      //const response = {status : 201, data:{info: { id : 0 }}}
      // API call to create trip
      const response = await axios.post(URLsCatalogService.Trips, rq , {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here'
        }
      });

      if(response.status == 201) {
        //Show message of saved countries
        setMessageStack("Trip was saved.");

        // Handle success
        setSubmitSuccess(true);

        //Save member list
        if  ( formTrip.memberlist.length > 0 ) {
          saveMemberlist(response.data.info);
        }

        //Save itinerary
        if ( formTrip.itinerary.length > 0 ) {
          saveItinerary(response.data.info);
        }
        // Reset form after successful submission
        setFormTrip(
          prev => (
            {
            ...prev,
              name : '',
              description : '',
              initialdate : '',
              finaldate : ''
            }
          ) 
        );
      }       
    } catch (error) {
      
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

    //saveMemberlist
    const saveMemberlist = async( item ) => {
      const id = item.id;
      const lst = formTrip.memberlist.map(member => ({
        userid : member.id,
        hide : false
      }));
      const rq = {
        "MemberList" : lst
      };

      axios.post(
        URLsCatalogService.Trips +'/' + id+ '/Members', rq)
      .then(resp => {
        console.log("Member list was saved");
        setFormTrip(
          prev => (
            {
            ...prev,
              memberlist : ''
            }
          ) 
        );
        setMessageStack("Members were saved");
      })
      .catch(error => console.error("Error getting catalogue of countries"));
      console.log(rq);
    };

    //save itinerary
    const saveItinerary = async( item ) =>{
      const id = item.id;
      const lst = formTrip.itinerary.map(place => ({
        "placeid" : place.id ,
        "initialdate" : place.initialdate,
        "finaldate" : place.finaldate,
        "hide" : false
      }));
      const rq = {
        "Itinerary" : lst
      };
     axios.post(URLsCatalogService.Trips + '/' + id + '/Itinerary', rq )
      .then(resp => {
        setMessageStack("Itinerary was saved.");
        setFormTrip(
          prev => (
            {
            ...prev,
              itinerary : []
            }
          ) 
        );
      })
      .catch(error => console.error("Error getting catalogue of countries"));
    };

  const handlePlaceAdd = (item) => {
    //Search if exist in itinerary
    const foundInList = formTrip.itinerary.filter( x => x.id == item.id );
    
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
    const foundInList = formTrip.itinerary.filter( x => x.id == event);
    // if found, filter list and set to form itinerary
    if ( foundInList.length == 1 ){
        const filteredList = formTrip.itinerary.filter(item => item.id !== event )
        setFormTrip( prev => ({...prev, itinerary : filteredList } ));
    } 
  }

  const handleUserAdd = (item) => {

    const foundInList = formTrip.memberlist.filter( x => x.id == item );

    if ( foundInList.length == 0 ){
        setFormTrip(
          prev => (
            { ...prev, 
                memberlist : [...prev.memberlist, item] 
            }
          )
        );
        setShowManager( prev => ( { ...prev, memberlist : false } ) );
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
        setFormTrip(prev => prev.memberlist.filter(item => item.id !== event ) );
    } 
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
        <Typography variant="h5" align="center">
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
        />  
                

        <Typography variant="subtitle2"  align="left">
          Members
        </Typography>
            
        <ButtonGroup 
        variant="contained" 
        color="primary" 
        fullWidth >
          <Button 
              variant="contained" 
              startIcon={ <AccountCircle/> }
              onClick={ (x) => showSearch(2)}
              >
                Add member
          </Button>
          {
            (formTrip.memberlist.length == 0 ) ? (
              <>
                <Button 
                    variant="text" 
                    startIcon={ <WatchLater/> }
                    onClick={ (x) => ( x )}
                    >
                      Decided Later
                </Button>
            </>
            
            ) : (
              <Button 
                variant="text" 
                startIcon={ <Delete/> }
                  >
                    Reset members
              </Button>
            )
          }
          </ButtonGroup>
        {
          (formTrip.memberlist.length == 0) && (
            <Alert severity='info' >
              Your member list is empty
            </Alert>
          )
        }
        {
          (showManager.memberlist ) && (
            <MemberSearch
              callback={handleUserAdd}
              memberlist={formTrip.memberlist}
            />
          )
        }
        {
          errors.duplicateduser ? 
          (
          <>
            <Alert severity="warning">
              <AlertTitle>This User was already added </AlertTitle>
              Please, select another user
            </Alert>
          </>) : (<></>)
        }

        {
          formTrip.memberlist?.length > 0 ? (
          <>
            <Typography variant="body1"   align="left">
              Member list 
            </Typography>
            <MemberList 
              memberlist={formTrip.memberlist} 
              callBackDelete={handleRemoveUser} 
              />
          </>) : (<></>)
        }

        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="text"
          startIcon={<FlightTakeoff />}
          >
          Create Trip
        </Button>

        <Snackbar 
          open={submitSuccess}
          autoHideDuration={3000}
          message={messageSnack}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
  );
}

export default CreateTrip;
