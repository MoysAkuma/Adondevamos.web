import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import EditTrip from "../Component/Trips/EditTrip";
import EditUser from "../Component/Users/EditUser";

export default function Edit() {
    //Module to show the search page
    const { opt } = useParams();

    const controlViewOption = (opt) => {
        console.log("Edit option:", opt);
        if (opt === "Trip") {
            return <>
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

    return (
        <CenteredTemplate>
            <>
                {controlViewOption(opt)}
            </>
        </CenteredTemplate>
    );
}