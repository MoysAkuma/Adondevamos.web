import React, { useState, useEffect } from "react";
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        List,
        ListItem,
        ListItemText,
        IconButton

    } from '@mui/material';
import {BeachAccessIcon, Add} from '@mui/icons-material';
import SearchResultList from "./SearchResultList";
function PlaceSearch(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            value:1,
            label:"MEXICO"
        }
    ]);
    const [catStates, setCatStates] = useState([
        {
            value:1,
            label:"SINALOA"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            value:1,
            label:"Culiacan"
        },
        {
            value:2,
            label:"Los mochis"
        }
    ]);

    const [foundPlaces, setFoundPlaces] = useState([]);

    const searchPlaces = async (e) => {
        setFoundPlaces([
            {
                id:1,
                name:"Place Name",
                description:"Desc",
                facilities:[
                    {
                        name:"Wi-fi",
                        code:"wifi",
                        value:true
                    },
                    {
                        name:"Bathroom",
                        code:"wifi",
                        value:true
                    }
                ]
            },
            {
                id:2,
                name:"Place Name",
                description:"Desc",
                facilities:[
                    {
                        name:"Wi-fi",
                        code:"wifi",
                        value:true
                    },
                    {
                        name:"Bathroom",
                        code:"wifi",
                        value:true
                    }
                ]
            }
        ]);
    };

    const [formSearchPlace, setFormSearchPlace] = useState({
        countryID: '',
        stateID: '',
        cityID: ''
    });

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormSearchPlace(prev => ({
        ...prev,
        [name]: value
        }));
    };

    return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="subtitle2" gutterBottom align="center">
            Search Places
        </Typography>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
            >
                <TextField
                  id="countryID"
                  name="countryID"
                  select
                  label="Country"
                  defaultValue="1"
                  helperText="Please select a Country"
                  value={formSearchPlace.countryID}
                  onChange={handleChange}
                >
                  {catCountries.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                      {option.label}
                      </MenuItem>
                  ))}
                </TextField>

                <TextField
                  id="stateID"
                  name="stateID"
                  select
                  label="State"
                  defaultValue="1"
                  helperText="Please select a state"
                  value={formSearchPlace.stateID}
                  onChange={handleChange}
                >
                  {catStates.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                      {option.label}
                      </MenuItem>
                  ))}
                </TextField>

                <TextField
                  id="cityID"
                  name="cityID"
                  select
                  label="City"
                  defaultValue="1"
                  helperText="Please select a city"
                  value={formSearchPlace.cityID}
                  onChange={searchPlaces}
                >
                  {catCities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
        </Box>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <SearchResultList name={"places"} results={foundPlaces}/>
        </Box>
    </Container>
    );
}

export default PlaceSearch;