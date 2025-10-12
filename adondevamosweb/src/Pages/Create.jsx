import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";


export default function Create() {
    //Module to show the search page
    const { opt } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const controlViewOption = (opt) => {
        if (opt === "Trips") {
            return <>
                <Typography variant="h5" align="center">
                    Trip Creation Page
                </Typography>
            </>;
        }
    }

    const controlViewResult = (opt) => {
        if (searchResults.length === 0 ) return <></>;
        if (opt === "Trips") {
            return searchResults.map((trip) => (<p key={trip.id || trip.name}>{trip.name}</p>));
        }
    }
    const searchTripsByFilters = async (filters) => {
        axios.post(
            `${config.api.baseUrl}${config.api.endpoints.Trips}/Search`,
            {
                filters : filters
            }
        ).then( (response) => {
            setSearchResults( response.data.info );
        }).catch( (error) => {
            console.error("There was an error searching trips by filters!", error);
        });    
    }

    return (
        <CenteredTemplate>
            <>
                
                <img 
                src="/UnderConstruction.png" 
                alt="UnderConstruction" 
                style={{ width: '100%', height: 'auto', marginTop: '20px' }} />
            </>
        </CenteredTemplate>
    );
}