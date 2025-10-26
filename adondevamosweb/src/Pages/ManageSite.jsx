import { useState } from 'react';
import 
    {
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Tab,
        Tabs,
        Box 
    } from '@mui/material';

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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <CenteredTemplate>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Site Management
            </Typography>
            <Typography variant="body1" component="body1" gutterBottom align="center" sx={{ mb: 4 }}>
                Welcome, {auth.usertag} 
            </Typography>
            
            <Facilitymanager />

            <Typography variant="h6" component="h1" gutterBottom align="center">
                Ubications
            </Typography>
            <Box sx={{ width: '100%', mt: 2, align: 'center', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    variant={isMobile ? "scrollable" : "standard"}
                    onChange={handleTabChange}
                    centered={!isMobile}
                    scrollButtons={isMobile ? "auto" : false}
                    aria-label="Ubication management tabs"
                >
                    <Tab label="Countries" value={0} />
                    <Tab label="States" value={1} />
                    <Tab label="Cities" value={2} />
                </Tabs>
                {tabValue === 0 && <CountryManager />}
                {tabValue === 1 && <StatesManager />}
                {tabValue === 2 && <CitiesManager />}
            </Box>
        </CenteredTemplate>)
}

export default ManageSite;