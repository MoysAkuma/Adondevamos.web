import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import CreateTrip from "../Component/Trips/CreateTrip";
import CreatePlace from "../Component/Places/CreatePlace"
import CreateUser from "../Component/Users/CreateUser";
import { useAuth } from "../context/AuthContext";
import useCatalogues from "../hooks/useCatalogues";

export default function Create() {
    const [loading, setLoading] = useState(true);
    const { isLogged, loading: authLoading } = useAuth();
    
    // Get catalogues from hook
    const { catalogues, loading: cataloguesLoading } = useCatalogues();
    
    //Module to show the search page
    const { opt } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    //API
    const URLsAPIService= 
        {
            Catalogues:`${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
            Users : `${config.api.baseUrl}${config.api.endpoints.Users}`,
            Trips : `${config.api.baseUrl}${config.api.endpoints.Trips}`
        }
    

    //catalogues
    const [catCountries, setCatCountries] = useState([]);
    const [catState, setCatState] = useState([]);
    const [catCities, setCatCities] = useState([]); 
    const [catFacilities, setCatFacilities] = useState([]); 
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
                <CreatePlace
                  catCountries={catCountries}
                  catStates={catState}
                  catCities={catCities}
                  catFacilities={catFacilities}
                />
            </>;
        }
        
    }
    useEffect(() => {
        if (!cataloguesLoading) {
            setCatCountries(catalogues.countries);
            setCatState(catalogues.states);
            setCatCities(catalogues.cities);
            setCatFacilities(catalogues.facilities);
            setLoading(false);
        }
    }, [cataloguesLoading, catalogues]);

    if (loading || authLoading) {
        return <CircularProgress />;
    }
    return (
        <CenteredTemplate>
            <>
                {controlViewOption(opt)}
            </>
        </CenteredTemplate>
    );
}