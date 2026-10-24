import React, { useMemo } from "react";
import { useAuth } from '../../context/AuthContext';
import GenericFilter from '../Commons/GenericFilter';
import useCatalogues from '../../hooks/useCatalogues';

export default function TripFilters({ searchMethod }) {
    const { isLogged, loading } = useAuth();
    const { countries, states, cities } = useCatalogues();

    // Configure filters for trips
    const filterConfig = useMemo(() => [
        { 
            field: 'name', 
            label: 'Trip Name', 
            type: 'text' 
        },
        { 
            field: 'initialdate', 
            label: 'Initial Date', 
            type: 'date' 
        },
        { 
            field: 'finaldate', 
            label: 'Final Date', 
            type: 'date' 
        },
        { 
            field: 'countryid', 
            label: 'Country', 
            type: 'select', 
            options: countries,
            cascade: {
                resetFields: ['stateid', 'cityid'],
                filterField: 'stateid',
                sourceField: 'countryid',
                sourceData: states,
                subsequentFilters: ['cityid']
            }
        },
        { 
            field: 'stateid', 
            label: 'State', 
            type: 'select', 
            options: states,
            cascade: {
                resetFields: ['cityid'],
                filterField: 'cityid',
                sourceField: 'stateid',
                sourceData: cities
            }
        },
        { 
            field: 'cityid', 
            label: 'City', 
            type: 'select', 
            options: cities 
        },
        { 
            field: 'mytrips', 
            label: 'My Trips', 
            type: 'checkbox',
            requireAuth: true
        },
        { 
            field: 'membertrips', 
            label: 'Trips I\'m In', 
            type: 'checkbox',
            requireAuth: true
        }
    ], [countries, states, cities]);

    return (
        <GenericFilter
            onSearch={searchMethod}
            filterConfig={filterConfig}
            title="Trip Filters"
            defaultExpanded={false}
            showAuthFilters={isLogged && !loading}
        />
    );
}
