import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../Resources/config';

const useProfileById = (userId) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch profile data (includes user info, trips, and voting stats)
        const profileResponse = await axios.get(
          `${config.api.baseUrl}${config.api.endpoints.Users}/${userId}/Profile`,
          { withCredentials: true }
        );

        if (profileResponse.status !== 200) {
          throw new Error('Failed to fetch profile data');
        }

        const data = profileResponse.data.info;

        setProfileData({
          user: data.user || {},
          createdTrips: data.createdTrips || [],
          votedTrips: data.votedTrips || [],
          voteCounts: data.voteCounts || { trips: 0, places: 0 }
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profileData, loading, error };
};

export default useProfileById;
