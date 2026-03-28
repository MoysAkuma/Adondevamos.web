import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import EditTrip from "../Component/Trips/EditTrip";
import EditItinerary from "../Component/Trips/EditItinerary";
import EditUser from "../Component/Users/EditUser";
import EditPlace from "../Component/Places/EditPlace";
import { useAuth } from '../context/AuthContext';

export default function Edit() {
    //Module to show the search page
    const { opt } = useParams();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const URLsCatalogService =
    {
        Catalogues:`${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
        Users : `${config.api.baseUrl}${config.api.endpoints.Users}`
    };

    const controlViewOption = (opt) => {
        
        if (opt === "Trip") {
            return <>
                <EditTrip />
            </>;
        }
        if (opt === "Itinerary") {
            return <>
                <EditItinerary />
            </>;
        }
        if (opt === "Place") {
            return <>
                <EditPlace
                    catCountries={countries}
                    catStates={states}
                    catCities={cities}
                    catFacilities={facilities}
                />
            </>;
        }
        if (opt === "Profile") {
            return <>
                <EditUser />
            </>;
        }
        return <>
            <img src="/UnderConstruction.png" 
                alt="404 Not Found" 
                style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} 
            />
        </>
    }
    useEffect(()=> {
        //getCatalogues
        const getCatalogues = async() => {
            try {
                const response = 
                await axios.get(`${URLsCatalogService.Catalogues}/all`);
                
                if (response.status !== 200){
                    return;
                }
                const data = response.data.info;
                
                setCountries(data.countries);
                setStates(data.states);
                setCities(data.cities);
                setFacilities(data.facilities);
                
            } catch (error) {
                console.error("Error getting catalogues for site management", error);   
            }
            finally{
                setLoading(false);
            }
        };
        getCatalogues();
    },[]);

    if (loading) {
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