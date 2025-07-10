import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
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
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        List,
        ListItem,
        ListItemText
    } from '@mui/material';

import config from "../Resources/config";

function ViewPlace(){
    //Get id
    const { PlaceID } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [ubication, setUbication] = useState({
        CountryName : "",
        StateName : "",
        CityName : ""
    });
    

    //URLS
    const [URLsCatalogService, setURLsCatalogService] = useState(
        {
            Places:`${config.api.baseUrl}${config.api.endpoints.Places}`
        }
    );

    //mock
    const [placemock, setPlacemock] = useState(
        {
            id : 1,
            name: 'Place Name',
            countryid: 1,
            stateid: 1,
            cityid: 1,
            description: 'Description',
            address:'Address Text',
            facilities:[
                {
                    id:1,
                    name:"WC"
                }
            ],
            isinternational: false
        }
    );

    const [placeinfo, setPlaceinfo] = useState(
        {
            name: 'Place Name',
            countryid: 1,
            stateid: 1,
            cityid: 1,
            description: 'Description',
            address:'Address Text',
            isinternational: false
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
            name : "SINALOA"
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
            id:true,
            name:"Wi-fi",
            code:"wifi"
        },
        {
            value : false,
            name : "Bathroom",
            code : "bath"
        }
    ]);

    //getPlaceInfo
    const getPlaceInfo = async(  ) =>{
        axios.get(URLsCatalogService.Places + '/' + PlaceID)
        .then(resp => {
            const data = resp.data.info[0];
            setPlaceinfo(data);
            getUbicationNames(data);
        })
        .catch(error => console.error("Error getting place id"));
    };

    //getUbicationName
    const getUbicationNames = async( placeinfo ) =>{
        axios.get(URLsCatalogService.Places + 
            '/Ubications/' + placeinfo.countryid +
            '/' + placeinfo.stateid +
            '/' + placeinfo.cityid)
        .then(resp => {
            let find = resp.data.info;
            setUbication( 
            {
                CountryName : find.CountryName,
                StateName : find.StateName,
                CityName : find.CityName
            }
            );
        })
        .catch(error => console.error("Error getting names of ubications"));
    };
    
    useEffect(()=> {
            getPlaceInfo();
    },[]);

    return (<Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography variant="h5" component="h5" gutterBottom align="center">
                Name
            </Typography>
            {
                PlaceID
            }
            <Typography variant="body1" component="body1" gutterBottom align="center">
                {
                    placeinfo.name
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="center">
                Description
            </Typography>
            <Typography variant="body1" component="body1"  align="center">
                {
                    placeinfo.description
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="center">
                Address
            </Typography>
            <Typography variant="body1" component="body1"  align="center">
                {
                    placeinfo.address
                }
            </Typography>

            <Typography gutterBottom variant="h6" component="div" align="center">
                Ubication
            </Typography>

            <Typography gutterBottom variant="body1" component="div" align="center">
            { ubication.CityName }, { ubication.StateName }, { ubication.CountryName}
            </Typography>
            
            <Typography gutterBottom variant="h6" component="div" align="center">
                Facilities
            </Typography>
            
        </Box>
    </Container>);
}
export default ViewPlace;