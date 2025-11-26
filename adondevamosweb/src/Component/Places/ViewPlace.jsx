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

import FacilitiList from "../View/FacilitiList";

import config from "../../Resources/config";

import CenteredTemplate from "../Commons/CenteredTemplate";

function ViewPlace(){
    //Get id
    const { id } = useParams();
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
            Places:`${config.api.baseUrl}${config.api.endpoints.Places}`,
            ViewPlaces:`${config.api.baseUrl}${config.api.site.View}${config.api.endpoints.Places}`
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

    

    //getPlaceInfo
    const getPlaceInfo = async(  ) =>{
        axios.get(URLsCatalogService.Places + '/' + id)
        .then(resp => {
            const data = resp.data.info;
            setPlaceinfo(data);
        })
        .catch(error => console.error("Error getting place id"));
    };
    
    useEffect(()=> {
            getPlaceInfo();
    },[]);

    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography variant="h4" component="h4" gutterBottom align="center">
                {
                    placeinfo.name
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="left">
                Description
            </Typography>
            <Typography variant="body1" component="body1"  align="right">
                {
                    placeinfo.description
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="left">
                Address
            </Typography>
            <Typography variant="body1" component="body1"  align="right">
                {
                    placeinfo.address
                }
            </Typography>

            <Typography gutterBottom variant="h6" component="div" align="left">
                Ubication
            </Typography>

            <Typography gutterBottom variant="body1" component="div" align="right">
                {
                    placeinfo.City.name + ", " + placeinfo.State.name + ", " + placeinfo.Country.name
                }
            </Typography>
            

        </Box>
    );
}
export default ViewPlace;