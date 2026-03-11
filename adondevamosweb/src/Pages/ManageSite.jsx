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

 function ManageSite(){
    const auth = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = useState(0);
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
                
                setFacilities(data.facilities);
                setCountries(data.countries);
                setStates(data.states);
                setCities(data.cities);
                
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
                    callback={setCountries} />
                }
                {
                    tabValue === 1 && <StatesManager 
                        states={states}
                        countries={countries} 
                        callback={setStates} />
                }
                {
                    tabValue === 2 && <CitiesManager 
                    cities={cities}
                    states={states}
                    countries={countries}
                    callback={setCities} />
                }
                {
                    tabValue === 3 && <Facilitymanager 
                    callbackUpdateFacility={setFacilities} 
                    callbackAddFacility={() => {}}
                    facilities={facilities} />
                }
            </Box>
        </CenteredTemplate>)
}

export default ManageSite;