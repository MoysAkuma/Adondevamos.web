import React from "react";
import {useState, useEffect } from "react";
import { Edit, Delete, Check, ExpandMore, ExpandLess } from "@mui/icons-material"
import  SearchIcon 
    from '@mui/icons-material/Search'
import { TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    ButtonGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Box,
    Collapse,
    Divider,
    Tooltip
 } from "@mui/material";

function PlaceFilter({
    searchMethod,
    countries = [],
    states = [],
    cities = [],
    facilitiesOptions = []
}){
    const [filters, setFilters] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : []
    });

    const [selectedFilters, setSelectedFilters] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : []
    });

    const [showInput, setShowInput] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : null
    });

    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const [filtered, setFiltered] = useState(false);

    const formatDate = (dateString) => {
    if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const inputController=(name,field, type, options = []) => {
        if (type === "text"){
            return (
                <TextField
                    variant="outlined"
                    type={type || "text"}
                    name={field}
                    value={filters[field] || ''}
                    onChange={handleChange}
                    size="small"
                    slotProps={
                    {
                        input: {
                            endAdornment: (
                                <InputAdornment 
                                position="end"
                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                onClick={ (e) => { e.preventDefault(); setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); changeShowInput(field)(); } }>
                                    <Check />
                                </InputAdornment>
                            )
                        }
                    }}
                /> 
            );
        }
        
        if (type === "select") {
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
                                onClick={ (e) => { 
                                    e.preventDefault(); 
                                    setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                                    changeShowInput(field)(); 
                                } }>
                                <Check />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">
                            <em>Select {name}</em>
                        </MenuItem>
                        {options.map((option) => (
                            <MenuItem key={option.id || option.value} value={option.id || option.value}>
                                {option.name || option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        
        if (type === "checkbox") {
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
                        onClick={ (e) => { 
                            e.preventDefault(); 
                            setSelectedFilters((prev) => ({...prev, [field]: filters[field]})); 
                            changeShowInput(field)(); 
                        } }>
                        <Check />
                    </IconButton>
                </FormGroup>
            );
        }
        
    };

    const filterOptionHandler = (field, name, type, options = []) => {
        return (<>
            <b>{name}: </b>
            { showInput[field] ? (  inputController(name, field, type, options) ) : 
            (
            <>
                {  ( selectedFilters[field] ) ? (
                    field.includes("date") ? 
                    formatDate(selectedFilters[field]) :
                    Array.isArray(selectedFilters[field]) && selectedFilters[field].length > 0 ?
                        selectedFilters[field].map((val) => {
                            const opt = options.find(o => (o.id || o.value) === val);
                            return opt ? (opt.name || opt.label) : val;
                        }).join(", ") :
                    type === "select" && options.length > 0 ?
                        (() => {
                            const opt = options.find(o => (o.id || o.value) === selectedFilters[field]);
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
                    onClick={ changeShowInput(field)}
                    sx={{ ml: 0.5, p: 0.25 }}
                >
                    <Edit fontSize="inherit" />
                </IconButton>
            </>
            )
            }
            
            </>
        );
    }
    //handle change of filters
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
        switch(name){
            case "countryid":
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    stateid: null,
                    cityid: null
                }));
                setSelectedFilters((prevSelected) => ({
                    ...prevSelected,
                    stateid: null,
                    cityid: null
                }));
                setFilteredStates(states.filter(s => s.countryid === value));
                setFilteredCities([]);
                break;
            case "stateid":
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    cityid: null
                }));
                setSelectedFilters((prevSelected) => ({
                    ...prevSelected,
                    cityid: null
                }));
                setFilteredCities(cities.filter(c => c.stateid === value));
                break;  
            default:
                break;
        }
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
    
    const showInputFilters = (e) => {
        const { name } = e.target;
        setShowInput((prevShowInput) => ({
            ...prevShowInput,
            [name]: !prevShowInput[name],
        }));
    };

    const changeShowInput = (field) => (e) => {
        if(e) e.preventDefault();
        setShowInput((prevShowInput) => ({
            ...prevShowInput,
            [field]: !prevShowInput[field],
        }));
    };  

    const clearFilters = () => {
        setFilters({
            name: null,
            countryid: null,
            stateid: null,
            cityid: null,
            facilities : []
        });
        setSelectedFilters({
            name: null,
            countryid: null,
            stateid: null,
            cityid: null,
            facilities : []
        });
        setFilteredStates([]);
        setFilteredCities([]);
        setFiltered(false);
    }
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">Filters</Typography>
                <IconButton 
                    onClick={() => setShowFilters(!showFilters)}
                    size="small"
                >
                    {showFilters ? 
                        <ExpandLess /> : 
                        <> <Tooltip title="Show Filters"><ExpandMore /></Tooltip></>}
                </IconButton>
            </Box>
            
            <Collapse in={showFilters}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>{ filterOptionHandler("name", "Place Name", "text") }</Box>
                    <Box>{ filterOptionHandler("countryid", "Country", "select", countries) }</Box>
                    <Box>{ filterOptionHandler("stateid", "State","select", filteredStates) }</Box>
                    <Box>{ filterOptionHandler("cityid", "City", "select", filteredCities) }</Box>
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
                        startIcon={ <SearchIcon /> }
                        onClick={ 
                            (e) => { 
                                e.preventDefault(); 
                                searchMethod(filters)
                            }
                        } 
                    >
                        {
                            filtered ? "Search with Filters" : "Search"
                        }
                    </Button>
                    <Button 
                        variant="outlined"  
                        startIcon={ <Delete /> }
                        onClick={ (e) => { 
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

export default PlaceFilter;