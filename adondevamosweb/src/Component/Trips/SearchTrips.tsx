import React, { useState, useCallback } from "react";
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TripFilters from "./TripFilters";
import TripsResultSearch from "./TripsResultSearch";
import Pagination from "../Commons/Pagination";
import { useTripQueryApi } from '../../hooks/Trips/useTripQueryApi';

export default function SearchTrips() {
    const { searchTrips } = useTripQueryApi();
    const [limit, setLimit] = useState(10);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentFilters, setCurrentFilters] = useState({});
    
    // Pagination state from API
    const [paginationData, setPaginationData] = useState({
        page: 1,
        limit: limit,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const handleSearch = useCallback(async (filters, page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await searchTrips(filters, page, limit);
            if (response.data?.info) {
                setTrips(response.data.info);
                setCurrentFilters(filters);
                
                // Update pagination from API response
                if (response.data.pagination) {
                    setPaginationData(response.data.pagination);
                } else {
                    // Fallback if no pagination data
                    setPaginationData({
                        page,
                        limit,
                        totalCount: response.data.info.length,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false
                    });
                }
            } else {
                setTrips([]);
                setPaginationData({
                    page: 1,
                    limit: 10,
                    totalCount: 0,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false
                });
            }
        } catch (err) {
            console.error('Search error:', err);
            if (err.response?.status === 404) {
                setTrips([]);
                setError('No trips found matching your criteria.');
            } else {
                setError(err.response?.data?.message || 'Failed to search trips. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [searchTrips]);

    const handlePageChange = useCallback((newPage) => {
        handleSearch(currentFilters, newPage, paginationData.limit);
    }, [currentFilters, paginationData.limit, handleSearch]);

    const handleLimitChange = useCallback((newLimit) => {
        handleSearch(currentFilters, 1, newLimit); // Reset to page 1 when changing limit
    }, [currentFilters, handleSearch]);

    const goToFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
    const goToLastPage = useCallback(() => handlePageChange(paginationData.totalPages), [handlePageChange, paginationData.totalPages]);
    const nextPage = useCallback(() => {
        if (paginationData.hasNextPage) {
            handlePageChange(paginationData.page + 1);
        }
    }, [paginationData.hasNextPage, paginationData.page, handlePageChange]);
    const prevPage = useCallback(() => {
        if (paginationData.hasPreviousPage) {
            handlePageChange(paginationData.page - 1);
        }
    }, [paginationData.hasPreviousPage, paginationData.page, handlePageChange]);

    const getPageNumbers = useCallback(() => {
        const pages = [];
        const showPages = 5;
        let startPage = Math.max(1, paginationData.page - Math.floor(showPages / 2));
        let endPage = Math.min(paginationData.totalPages, startPage + showPages - 1);
        
        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    }, [paginationData.page, paginationData.totalPages]);

    const startItem = Math.min((paginationData.page - 1) * paginationData.limit + 1, paginationData.totalCount);
    const endItem = Math.min(paginationData.page * paginationData.limit, paginationData.totalCount);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Search Trips</Typography>
            
            <TripFilters searchMethod={(filters) => handleSearch(filters, 1, paginationData.limit)} />
            
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            
            {error && (
                <Alert severity="info" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}
            
            {!loading && !error && trips.length > 0 && (
                <>
                    <TripsResultSearch results={trips} />
                    
                    <Pagination
                        currentPage={paginationData.page}
                        totalPages={paginationData.totalPages}
                        itemsPerPage={paginationData.limit}
                        pageSizeOptions={[5, 10, 20, 50]}
                        totalItems={paginationData.totalCount}
                        startItem={startItem}
                        endItem={endItem}
                        hasNextPage={paginationData.hasNextPage}
                        hasPrevPage={paginationData.hasPreviousPage}
                        goToPage={handlePageChange}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        goToFirstPage={goToFirstPage}
                        goToLastPage={goToLastPage}
                        changeItemsPerPage={handleLimitChange}
                        getPageNumbers={getPageNumbers}
                    />
                </>
            )}
            
            {!loading && !error && trips.length === 0 && (
                <Alert severity="info" sx={{ my: 2 }}>
                    No trips found. Try adjusting your search filters.
                </Alert>
            )}
        </Box>
    );
}