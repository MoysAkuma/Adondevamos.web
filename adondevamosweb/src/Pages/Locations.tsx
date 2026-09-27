import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSeoMeta } from "@unhead/react";
import CenteredTemplate from '../Component/Commons/CenteredTemplate';
import {
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import PlaceCard from "../Component/Places/PlaceCard";
import TripCard from "../Component/Trips/TripCard";
import {
  PixelTypography,
  StyledBanner,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledSectionCard,
  StyledSectionContent,
  StyledSectionHeader,
  emptyMembersAlertSx,
  errorAlertSx,
  pageLoadingSx,
  sectionHeaderRowSx,
  sectionTitleSx,
  tripDescriptionSx,
  tripTitleSx,
  warningAlertSx
} from "../Css/Trips/trips.styles";

type LocationType = "country" | "state" | "city";

interface LocationInfo {
  id: number;
  name: string;
  description?: string;
  cover?: string;
}

interface Place {
  id: number;
  name: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  cover?: string;
  cover_url?: string;
}

interface Trip {
  id: number;
  name: string;
  cover?: string;
  cover_url?: string;
  description?: string;
  initialdate?: string;
  finaldate?: string;
  ownerid?: number;
}

interface UseLocationDataResult {
  location: LocationInfo | null;
  places: Place[];
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.adondevamos.net";

const cardsGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))"
  },
  gap: 2
};

function useLocationData(type: LocationType, id: string): UseLocationDataResult {
    
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const locationRes = await fetch(`${API_BASE_URL}/locations/${type}/${id}`);

        if (!locationRes.ok) {
          throw new Error(`Failed to fetch location: ${locationRes.status}`);
        }

        const response = await locationRes.json();
        const info = response?.info || response;

        const locationData: LocationInfo = {
          id: Number(info?.id || 0),
          name: info?.name || "Unknown location",
          description: info?.originalname || "",
          cover: info?.cover || ""
        };

        const placesData: Place[] = Array.isArray(info?.places)
          ? info.places.map((place: any) => ({
              id: Number(place?.id || 0),
              name: place?.name || "Unknown place",
              address: place?.address || "",
              latitude: place?.latitude || "",
              longitude: place?.longitude || "",
              cover: place?.cover || place?.cover_url || "",
              cover_url: place?.cover_url || place?.cover || ""
            }))
          : [];

        const tripsData: Trip[] = Array.isArray(info?.trips)
          ? info.trips.map((trip: any) => ({
              id: Number(trip?.id || 0),
              name: trip?.name || "Unknown trip",
              cover: trip?.cover || trip?.cover_url || "",
              cover_url: trip?.cover_url || trip?.cover || "",
              description: trip?.description || "",
              initialdate: trip?.initialdate || "",
              finaldate: trip?.finaldate || "",
              ownerid: Number(trip?.ownerid || 0)
            }))
          : [];

        if (isMounted) {
          setLocation(locationData);
          setPlaces(placesData);
          setTrips(tripsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  return { location, places, trips, loading, error };
}

const Locations: React.FC = () => {
  const { type, id } = useParams<{ type: LocationType; id: string }>();

  useSeoMeta({
      title: 'AdondeVamos - Plan and Share Travel Itineraries',
      description: 'Discover, create, and share travel itineraries and places with AdondeVamos.',
      ogTitle: 'AdondeVamos - Plan and Share Travel Itineraries',
      ogDescription: 'Discover, create, and share travel itineraries and places with AdondeVamos.',
      ogType: 'website',
    });
  const { location, places, trips, loading, error } = useLocationData(
    (type as LocationType) || "city",
    id || ""
  );

  if (loading) {
    return (
      <CenteredTemplate>
        <Box sx={pageLoadingSx}>
          <CircularProgress />
        </Box>
      </CenteredTemplate>
    );
  }

  if (error) {
    return (
      <CenteredTemplate>
        <Alert severity="error" sx={errorAlertSx}>
          Error: {error}
        </Alert>
      </CenteredTemplate>
    );
  }

  if (!location) {
    return (
      <CenteredTemplate>
        <Alert severity="warning" sx={warningAlertSx}>
          Ubicación no encontrada.
        </Alert>
      </CenteredTemplate>
    );
  }

  return (
    <CenteredTemplate>
      <StyledHeaderCard>
        <StyledHeaderContent>
          <PixelTypography variant="h3" sx={tripTitleSx}>
            {location.name}
          </PixelTypography>
          <PixelTypography variant="body1" sx={tripDescriptionSx}>
            {location.description || `Explora lugares y viajes en este ${type || "destino"}.`}
          </PixelTypography>
        </StyledHeaderContent>
      </StyledHeaderCard>

      {location.cover && (
        <StyledBanner image={location.cover} title={location.name} />
      )}

      <StyledSectionCard>
        <StyledSectionHeader>
          <Box sx={sectionHeaderRowSx}>
            <PixelTypography variant="h5" sx={sectionTitleSx}>
              Lugares en {location.name}
            </PixelTypography>
          </Box>
        </StyledSectionHeader>
        <StyledSectionContent>
          {places.length === 0 ? (
            <Alert severity="warning" sx={emptyMembersAlertSx}>
              No hay lugares disponibles en esta ubicación.
            </Alert>
          ) : (
            <Box sx={cardsGridSx}>
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  placeinfo={{
                    id: place.id,
                    name: place.name,
                    description: place.address || "",
                    address: place.address || "",
                    latitude: place.latitude || "0",
                    longitude: place.longitude || "0",
                    Country: null,
                    State: null,
                    City: null,
                    statics: { Votes: { Total: 0 } },
                    facilities: [],
                    gallery: place.cover || place.cover_url
                      ? [{ completeurl: place.cover || place.cover_url }]
                      : []
                  }}
                />
              ))}
            </Box>
          )}
        </StyledSectionContent>
      </StyledSectionCard>

      <StyledSectionCard>
        <StyledSectionHeader>
          <Box sx={sectionHeaderRowSx}>
            <PixelTypography variant="h5" sx={sectionTitleSx}>
              Viajes en {location.name}
            </PixelTypography>
          </Box>
        </StyledSectionHeader>
        <StyledSectionContent>
          {trips.length === 0 ? (
            <Alert severity="warning" sx={emptyMembersAlertSx}>
              No hay viajes disponibles en esta ubicación.
            </Alert>
          ) : (
            <Box sx={cardsGridSx}>
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  tripinfo={{
                    id: trip.id,
                    name: trip.name,
                    description: trip.description || "",
                    initialdate: trip.initialdate || "2000-01-01",
                    finaldate: trip.finaldate || trip.initialdate || "2000-01-01",
                    cover_url: trip.cover || trip.cover_url || "",
                    owner: {
                      id: trip.ownerid || 0,
                      name: "Owner",
                      lastname: "",
                      tag: `@user${trip.ownerid || 0}`
                    },
                    statics: { Votes: { Total: 0 } },
                    itinerary: [],
                    members: [],
                    userVoted: false,
                    gallery: []
                  }}
                />
              ))}
            </Box>
          )}
        </StyledSectionContent>
      </StyledSectionCard>
    </CenteredTemplate>
  );
};

export default Locations;
