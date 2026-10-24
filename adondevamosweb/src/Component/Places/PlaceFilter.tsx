import React, { useMemo } from "react";
import GenericFilter from "../Commons/GenericFilter";

function PlaceFilter({
    searchMethod,
    countries = [],
    states = [],
    cities = [],
    facilitiesOptions = []
}){
    // Configure filters for places
    const filterConfig = useMemo(() => [
        { 
            field: 'name', 
            label: 'Place Name', 
            type: 'text' 
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
            field: 'facilities', 
            label: 'Facilities', 
            type: 'checkbox', 
            options: facilitiesOptions 
        }
    ], [countries, states, cities, facilitiesOptions]);

    return (
        <GenericFilter
            onSearch={searchMethod}
            filterConfig={filterConfig}
            title="Place Filters"
            defaultExpanded={false}
        />
    );
}

export default PlaceFilter;