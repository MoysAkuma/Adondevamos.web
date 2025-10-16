import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import CreateTrip from "../Component/Trips/CreateTrip";
import CreatePlace from "../Component/Places/CreatePlace"

export default function Create() {
    //Module to show the search page
    const { opt } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    //API
    const [URLsAPIService, setURLsAPIService] = useState(
        {
            Countries :`${config.api.baseUrl}${config.api.endpoints.Countries}`,
            States :`${config.api.baseUrl}${config.api.endpoints.States}`,
            Cities :`${config.api.baseUrl}${config.api.endpoints.Cities}`,
            Users : `${config.api.baseUrl}${config.api.endpoints.Users}`,
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    );

    //catalogues
    const [catCountries, setCatCountries] = useState([]);
    const [catState, setCatState] = useState([]);
    const [catCities, setCatCities] = useState([]); 
    const controlViewOption = (opt) => {
        if (opt === "Trip") {
            return <>
                <CreateTrip />
            </>;
        }
        if (opt === "Place") {
            return <>
                <CreatePlace />
            </>;
        }
    }
    
    //getCountries
    const getCountries = async( ) =>{
        axios.get(URLsAPIService.Countries)
        .then(resp => {
            setCatCountries(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of countries"));
    };

    //getStates
    const getStates = async( ) =>{
        axios.get(URLsAPIService.States)
        .then(resp => {
            setCatState(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of state"));
    };

    //getCity
    const getCity = async( ) =>{
        axios.get(URLsAPIService.Cities)
        .then(resp => {
            setCatCities(resp.data.info);
        })
        .catch(error => console.error("Error getting catalogue of state"));
    };

    return (
        <CenteredTemplate>
            <>
               <img 
                    src="/UnderConstruction.png" 
                    alt="UnderConstruction" 
                    style={{ width: '100%', height: 'auto', marginTop: '20px' }} />
                {controlViewOption(opt)}
                
            </>
        </CenteredTemplate>
    );
}