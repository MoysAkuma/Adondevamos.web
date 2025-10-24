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
        Snackbar
} from '@mui/material';

import { AccountCircle, 
  Add, 
  Delete, 
  FlightTakeoff, 
  WatchLater 
} from '@mui/icons-material'
import MemberSearch from './MemberSearch';
import SearchPlaces from './SearchPlaces';
import Itinerary from './Itinerary/Itinerary';
import MemberList from './MemberList';
import config from "../../Resources/config";
import { useParams } from 'react-router-dom';
import FormTrips from './FormTrips';

function EditTrip(){

    const [isUser, setIsUser] = useState(false);

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
        memberlist:[]
        
    });
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
      if (!formTrip.initialdate != null) {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finaldate != null) {
        throw new Error('set final date');
      }
      
      // API call to create trip
      const response = await axios.put(URLsCatalogService.Trips + "/" + id, {
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
      if(response.status == 200){
        //Save member list
        if(formTrip.memberlist.length > 0 ){
          saveMemberlist();
        }
        //Save itinerary
        if(formTrip.itinerary.length > 0 ){
          saveItinerary();
        }
      } 
      // Handle success
      setSubmitSuccess(true);
    
    } catch (error) {
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  

    //saveMemberlist
    const saveMemberlist = async( ) =>{
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
    const saveItinerary = async( ) =>{
        const lst = formTrip.itinerary.map(place => ({
          "placeid" : place.id ,
          "initialdate" : place.initialdate,
          "finaldate" : place.finaldate,
          "hide" : false
        }));
        const rq = {
          "Itinerary" : lst
        };
        axios.post(URLsCatalogService.Trips+'/' + id + '/Itinerary', rq )
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

  useEffect(()=> {
      const fetchTrip = async () => {
          if ( !id ) return;
          try {
            axios.get(URLsCatalogService.Trips + '/' + id)
            .then(resp => {
                setFormTrip( resp.data.info );
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

                <FormTrips formTrip={formTrip}
                handleChange={handleChange} />

                <Typography variant="body1"   align="left">
                  Itinerary
                </Typography>

                <ButtonGroup 
                  variant="contained" 
                  color="primary" 
                  fullWidth >
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
                              endIcon={ <WatchLater/> }
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
                  </>) : (<></>)
                }
                
                {
                  formTrip.itinerary?.length > 0 ? (
                  <>
                    <Typography variant="body1"   align="left">
                      Itinerary 
                    </Typography>
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
                  >
                  Save info
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

export default EditTrip;
