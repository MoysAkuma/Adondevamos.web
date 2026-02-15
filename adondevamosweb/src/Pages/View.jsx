import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import ViewTrip from "../Component/Trips/ViewTrip";
import ViewPlace from "../Component/Places/ViewPlace";

export default function View() {
    //Module to show the search page
    const { opt, id } = useParams();
    const [searchResults, setSearchResults] = useState([]);

    const controlViewOption = (opt) => {
        if (opt === "Trip") {
            return <>
                <ViewTrip />
            </>;
        }
        if (opt === "Place") {
            return <>
                <ViewPlace />
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