import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import usePlaceQueryApi from '../../hooks/Places/usePlaceQueryApi';

import 
    {
        Stack,
        Paper,
        Divider,
        Card,
        CardHeader,
        CardContent,
        CardActions,
        Skeleton
    } from '@mui/material';

function NewPlaces() {
    const { getLatestPlaces } = usePlaceQueryApi();
    //loading
    const [isLoading, setIsLoading] = useState(false);

    const [NewPlacesList, setNewPlacesList] = useState([]);

    const renderPlaceCardSkeleton = (key) => (
        <Card key={key} sx={{ borderRadius: 1 }}>
            <CardHeader
                title={<Skeleton variant="text" width="60%" />}
                subheader={<Skeleton variant="text" width="40%" />}
                action={<Skeleton variant="circular" width={32} height={32} />}
            />
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="75%" />
            </CardContent>
            <CardActions sx={{ gap: 1, px: 2, pb: 2 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
            </CardActions>
        </Card>
    );
    
    //getNewPlaces
    const getNewPlaces = async() => {
        setIsLoading(true);

        try {
            const resp = await getLatestPlaces(3);
            setNewPlacesList(resp.data.info);
        }
        catch(error) {
            console.error("Error getting last created places", error);
            setNewPlacesList([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
      let mounted = true;
      if (mounted) getNewPlaces();
      return () => {
        mounted = false
      }
    }, []);

    return (
        <>
       
            <Stack spacing={2} 
            divider={<Divider />}
            sx={{ overflowX: 'auto' }}>
                {isLoading ? (
                    [1, 2, 3].map((skeletonId) => renderPlaceCardSkeleton(skeletonId))
                ) : (
                    NewPlacesList.length > 0 ? NewPlacesList.map(
                        (place) => (
                            <PlaceCard key={place.id} 
                            placeinfo={place} />
                        )
                    ) :
                    (<></>)
                )}
            </Stack>
      
      </>
    );
}

export default NewPlaces;