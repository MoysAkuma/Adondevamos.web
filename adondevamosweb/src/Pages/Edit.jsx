import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import EditTrip from "../Component/Trips/EditTrip";


export default function Edit() {
    //Module to show the search page
    const { opt } = useParams();
    const [searchResults, setSearchResults] = useState([]);

    const controlViewOption = (opt) => {
        if (opt === "Trip") {
            return <>
                <Typography variant="h5" align="center">
                    Trip Edit Page
                </Typography>
                <EditTrip />
            </>;
        }
        if (opt === "Place") {
            return <>
                <Typography variant="h5" align="center">
                    Place Edit Page
                </Typography>
            </>;
        }
    }

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