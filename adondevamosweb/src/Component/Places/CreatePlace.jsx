import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Typography,
        Box,
        FormGroup,
        FormControlLabel,
        Checkbox,
        Snackbar,
        Alert
} from '@mui/material';

import CountriesSelectList from "../Catalogues/CountriesSelectList";
import StateSelect from "../Catalogues/StateSelect";
import CitiesSelect from "../Catalogues/CitiesSelect";
import SnackbarNotification from "../Commons/SnackbarNotification";

import config from "../../Resources/config";

function CreatePlace() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  //URLS
  const [URLsCatalogService, setURLsCatalogService] = useState(
      {
          Countries:`${config.api.baseUrl}${config.api.endpoints.Countries}`,
          States:`${config.api.baseUrl}${config.api.endpoints.States}`,
          Cities:`${config.api.baseUrl}${config.api.endpoints.Cities}`,
          Users:`${config.api.baseUrl}${config.api.endpoints.Users}`,
          Facilities:`${config.api.baseUrl}${config.api.endpoints.Facilities}`,
          Places:`${config.api.baseUrl}${config.api.endpoints.Places}`
      }
  );

  //catalogues
  const [catCountries, setCatCountries] = useState([
      {
          id:1,
          name:"MEXICO"
      }
  ]);
  const [catStates, setCatStates] = useState([
      {
          id:1,
          name:"SINALOA"
      }
  ]);

  const [catCities, setCatCities] = useState([
      {
          id:1,
          name:"Culiacan"
      },
      {
          id:2,
          name:"Los mochis"
      }
  ]);

  const [catFacilities, setCatFacilities] = useState([
    {
        name:"Wi-fi",
        id:1,
        hide:false
    },
    {
        name:"Restroom",
        id:2,
        hide:false
    }
]);

const [errors, setErrors] = useState({
      place : false,
      facilities : false
});

const [responseSuceess, setResponseSuccess] = useState({
      place : false,
      facilities : false
});

// State to track checked options
const [checkedFacilities, 
  setCheckedFacilities] = useState({});

const facilitiesChange = (event) => {
  setCheckedFacilities({
    ...checkedFacilities,
      [event.target.name]: event.target.checked,
  });
};
  // placeinfo
  const [formCreatePlace, setformCreatePlace] = useState(
    {
      name: '',
      countryid: '',
      stateid: '',
      cityid: '',
      description: '',
      address:'',
      ispublic: false
    }
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      if (!formCreatePlace.countryid) {
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

      //Validate for facilities of place
      if(Object.keys(checkedFacilities || {}).length === 0){
        throw new Error('select at least a facility is required');
      }
      
      // API call to create product
      const response = await axios.post(
        URLsCatalogService.Places, 
      {
        name: formCreatePlace.name.trim(),
        countryid: formCreatePlace.countryid,
        stateid: formCreatePlace.stateid,
        cityid: formCreatePlace.cityid,
        description: formCreatePlace.description,
        address:formCreatePlace.address,
        ispublic: formCreatePlace.ispublic
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-token-here' // Add if needed
        }
      });
      switch(response.status) {
        case 200, 201:
          // Handle success
          setSubmitSuccess(true);
          // Reset form after successful submission
          setformCreatePlace({
            name: '',
            countryid: "",
            stateid: "",
            cityid: "",
            description: '',
            address:'',
            ispublic: false
          });

          saveSelectedFacilities(response.data.info);
          
        break;
        case 409:  throw new Error('A place was created with same info'); break;
        case 404: throw new Error('No endpoint'); break;
      }
      
      
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //Handle select controller
  const handleSelect = (event) => {
        const { name, value } = event.target;
        handleChange(event);
        switch(name){
            case "countryid":
              getStates(value);
              setformCreatePlace(prev => ({
                  ...prev,
                  stateid: null
                }));
             break;
            case "stateid":
              getCities(value);
              setformCreatePlace(prev => ({
                  ...prev,
                  cityid: null
                }));
            break;
        }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setErrors(prev => (
      {
        place : false,
        facilities : false
      }
    ));
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
        axios.get(URLsCatalogService.States + '/ByCountryID/' + item)
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

    //getFacilities
    const getFacilities = async( ) =>{
        axios.get(URLsCatalogService.Facilities)
        .then(resp => {
            setCatFacilities(resp.data.info);
            setLoading(false);
        })
        .catch(error => console.error("Error getting catalogue of facilities"));
    };

    //saveplace api call    
    const saveSelectedFacilities = async(item) =>{

      const checkedFacilitiesToSave = 
      Object.keys(checkedFacilities).map(key => ({
        facilityid: Number(key),
        value: checkedFacilities[key]
      }));

      const formSaveFacilities = {  
        Facilities: checkedFacilitiesToSave
      };

      const url = URLsCatalogService.Places 
        + '/' + 
        item[0].id + 
        '/Facilities';
      
      axios.post(url, formSaveFacilities)
      .then(resp => {
          setLoading(false);
          //Clean checked facilities
          setCheckedFacilities({});

      })
      .catch(
        error => console.error("Error getting catalogue of facilities"));
    };
    

    useEffect(()=> {
      getCountries();
      getFacilities();
    },[]);
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
          placeholder="About this place"
          align="left"
          onChange={handleChange}
          value={formCreatePlace.description}
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
            catStates={catStates}
            /> )   : <>Please, select a country.<br/></>
        }

        {
          formCreatePlace.stateid ? (
            <CitiesSelect 
            val={formCreatePlace.cityid}
            onChangecall={handleSelect}
            catCities={catCities}
            />
          ) : <>Please, select a state.<br/></>
        }
                
        <Typography variant="h6" component="h6" 
        gutterBottom align="left">
            Facilities
        </Typography>

        <FormGroup>
          {
            catFacilities?.map((opt)=>(
              <FormControlLabel
                key={opt.id}
                label={opt.name}
                control={
                  <Checkbox 
                    name={opt.id}  
                    checked={checkedFacilities[opt.id] || false} 
                    onChange={facilitiesChange} 
                  />
                } 
              />
            )
          )
          }

        </FormGroup>
        
        <SnackbarNotification
          open={responseSuceess.place}
          onClose={handleCloseAlert}
          message="A new place was added! Please wait while we save the facilities."
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
          disabled={isSubmitting}
          variant="text"
          >
          Create Place
        </Button>
      </Box>
    </>
  );
};

export default CreatePlace;