import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import 
    {
        Typography,
        Box,
        CircularProgress,
        Alert,
        Stack,
        Tooltip
    } from '@mui/material';

import config from "../../Resources/config";
import FacilityIcon from './FacilityIcon';

function ViewPlace(){
    //Get id
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [placeInfo, setPlaceInfo] = useState(null);

    //URLS
    const URLsCatalogService = {
        Places:`${config.api.baseUrl}${config.api.endpoints.Places}`
    };
    
    useEffect(() => {
        const fetchPlace = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get(`${URLsCatalogService.Places}/${id}`);
                setPlaceInfo(response.data.info);
            } catch (err) {
                console.error("Error getting place info:", err);
                setError(err.response?.data?.message || 'Failed to fetch place');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlace();
    }, [id]); // id is the only dependency needed

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
            </Alert>
        );
    }
    
    if (!placeInfo) {
        return (
            <Alert severity="warning" sx={{ mt: 2 }}>
                Place not found
            </Alert>
        );
    }
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}
        >
            <Typography variant="h4" component="h4" gutterBottom align="center">
                {
                    placeInfo.name
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="left">
                Description
            </Typography>
            
            <Typography variant="body1" component="body1" align="right">
                {
                    placeInfo.description
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="left">
                Address
            </Typography>
            <Typography variant="body1" component="body1" align="right">
                {placeInfo.address}
            </Typography>

            <Typography gutterBottom variant="h6" component="div" align="left">
                Ubication
            </Typography>

            <Typography gutterBottom variant="body1" component="div" align="right">
                {placeInfo.City.name}, {placeInfo.State.name}, {placeInfo.Country.name}
            </Typography>

            <Typography variant="h6" component="div" align="center">
                Facilities
            </Typography>
            {
                placeInfo.facilities.length !== 0 ? 
                (
                    <Stack 
                        direction="row" 
                        spacing={2} 
                        flexWrap="wrap" 
                        useFlexGap 
                        alignSelf="center"
                        >
                        {
                            placeInfo.facilities.map((facility) => (
                                
                                <FacilityIcon 
                                key={facility.code} 
                                code={facility.code} 
                                titleAccess={facility.name}
                                color="white"
                                fontSize="x-large"
                            />
                        ))}
                    </Stack>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No facilities to show.
                    </Alert>
                )
            }

        </Box>
    );
}
export default ViewPlace;