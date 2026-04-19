import { useState, useEffect } from 'react';
import 
    {
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Tab,
        Tabs,
        Box,
        CircularProgress
    } from '@mui/material';
import axios from 'axios';
import config from '../Resources/config';

import Facilitymanager from "../Component/ManagmentSite/Facilitymanager";
import CountryManager from '../Component/ManagmentSite/CountryManager';
import StatesManager from '../Component/ManagmentSite/StatesManager';
import CitiesManager from '../Component/ManagmentSite/CitiesManager';
import CenteredTemplate from '../Component/Commons/CenteredTemplate'
import { useAuth } from '../context/AuthContext';
import useCatalogues from '../hooks/useCatalogues';

 function ManageSite(){
    const auth = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = useState(0);
    
    // Get catalogues from hook with refresh capability
    const { catalogues, loading: cataloguesLoading, refreshCatalogues } = useCatalogues();
    
    const URLsCatalogService =
    {
        Catalogues:`${config.api.baseUrl}${config.api.endpoints.Catalogues}`,
        Users : `${config.api.baseUrl}${config.api.endpoints.Users}`
    };
    const [facilities, setFacilities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    
    // Callback to refresh catalogues when new location is saved
    const handleLocationUpdate = async () => {
        try {
            await refreshCatalogues();
        } catch (error) {
            console.error("Error refreshing catalogues:", error);
        }
    };


    useEffect(() => {
        if (!cataloguesLoading) {
            setFacilities(catalogues.facilities);
            setCountries(catalogues.countries);
            setStates(catalogues.states);
            setCities(catalogues.cities);
            setLoading(false);
        }
    }, [cataloguesLoading, catalogues]);

    if (loading) {
        return <CircularProgress />;
    }
    return (
        <CenteredTemplate>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Site Management
            </Typography>
            <Typography variant="body1" component="p" gutterBottom align="center" sx={{ mb: 4 }}>
                Welcome, {auth.usertag} 
            </Typography>

            <Typography variant="h6" component="h1" gutterBottom align="center">
                Catalogues
            </Typography>
            <Box sx={{ width: '100%', mt: 2, align: 'center', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    variant={isMobile ? "scrollable" : "standard"}
                    onChange={handleTabChange}
                    centered={true}
                    aria-label="Catalogue management tabs"
                >
                    <Tab label="Countries" value={0} />
                    <Tab label="States" value={1} />
                    <Tab label="Cities" value={2} />
                    <Tab label="Facilities" value={3} />
                </Tabs>
                {
                    tabValue === 0 && <CountryManager 
                    countries={countries} 
                    callback={setCountries}
                    onUpdate={handleLocationUpdate} />
                }
                {
                    tabValue === 1 && <StatesManager 
                        states={states}
                        countries={countries} 
                        callback={setStates}
                        onUpdate={handleLocationUpdate} />
                }
                {
                    tabValue === 2 && <CitiesManager 
                    cities={cities}
                    states={states}
                    countries={countries}
                    callback={setCities}
                    onUpdate={handleLocationUpdate} />
                }
                {
                    tabValue === 3 && <Facilitymanager 
                    callbackUpdateFacility={setFacilities} 
                    callbackAddFacility={() => {}}
                    facilities={facilities}
                    onUpdate={handleLocationUpdate} />
                }
            </Box>
        </CenteredTemplate>)
}

export default ManageSite;