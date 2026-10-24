import { useState, useEffect } from 'react';
import { useSeoMeta } from '@unhead/react';
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
import { useTranslation } from 'react-i18next';

 function ManageSite(){
    const { t } = useTranslation();
    useSeoMeta({
        title: t('admin.pageTitle'),
        description: t('admin.pageDescription'),
        ogTitle: t('admin.pageTitle'),
    });
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
                {t('admin.siteManagement')}
            </Typography>
            <Typography variant="body1" component="p" gutterBottom align="center" sx={{ mb: 4 }}>
                {t('admin.welcome', { name: auth.usertag })}
            </Typography>

            <Typography variant="h6" component="h1" gutterBottom align="center">
                {t('admin.catalogues')}
            </Typography>
            <Box sx={{ width: '100%', mt: 2, align: 'center', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    variant={isMobile ? "scrollable" : "standard"}
                    onChange={handleTabChange}
                    centered={true}
                    aria-label={t('admin.catalogueTabs')}
                >
                    <Tab label={t('admin.countries')} value={0} />
                    <Tab label={t('admin.states')} value={1} />
                    <Tab label={t('admin.cities')} value={2} />
                    <Tab label={t('admin.facilities')} value={3} />
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