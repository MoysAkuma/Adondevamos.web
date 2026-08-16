import React, { useState, useEffect } from "react";
import { 
    Edit, 
    Delete, 
    Check, 
    ExpandMore, 
    ExpandLess 
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { 
    TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    ButtonGroup,
    Select,
    MenuItem,
    FormControl,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Box,
    Collapse,
    Divider,
    Tooltip
} from "@mui/material";

/**
 * Generic reusable filter component
 * @param {Object} props
 * @param {Function} props.onSearch - Callback function when search is clicked
 * @param {Array} props.filterConfig - Array of filter configurations
 * @param {string} props.title - Title for the filter section (default: "Filters")
 * @param {boolean} props.defaultExpanded - Whether filters are expanded by default (default: false)
 * @param {boolean} props.showAuthFilters - Whether to show auth-specific filters (default: false)
 * 
 * Filter Config Example:
 * [
 *   { field: 'name', label: 'Name', type: 'text' },
 *   { field: 'countryid', label: 'Country', type: 'select', options: countries },
 *   { field: 'startdate', label: 'Start Date', type: 'date' },
 *   { field: 'facilities', label: 'Facilities', type: 'checkbox', options: facilitiesOptions },
 *   { field: 'mytrips', label: 'My Trips', type: 'checkbox', requireAuth: true }
 * ]
 */
function GenericFilter({
    onSearch,
    filterConfig = [],
    title = "Filters",
    defaultExpanded = false,
    showAuthFilters = false
}) {
    // Initialize filters and state from config
    const initializeState = () => {
        const state = {};
        filterConfig.forEach(config => {
            if (config.type === 'checkbox' && !config.options) {
                state[config.field] = false;
            } else if (config.type === 'checkbox' && config.options) {
                state[config.field] = [];
            } else {
                state[config.field] = null;
            }
        });
        return state;
    };

    const [filters, setFilters] = useState(initializeState());
    const [selectedFilters, setSelectedFilters] = useState(initializeState());
    const [showInput, setShowInput] = useState(
        Object.fromEntries(filterConfig.map(c => [c.field, null]))
    );
    const [showFilters, setShowFilters] = useState(defaultExpanded);
    const [filtered, setFiltered] = useState(false);

    // Dynamic filtered options for location cascade
    const [filteredOptions, setFilteredOptions] = useState({});

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setSelectedFilters((prevSelected) => ({
            ...prevSelected,
            [name]: value,
        }));

        // Handle location cascade logic
        const config = filterConfig.find(c => c.field === name);
        if (config?.cascade) {
            handleCascade(name, value, config.cascade);
        }

        // Check if any filter is applied
        const anyFilterApplied = Object.keys(filters).some((key) => {
            if (key === name) {
                return value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
            } else {
                const filterValue = filters[key];
                return filterValue !== null && filterValue !== '' && !(Array.isArray(filterValue) && filterValue.length === 0);
            }
        });
        setFiltered(anyFilterApplied);
    };

    const handleCascade = (parentField, parentValue, cascadeConfig) => {
        const { resetFields, filterField, sourceField, sourceData } = cascadeConfig;
        
        // Reset dependent fields
        if (resetFields && resetFields.length > 0) {
            const resetState = {};
            resetFields.forEach(field => {
                resetState[field] = null;
            });
            setFilters(prev => ({ ...prev, ...resetState }));
            setSelectedFilters(prev => ({ ...prev, ...resetState }));
        }

        // Filter options for next level
        if (filterField && sourceField && sourceData) {
            const filtered = sourceData.filter(item => item[sourceField] === parentValue);
            setFilteredOptions(prev => ({
                ...prev,
                [filterField]: filtered
            }));
            
            // Clear subsequent levels
            const subsequentFilters = cascadeConfig.subsequentFilters || [];
            const clearState = {};
            subsequentFilters.forEach(field => {
                clearState[field] = [];
            });
            setFilteredOptions(prev => ({ ...prev, ...clearState }));
        }
    };

    const handleCheckboxChange = (field, value, checked) => {
        setFilters((prevFilters) => {
            const currentValues = prevFilters[field] || [];
            if (checked) {
                return { ...prevFilters, [field]: [...currentValues, value] };
            } else {
                return { ...prevFilters, [field]: currentValues.filter(v => v !== value) };
            }
        });
    };

    const changeShowInput = (field) => (e) => {
        if (e) e.preventDefault();
        setShowInput((prevShowInput) => ({
            ...prevShowInput,
            [field]: !prevShowInput[field],
        }));
    };

    const inputController = (config) => {
        const { field, label, type, options = [] } = config;
        
        if (type === "text" || type === "date") {
            return (
                <TextField
                    variant="outlined"
                    type={type}
                    name={field}
                    value={filters[field] || ''}
                    onChange={handleChange}
                    size="small"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment 
                                    position="end"
                                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                                        changeShowInput(field)(); 
                                    }}
                                >
                                    <Check />
                                </InputAdornment>
                            )
                        }
                    }}
                /> 
            );
        }
        
        if (type === "select") {
            const selectOptions = filteredOptions[field] || options;
            return (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                        name={field}
                        value={filters[field] || ''}
                        onChange={handleChange}
                        displayEmpty
                        endAdornment={
                            <InputAdornment 
                                position="end"
                                style={{ cursor: 'pointer', marginRight: '25px' }}
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                                    changeShowInput(field)(); 
                                }}
                            >
                                <Check />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">
                            <em>Select {label}</em>
                        </MenuItem>
                        {selectOptions.map((option) => (
                            <MenuItem key={option.id || option.value} value={option.id || option.value}>
                                {option.name || option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        
        if (type === "checkbox") {
            // Single checkbox (boolean)
            if (!options || options.length === 0) {
                return (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters[field] || false}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFilters((prev) => ({ ...prev, [field]: checked }));
                                    }}
                                    size="small"
                                />
                            }
                            label=""
                        />
                        <IconButton 
                            size="small"
                            onClick={(e) => { 
                                e.preventDefault(); 
                                setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                                changeShowInput(field)(); 
                            }}
                        >
                            <Check />
                        </IconButton>
                    </>
                );
            }
            
            // Multiple checkboxes (array)
            return (
                <FormGroup>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.id || option.value}
                            control={
                                <Checkbox
                                    checked={filters[field]?.includes(option.id || option.value) || false}
                                    onChange={(e) => handleCheckboxChange(field, option.id || option.value, e.target.checked)}
                                    size="small"
                                />
                            }
                            label={option.name || option.label}
                        />
                    ))}
                    <IconButton 
                        size="small"
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                            changeShowInput(field)(); 
                        }}
                    >
                        <Check />
                    </IconButton>
                </FormGroup>
            );
        }
    };

    const filterOptionHandler = (config) => {
        const { field, label, type, options = [] } = config;
        const selectOptions = filteredOptions[field] || options;
        
        return (
            <>
                <b>{label}: </b>
                { showInput[field] ? (
                    inputController(config)
                ) : (
                    <>
                        {selectedFilters[field] !== null && selectedFilters[field] !== undefined && selectedFilters[field] !== '' && selectedFilters[field] !== false ? (
                            field.includes("date") ? 
                                formatDate(selectedFilters[field]) :
                            type === "checkbox" && !options?.length ?
                                (selectedFilters[field] ? "Yes" : "No") :
                            Array.isArray(selectedFilters[field]) && selectedFilters[field].length > 0 ?
                                selectedFilters[field].map((val) => {
                                    const opt = selectOptions.find(o => (o.id || o.value) === val);
                                    return opt ? (opt.name || opt.label) : val;
                                }).join(", ") :
                            type === "select" && selectOptions.length > 0 ?
                                (() => {
                                    const opt = selectOptions.find(o => (o.id || o.value) === selectedFilters[field]);
                                    return opt ? (opt.name || opt.label) : selectedFilters[field];
                                })() :
                                selectedFilters[field]
                        ) : (
                            <span> 
                                None 
                            </span>
                        )}
                        <IconButton 
                            size="small"
                            onClick={changeShowInput(field)}
                            sx={{ ml: 0.5, p: 0.25 }}
                        >
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </>
                )}
            </>
        );
    };

    const clearFilters = () => {
        const clearedState = initializeState();
        setFilters(clearedState);
        setSelectedFilters(clearedState);
        setFilteredOptions({});
        setFiltered(false);
    };

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton 
                    onClick={() => setShowFilters(!showFilters)}
                    size="small"
                >
                    {showFilters ? 
                        <ExpandLess /> : 
                        <Tooltip title="Show Filters"><ExpandMore /></Tooltip>
                    }
                </IconButton>
            </Box>
            
            <Collapse in={showFilters}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {filterConfig.map((config) => {
                        // Skip auth-required filters if not authenticated
                        if (config.requireAuth && !showAuthFilters) {
                            return null;
                        }
                        
                        return (
                            <Box key={config.field}>
                                {filterOptionHandler(config)}
                            </Box>
                        );
                    })}
                </Box>
            </Collapse>
            
            <ButtonGroup 
                variant="contained"
                color="primary"
                fullWidth 
                sx={{ mt: 3 }}
            >
                <Button 
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={(e) => { 
                        e.preventDefault(); 
                        onSearch(filters);
                    }} 
                >
                    {filtered ? "Search with Filters" : "Search"}
                </Button>
                <Button 
                    variant="outlined"  
                    startIcon={<Delete />}
                    onClick={(e) => { 
                        e.preventDefault(); 
                        clearFilters(); 
                    }}
                >
                    Clear
                </Button>
            </ButtonGroup>
        </Paper>
    );
}

export default GenericFilter;
