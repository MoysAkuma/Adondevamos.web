import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import CreateTrip from "../Component/Trips/CreateTrip";
import CreatePlace from "../Component/Places/CreatePlace"
import CreateUser from "../Component/Users/CreateUser";
import { useAuth } from "../context/AuthContext";
export default function Create() {
    const { isLogged, loading } = useAuth();
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
        
        if (opt === "User") {
            return <>
                <CreateUser />
            </>;
        }
        if (isLogged === false && loading === false) {
            return <>
                <Typography variant="h6" color="error">
                    You must be logged in to create content.
                </Typography>
            </>;
        }
        if (opt === "Trip" ) {
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

    return (
        <CenteredTemplate>
            <>
                {controlViewOption(opt)}
            </>
        </CenteredTemplate>
    );
}