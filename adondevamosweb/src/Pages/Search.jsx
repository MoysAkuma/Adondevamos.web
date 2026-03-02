import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Typography } from "@mui/material";
import axios from 'axios';

import config from "../Resources/config";
import TripFilters from "../Component/Trips/TripFilters";
import PlaceFilter from "../Component/Places/PlaceFilter";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import TripsResultSearch from "../Component/Trips/TripsResultSearch";
import PlacesResultSearch from "../Component/Places/PlacesResultSearch";
import usePlaceQueryApi from '../hooks/Places/usePlaceQueryApi';


export default function Search() {
    //Module to show the search page
    const { opt } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const { searchPlaces } = usePlaceQueryApi();
    const [catalogues, setCatalogues] = useState({
        countries: [],
        states: [],
        cities: [],
        facilities: []
    });
    
    useEffect(() => {
        // Fetch catalogues data once when component mounts
        axios.get(`${config.api.baseUrl}${config.api.endpoints.Catalogues}/all`)
            .then((response) => {
                setCatalogues(response.data.info);
            })
            .catch((error) => {
                console.error("Error fetching catalogues:", error);
            });
    }, []);
    
    const controlViewOption = (opt) => {
        if (opt === "Trips") {
            return <>
                <TripFilters 
                    searchMethod={searchTripsByFilters} 
                />
                {
                  (searchResults.length !== 0) && controlViewResult(opt)
                }
            </>;
        }
        if (opt === "Places"){
            return (
            <>
                <PlaceFilter 
                    searchMethod={searchPlacessByFilters}
                    countries={catalogues.countries}
                    states={catalogues.states}
                    cities={catalogues.cities}
                    facilitiesOptions={catalogues.facilities}
                />
                {
                    (searchResults.length !== 0) && controlViewResult(opt)
                }
            </>)
        }
    }

    const controlViewResult = (opt) => {
        if (searchResults.length === 0 ) return <></>;
        if (opt === "Trips") {
            return <TripsResultSearch results={searchResults} />;
        }
        if(opt === "Places"){
            return (<PlacesResultSearch results={searchResults} />);
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

    const searchPlacessByFilters = async (filters) => {
        searchPlaces(filters)
            .then((response) => {
                setSearchResults(response.data.info);
            })
            .catch((error) => {
                console.error("There was an error searching places by filters!", error);
            });
    }

    return (
        <CenteredTemplate>
            <>
                <Typography variant="h5" align="center">
                    Discover {opt}
                </Typography>
                {controlViewOption(opt)}
            </>
        </CenteredTemplate>
    );
}