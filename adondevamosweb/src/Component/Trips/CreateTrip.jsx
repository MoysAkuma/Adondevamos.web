import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        Button,
        useTheme,
        Typography,
        Box,
        Alert,
        AlertTitle,
        ButtonGroup
        
    } from '@mui/material';
import MemberSearch from './MemberSearch';
import SearchPlaces from './SearchPlaces';
import Itinerary from './Itinerary/Itinerary';
import MemberList from './MemberList';
import config from "../../Resources/config";
import { useAuth } from '../../context/AuthContext';
import FormTrips from './FormTrips';
import { AccountCircle, Add, Delete, WatchLater } from '@mui/icons-material'

function CreateTrip(catCountries, catStates, catCities  ) {
    const auth = useAuth();
    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Countries :`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States :`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities :`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            User : `${config.api.baseUrl}${config.api.endpoints.User}`,
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    const [errors, setErrors] = useState({
      duplicatedplace : false,
      duplicateduser : false,
      nameempty : false
    });

    const [showManager, setShowManager] = useState({
      itinerary : false,
      memberlist : false
    });

    // trip info
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
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
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
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate for field Trip Name
      if (!formTrip.name.trim()) {
        throw new Error('Trip name is required');
        setErrors( prev => ( { ...prev, nameempty : true } ) );
      }
      // Validate for field Description
      if (!formTrip.description.trim()) {
        throw new Error('Trip description is required');
      }

      // Validate for field initialDate
      if (!formTrip.initialdate != null) {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finaldate != null) {
        throw new Error('set final date');
      }
      
      // API call to create trip
      const response = await axios.post(URLsCatalogService.Trips, {
        name : formTrip.name.trim(),
        description : formTrip.description.trim(),
        initialDate : formTrip.initialdate,
        finalDate : formTrip.finaldate,
        ownerid : formTrip.owner.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });
      if(response.status == 200){
        //Save member list
        if  ( formTrip.memberlist.length > 0 ) {
          saveMemberlist(response.data.info);
        }

        //Save itinerary
        if ( formTrip.itinerary.length > 0 ) {
          saveItinerary(response.data.info);
        }
      } 
      // Handle success
      setSubmitSuccess(true);
    
      // Reset form after successful submission
      setFormTrip(
        {
          name : '',
          description : '',
          initialdate : "",
          finaldate : "",
          isinternational : false,
          itinerary : [],
          memberlist : []
        }
      );
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
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
        roleid : member.role,
        hide : false
      }));
      const rq = {
        "MemberList" : lst
      };
      axios.post(
        URLsCatalogService.Trips +'/' + id+ '/Members', rq)
      .then(resp => {
      })
      .catch(error => console.error("Error getting catalogue of countries"));
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
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

  const handlePlaceAdd = (item) => {

    const foundInList = formTrip.itinerary.filter( x => x.id == item.id );

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

    if ( foundInList.length == 1 ){
        setFormTrip(prev => prev.itinerary.filter(item => item.id !== event ) );
    } 
  }

  const handleUserAdd = (item) => {

    const foundInList = formTrip.itinerary.filter( x => x.id == item );

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
    if(item == 1){
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
  }, [auth]);
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

                <Typography variant="body1"   align="left">
                  Itinerary
                </Typography>
                
                <ButtonGroup 
                variant="contained" 
                color="primary" 
                fullWidth sx={{ mt: 2, mb: 4 }}>
                  <Button 
                    variant="contained" 
                    startIcon={ <Add/> }
                    onClick={ (x) => showSearch(1)}
                    disabled={showManager.itinerary}
                    >
                      Add place
                  </Button>
                  {
                    (formTrip.itinerary.length == 0 ) ? (
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
                        onClick={clearItinerary}
                        endIcon={ <Delete/> }
                         >
                            Reset itinerary
                    </Button>
                    )
                  }
                </ButtonGroup>
                
                {
                  ( formTrip.itinerary.length == 0) && (
                    <Alert severity='info' >
                      Your itinerary is empty
                    </Alert>
                  )
                }
                {
                  (showManager.itinerary ) && (
                    <SearchPlaces 
                      callback={handlePlaceAdd} 
                    itinerary={formTrip.itinerary} 
                    />
                  )
                }
                {
                  errors.duplicatedplace ? 
                  (
                  <>
                    <Alert severity="warning">
                      <AlertTitle>This place was already added </AlertTitle>
                      Please, select another place
                    </Alert>
                  </>) : 
                  (<></>)
                }
                
                {
                  formTrip.itinerary?.length > 0 ? (
                  <>
                    <Itinerary 
                      tripinfo={formTrip} 
                      callBackDelete={handleRemove} 
                      />
                  </>) : (<></>)
                }  
                

                <Typography variant="subtitle2"  align="left">
                  Members
                </Typography>
                
                <ButtonGroup 
                variant="contained" 
                color="primary" 
                fullWidth sx={{ mt: 2, mb: 4 }}>
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
                            Reset member list
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
                  >
                  Create Trip
                </Button>
            </Box>

    );
}

export default CreateTrip;
