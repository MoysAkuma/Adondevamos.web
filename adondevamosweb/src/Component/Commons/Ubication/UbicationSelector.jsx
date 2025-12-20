import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    FormHelperText
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

/**
 * UbicationSelector - A reusable component for selecting Country, State, and City
 * 
 * @param {Object} props
 * @param {Object} props.allCatalogues - Object containing countries, states, and cities arrays
 * @param {Object} props.selectedValues - Object with countryid, stateid, cityid
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {boolean} props.required - Whether fields are required
 * @param {string} props.size - Size of the select components ('small' | 'medium')
 * @param {boolean} props.showLabels - Whether to show labels above selects
 * @param {string} props.variant - Variant of select ('outlined' | 'standard' | 'filled')
 */
function UbicationSelector({ 
    allCatalogues = {}, 
    selectedValues = { countryid: 0, stateid: 0, cityid: 0 },
    onChange,
    required = false,
    size = 'medium',
    showLabels = true,
    variant = 'outlined',
    showIcon = true,
    error = null
}) {
    const [catCountries, setCatCountries] = useState([]);
    const [catStates, setCatStates] = useState([]);
    const [catCities, setCatCities] = useState([]);

    // Initialize catalogues
    useEffect(() => {
        if (allCatalogues.countries) {
            setCatCountries(allCatalogues.countries);
        }
    }, [allCatalogues.countries]);

    // Update states when country changes
    useEffect(() => {
        if (selectedValues.countryid && allCatalogues.states) {
            const filteredStates = allCatalogues.states.filter(
                state => state.countryid == selectedValues.countryid
            );
            setCatStates(filteredStates);
        } else {
            setCatStates([]);
        }
    }, [selectedValues.countryid, allCatalogues.states]);

    // Update cities when state changes
    useEffect(() => {
        if (selectedValues.stateid && allCatalogues.cities) {
            const filteredCities = allCatalogues.cities.filter(
                city => city.stateid == selectedValues.stateid
            );
            setCatCities(filteredCities);
        } else {
            setCatCities([]);
        }
    }, [selectedValues.stateid, allCatalogues.cities]);

    const handleCountryChange = (e) => {
        const value = e.target.value;
        onChange({
            countryid: value,
            stateid: 0,
            cityid: 0
        });
    };

    const handleStateChange = (e) => {
        const value = e.target.value;
        onChange({
            ...selectedValues,
            stateid: value,
            cityid: 0
        });
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        onChange({
            ...selectedValues,
            cityid: value
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {showLabels && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {showIcon && <LocationOn color="action" />}
                    <Typography variant="h6" component="h6">
                        Location
                    </Typography>
                </Box>
            )}

            {/* Country Select */}
            <FormControl 
                fullWidth 
                required={required}
                size={size}
                variant={variant}
                error={error?.country}
            >
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                    labelId="country-label"
                    id="countryid"
                    name="countryid"
                    value={selectedValues.countryid || ''}
                    onChange={handleCountryChange}
                    label="Country"
                >
                    <MenuItem value="">
                        <em>Select a country</em>
                    </MenuItem>
                    {catCountries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
                {error?.country && (
                    <FormHelperText>{error.country}</FormHelperText>
                )}
            </FormControl>

            {/* State Select */}
            {selectedValues.countryid && catStates.length > 0 ? (
                <FormControl 
                    fullWidth 
                    required={required}
                    size={size}
                    variant={variant}
                    error={error?.state}
                >
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                        labelId="state-label"
                        id="stateid"
                        name="stateid"
                        value={selectedValues.stateid || ''}
                        onChange={handleStateChange}
                        label="State"
                    >
                        <MenuItem value="">
                            <em>Select a state</em>
                        </MenuItem>
                        {catStates.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                                {state.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {error?.state && (
                        <FormHelperText>{error.state}</FormHelperText>
                    )}
                </FormControl>
            ) : selectedValues.countryid ? (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    No states available for selected country
                </Typography>
            ) : null}

            {/* City Select */}
            {selectedValues.stateid && catCities.length > 0 ? (
                <FormControl 
                    fullWidth 
                    required={required}
                    size={size}
                    variant={variant}
                    error={error?.city}
                >
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                        labelId="city-label"
                        id="cityid"
                        name="cityid"
                        value={selectedValues.cityid || ''}
                        onChange={handleCityChange}
                        label="City"
                    >
                        <MenuItem value="">
                            <em>Select a city</em>
                        </MenuItem>
                        {catCities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {error?.city && (
                        <FormHelperText>{error.city}</FormHelperText>
                    )}
                </FormControl>
            ) : selectedValues.stateid ? (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    No cities available for selected state
                </Typography>
            ) : null}
        </Box>
    );
}

export default UbicationSelector;