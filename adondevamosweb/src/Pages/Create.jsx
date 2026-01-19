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
export default function Create() {
    const [loading, setLoading] = useState(true);
    const { isLogged, loading: authLoading } = useAuth();
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
    useEffect(()=> {
        //getCatalogues
        const getCatalogues = async() => {
            try {
                const response = 
                await axios.get(`${URLsAPIService.Catalogues}/all`);
                if (response.status !== 200){
                    return;
                }
                const data = response.data.info;
                
                setCatCountries(data.countries);
                setCatState(data.states);
                setCatCities(data.cities);
                setCatFacilities(data.facilities);
                
            } catch (error) {
                console.error("Error getting catalogues for site management", error);   
            }
            finally{
                setLoading(false);
            }
        };
        getCatalogues();
    },[]);

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