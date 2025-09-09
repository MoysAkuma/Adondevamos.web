import { useState } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        Alert,
        AlertTitle,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';

import CountriesSelectList from "../Component/Catalogues/CountriesSelectList";
import StateSelect from "../Component/Catalogues/StateSelect";
import CitiesSelect from "../Component/Catalogues/CitiesSelect";

import MemberSearch from '../Component/Trips/MemberSearch';
import SearchPlaces from '../Component/Trips/SearchPlaces';
import Itinerary from '../Component/Trips/Itinerary';
import MemberList from '../Component/Trips/MemberList';
import config from "../Resources/config";

function CreateTrip(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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

    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            id : 1,
            name : "MEXICO"
        }
    ]);

    const [catStates, setCatStates] = useState([
        {
            id : 1,
            name : "Sinaloa"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            id : 1,
            name : "Culiacan"
        },
        {
            id : 2,
            name : "Los mochis"
        }
    ]);

    const [itinerary, setItinerary] = useState([]);

    const [addedMemberList, setAddedMemberList] = useState([]);

    const [errors, setErrors] = useState({
      duplicatedplace : false,
      duplicateduser : false
    });

    // trip info
    const [formTrip, setFormTrip] = useState({
        name : '',
        description : '',
        initialdate : '',
        finaldate : '',
        countryid : '',
        stateid : '',
        cityid : '',
        
    });
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
      }
      // Validate for field Description
      if (!formTrip.description.trim()) {
        throw new Error('Trip description is required');
      }
      // Validate for field Country
      if (!formTrip.countryid != null) {
        throw new Error('countryid is required');
      }

      // Validate for field State
      if (!formTrip.stateid != null) {
        throw new Error('stateid is required');
      }

      // Validate for field City
      if (!formTrip.cityid != null) {
        throw new Error('cityid is required');
      }
      // Validate for field itinerary
      if (!formTrip.itinerary != null) {
        throw new Error('select at least one place is required');
      }

      // Validate for field initialDate
      if (!formTrip.initialDate != null) {
        throw new Error('set initial date');
      }

      // Validate for field finalDate
      if (!formTrip.finalDate != null) {
        throw new Error('set final date');
      }

      // Validate for field member
      if (!formTrip.memberlist != null ) {
        throw new Error('set member list');
      }
      
      // API call to create trip
      const response = await axios.post(URLsCatalogService.Trips, {
        name : formTrip.name.trim(),
        countryid : formTrip.countryid,
        stateid : formTrip.stateid,
        cityid : formTrip.cityid,
        description : formTrip.description,
        isInternational : formTrip.isinternational,
        initialDate : formTrip.initialdate,
        finalDate : formTrip.finaldate,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });
      if(response.status == 200){
        //Save member list
        if(addedMemberList.length > 0 ){
          saveMemberlist(response.data.info);
        }
        //Save itinerary
        if(itinerary.length > 0 ){
          saveItinerary(response.data.info);
        }
      } 
      // Handle success
      setSubmitSuccess(true);
    
      // Reset form after successful submission
      setFormTrip({
        name: '',
        description: '',
        initialDate:"",
        finalDate:"",
        isinternational:false,
        countryid: '',
        stateid: '',
        cityid: '',
        memberlist:[]
      });
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //getCountries
    const getCountries = async( ) =>{
        axios.get(URLsCatalogService.Countries)
        .then(resp => {
            setCatCountries(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getStates
    const getStates = async( item ) =>{
        axios.get(URLsCatalogService.States + '/Bycountryid/' + item)
        .then(resp => {
            setCatStates(resp.data.info);
            handleChange({target:{cityid:0}});
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getCities
    const getCities = async( item ) =>{
        axios.get(URLsCatalogService.Cities + '/ByState/' + item)
        .then(resp => {
            setCatCities(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //saveMemberlist
    const saveMemberlist = async( item ) =>{
        const id = item.id;
        const lst = addedMemberList.map(member => ({
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
            setCatCities(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //save itinerary
    const saveItinerary = async( item ) =>{
        const id = item.id;
        const lst = itinerary.map(place => ({
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
            setCatCities(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };
    //Handle select controller
  const handleSelect = (event) => {
        const { name, value } = event.target;
        handleChange(event);
        switch(name){
            case "countryid":
              getStates(value);
              setFormTrip(prev => ({
                  ...prev,
                  stateid: 0
                }));
             break;
            case "stateid":
              getCities(value);
              setFormTrip(prev => ({
                  ...prev,
                  cityid: 0
                }));
            break;
        }
  };

  const handlePlaceAdd = (item) => {

    const foundInList = itinerary.filter( x => x.id == item.id );

    if ( foundInList.length == 0 ){
        setItinerary([...itinerary, item]);
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
    const foundInList = itinerary.filter( x => x.id == event);

    if ( foundInList.length == 1 ){
        setItinerary(prev => prev.filter(item => item.id !== event ) );
    } 
  }

  const handleUserAdd = (item) => {

    const foundInList = itinerary.filter( x => x.id == item );

    if ( foundInList.length == 0 ){
        setAddedMemberList([...addedMemberList, item]);
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
    const foundInList = addedMemberList.filter( x => x.id == event);

    if ( foundInList.length == 1 ){
        setAddedMemberList(prev => prev.filter(item => item.id !== event ) );
    } 
  }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
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

                  <TextField
                      id="name"
                      name="name"
                      label="Name"
                      placeholder="Name of this trip"
                      variant="outlined"
                      onChange={handleChange}
                      size={isMobile ? 'small' : 'medium'}
                      value={formTrip.name}
                      fullWidth
                      required                      
                  />
                
                  <TextField
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="initalDate"
                    name="initalDate"
                    label="Initial Date"
                    placeholder="Initial Date of this trip"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formTrip.initialdate}
                    fullWidth
                    required
                  />
                
                  <TextField
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="finaldate"
                    name="finaldate"
                    label="Final Date"
                    placeholder="Initial Date of this trip"
                    variant="outlined"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={formTrip.finaldate}
                    fullWidth
                    required
                  />
                
                <Typography variant="body1"  gutterBottom align="left">
                  Ubication
                </Typography>
                
                <Typography variant="subtitle1"  gutterBottom align="left">
                  Country
                </Typography>
                  <CountriesSelectList 
                    val={formTrip.countryid} 
                    onChangecall={handleSelect} 
                    catCountries={catCountries} 
                  />
                
                  {
                    formTrip.countryid ? ( <>
                      <Typography variant="subtitle1"  gutterBottom align="left">
                        Select a state as start point
                      </Typography>  

                      <StateSelect 
                        val={formTrip.stateid}
                        onChangecall={handleSelect}
                        catStates={catStates}
                      /> 
                    </>) : (<></>)
                  }
                

                
                  {
                    formTrip.stateid ? ( <>
                      <Typography variant="subtitle1"  gutterBottom align="left">
                        Select a city as start point
                      </Typography>

                      <CitiesSelect 
                        val={formTrip.cityid}
                        onChangecall={handleSelect}
                        catCities={catCities}
                      /> </>
                    ) : ( <></> )
                  }
               
                
                <Typography variant="body1"   align="left">
                  Add places to itinerary
                </Typography>
                
                <SearchPlaces 
                  callback={handlePlaceAdd} 
                  itinerary={itinerary} 
                />

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
                  itinerary?.length > 0 ? (
                  <>
                    <Typography variant="body1"   align="left">
                      Itinerary 
                    </Typography>
                    <Itinerary 
                      itinerary={itinerary} 
                      callBackDelete={handleRemove} 
                      />
                  </>) : (<></>)
                }  
                

                <Typography variant="subtitle2"  align="left">
                  Members
                </Typography>
                
                <Typography variant="subtitle2"   align="left">
                  Add members
                </Typography>

                <MemberSearch
                  callback={handleUserAdd}
                  memberlist={addedMemberList}
                 />

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
                  addedMemberList?.length > 0 ? (
                  <>
                    <Typography variant="body1"   align="left">
                      Member list 
                    </Typography>
                    <MemberList 
                      memberlist={addedMemberList} 
                      callBackDelete={handleRemoveUser} 
                      />
                  </>) : (<></>)
                }

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="contained"
                  >
                  Create Trip
                </Button>
            </Box>
        </Container>
    );
}

export default CreateTrip;
