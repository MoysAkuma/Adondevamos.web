import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../../Resources/config';

const VALID_ENTITY_TYPES = ['trips', 'places', 'itineraries'];

const useRankingApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rankingData, setRankingData] = useState(null);

    const getRanking = useCallback(async (entityType, limit = 3) => {
        // Validate entity type
        if (!VALID_ENTITY_TYPES.includes(entityType)) {
            setError(`Invalid entity type. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}`);
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `${config.api.baseUrl}${config.api.endpoints.Ranking}/${entityType}`;
            const response = await axios.get(url, {
                params: { limit }
            });

            if (response.status === 200) {
                setRankingData(response.data.info);
                return response.data.info;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch ranking';
            setError(errorMessage);
            console.error('Error fetching ranking:', err);
        } finally {
            setLoading(false);
        }

        return null;
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        rankingData,
        getRanking,
        clearError,
        validEntityTypes: VALID_ENTITY_TYPES
    };
};

export default useRankingApi;
