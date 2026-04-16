import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../Resources/config';

/**
 * Custom hook to manage catalogues with session storage caching
 * @param {Object} options - Configuration options
 * @param {number} options.cacheExpirationMinutes - Cache expiration time in minutes (default: from config or 60)
 * @param {boolean} options.forceRefresh - Force refresh from API (default: false)
 * @returns {Object} - Catalogues data and utility functions
 */
const useCatalogues = (options = {}) => {
    const {
        cacheExpirationMinutes = config.cache?.cataloguesExpirationMinutes || 60, // Use config or default to 60 minutes
        forceRefresh = false
    } = options;

    const STORAGE_KEY = 'adondevamos_catalogues';
    const STORAGE_TIMESTAMP_KEY = 'adondevamos_catalogues_timestamp';
    
    const [catalogues, setCatalogues] = useState({
        countries: [],
        states: [],
        cities: [],
        facilities: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    /**
     * Check if cached data is still valid
     */
    const isCacheValid = useCallback(() => {
        try {
            const timestamp = sessionStorage.getItem(STORAGE_TIMESTAMP_KEY);
            if (!timestamp) return false;

            const lastUpdate = new Date(timestamp);
            const now = new Date();
            const diffMinutes = (now - lastUpdate) / (1000 * 60);

            return diffMinutes < cacheExpirationMinutes;
        } catch (err) {
            console.error('Error checking cache validity:', err);
            return false;
        }
    }, [cacheExpirationMinutes]);

    /**
     * Load catalogues from session storage
     */
    const loadFromCache = useCallback(() => {
        try {
            const cachedData = sessionStorage.getItem(STORAGE_KEY);
            const cachedTimestamp = sessionStorage.getItem(STORAGE_TIMESTAMP_KEY);
            
            if (cachedData && cachedTimestamp) {
                const parsedData = JSON.parse(cachedData);
                setCatalogues(parsedData);
                setLastUpdated(new Date(cachedTimestamp));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error loading catalogues from cache:', err);
            return false;
        }
    }, []);

    /**
     * Save catalogues to session storage
     */
    const saveToCache = useCallback((data) => {
        try {
            const timestamp = new Date().toISOString();
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            sessionStorage.setItem(STORAGE_TIMESTAMP_KEY, timestamp);
            setLastUpdated(new Date(timestamp));
        } catch (err) {
            console.error('Error saving catalogues to cache:', err);
        }
    }, []);

    /**
     * Fetch catalogues from API
     */
    const fetchCatalogues = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${config.api.baseUrl}${config.api.endpoints.Catalogues}/all`
            );

            if (response.status === 200 && response.data?.info) {
                const catalogueData = {
                    countries: response.data.info.countries || [],
                    states: response.data.info.states || [],
                    cities: response.data.info.cities || [],
                    facilities: response.data.info.facilities || []
                };

                setCatalogues(catalogueData);
                saveToCache(catalogueData);
                return catalogueData;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching catalogues:', err);
            setError(err.message || 'Failed to fetch catalogues');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [saveToCache]);

    /**
     * Refresh catalogues (force fetch from API)
     */
    const refreshCatalogues = useCallback(async () => {
        return await fetchCatalogues();
    }, [fetchCatalogues]);

    /**
     * Clear cached catalogues
     */
    const clearCache = useCallback(() => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_TIMESTAMP_KEY);
            setCatalogues({
                countries: [],
                states: [],
                cities: [],
                facilities: []
            });
            setLastUpdated(null);
        } catch (err) {
            console.error('Error clearing cache:', err);
        }
    }, []);

    /**
     * Initialize catalogues on mount
     */
    useEffect(() => {
        const initializeCatalogues = async () => {
            // If force refresh, fetch from API
            if (forceRefresh) {
                await fetchCatalogues();
                return;
            }

            // Check if cache is valid
            if (isCacheValid()) {
                const loaded = loadFromCache();
                if (loaded) {
                    setLoading(false);
                    return;
                }
            }

            // Cache is invalid or doesn't exist, fetch from API
            await fetchCatalogues();
        };

        initializeCatalogues();
    }, [forceRefresh, isCacheValid, loadFromCache, fetchCatalogues]);

    return {
        // Catalogues data
        catalogues,
        countries: catalogues.countries,
        states: catalogues.states,
        cities: catalogues.cities,
        facilities: catalogues.facilities,
        
        // State
        loading,
        error,
        lastUpdated,
        
        // Utility functions
        refreshCatalogues,
        clearCache,
        isCacheValid: isCacheValid()
    };
};

export default useCatalogues;
