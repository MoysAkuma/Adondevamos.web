import { useState, useCallback } from 'react';

/**
 * Generic search hook for managing search state and operations
 * @param {Function} searchFunction - The API function to call for searching
 * @param {Object} options - Configuration options
 * @returns {Object} - Search state and methods
 */
export const useSearch = (searchFunction, options = {}) => {
  const [results, setResults] = useState(options.initialResults || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(
    async (filters) => {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await searchFunction(filters);
        const data = response.data?.info || response.data || [];
        setResults(data);
        setIsLoading(false);
        return { success: true, data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Search failed';
        const status = err.response?.status;
        
        setError({ message: errorMessage, status });
        setIsLoading(false);
        
        // Clear results on 404 but keep them for other errors
        if (status === 404) {
          setResults([]);
        }
        
        return { success: false, error: { message: errorMessage, status } };
      }
    },
    [searchFunction]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  const reset = useCallback(() => {
    setResults(options.initialResults || []);
    setError(null);
    setIsLoading(false);
    setHasSearched(false);
  }, [options.initialResults]);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
    reset,
    hasResults: results.length > 0
  };
};

export default useSearch;
