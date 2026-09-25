import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Locations.css";
import { useSeoMeta } from "@unhead/react";

type LocationType = "country" | "state" | "city";

interface LocationInfo {
  id: string;
  name: string;
  description?: string;
  cover?: string;
}

interface Trip {
  id: string;
  name: string;
  cover?: string;
  initialdate?: string;
  finaldate?: string;
}

interface UseLocationDataResult {
  location: LocationInfo | null;
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.adondevamos.net";

function useLocationData(type: LocationType, id: string): UseLocationDataResult {
    
  const [location, setLocation] = useState<LocationInfo | null>(null);
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
        const [locationRes, tripsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/locations/${type}/${id}`),
          fetch(`${API_BASE_URL}/locations/${type}/${id}/trips`),
        ]);

        if (!locationRes.ok) {
          throw new Error(`Failed to fetch location: ${locationRes.status}`);
        }
        if (!tripsRes.ok) {
          throw new Error(`Failed to fetch trips: ${tripsRes.status}`);
        }

        const locationData: LocationInfo = await locationRes.json();
        const tripsData: Trip[] = await tripsRes.json();

        if (isMounted) {
          setLocation(locationData);
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

  return { location, trips, loading, error };
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
  const { location, trips, loading, error } = useLocationData(
    (type as LocationType) || "city",
    id || ""
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="page-container">
        <div className="error-message">Ubicación no encontrada.</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="location-header">
        {location.cover && (
          <img
            src={location.cover}
            alt={location.name}
            className="location-hero-image"
          />
        )}
        <div className="location-header-overlay">
          <h1 className="location-title">{location.name}</h1>
          {location.description && (
            <p className="location-description">{location.description}</p>
          )}
        </div>
      </div>

      <section className="trips-section">
        <h2 className="section-title">Viajes en {location.name}</h2>

        {trips.length === 0 ? (
          <p className="no-trips-message">
            No hay viajes disponibles en esta ubicación.
          </p>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card">
                {trip.cover && (
                  <img
                    src={trip.cover}
                    alt={trip.name}
                    className="trip-card-image"
                  />
                )}
                <div className="trip-card-content">
                  <h3 className="trip-card-title">{trip.name}</h3>
                  {trip.initialdate && (
                    <p className="trip-card-date">{trip.initialdate}</p>
                  )}
                  {trip.finaldate && (
                    <p className="trip-card-date">{trip.finaldate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Locations;
