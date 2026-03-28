import React from "react";
import { useState, useEffect } from "react";
import { Edit, 
    Delete,
    Check,
    ExpandMore,
    ExpandLess } 
    from '@mui/icons-material';
import  SearchIcon 
    from '@mui/icons-material/Search'
import { TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    ButtonGroup,
    Paper,
    Box,
    Collapse,
    Divider,
    Tooltip,
    Checkbox,
    FormControlLabel
 } from "@mui/material";
 import { useAuth } from '../../context/AuthContext';

export default function TripFilters( { searchMethod } ) {
    const { isLogged, loading } = useAuth();

    const [filters, setFilters] = useState({
        name: null,
        initialdate: null,
        finaldate: null,
        cityid: null,
        countryid: null,
        stateid: null,
        creatorid: null,
        mytrips: false,
        membertrips: false
    });

    const [selectedFilters, setSelectedFilters] = useState({
        name: null,
        initialdate: null,
        finaldate: null,
        cityid: null,
        countryid: null,
        stateid: null,
        creatorid: null,
        mytrips: false,
        membertrips: false
    });

    const [showInput, setShowInput] = useState({
        name: null,
        initialdate: null,
        finaldate: null,
        cityid: null,
        countryid: null,
        stateid: null,
        creatorid: null,
        mytrips: null,
        membertrips: null
    });

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

    const inputController = (name, field, type) => {
        if (type === "text" || type === "date") {
            return (
                <TextField
                    variant="outlined"
                    type={type || "text"}
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
        
        if (type === "checkbox") {
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
    };

    const filterOptionHandler = (field, name, type) => {
        return (
            <>
                <b>{name}: </b>
                { showInput[field] ? (
                    inputController(name, field, type)
                ) : (
                    <>
                        {selectedFilters[field] !== null && selectedFilters[field] !== undefined && selectedFilters[field] !== '' ? (
                            field.includes("date") ? 
                                formatDate(selectedFilters[field]) :
                            type === "checkbox" ?
                                (selectedFilters[field] ? "Yes" : "No") :
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
            initialdate: null,
            finaldate: null,
            cityid: null,
            countryid: null,
            stateid: null,
            creatorid: null,
            mytrips: false,
            membertrips: false
        });
        setSelectedFilters({
            name: null,
            initialdate: null,
            finaldate: null,
            cityid: null,
            countryid: null,
            stateid: null,
            creatorid: null,
            mytrips: false,
            membertrips: false
        });
        setFiltered(false);
    };

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
                    <Box>{ filterOptionHandler("name", "Trip Name", "text") }</Box>
                    <Box>{ filterOptionHandler("initialdate", "Initial Date", "date") }</Box>
                    <Box>{ filterOptionHandler("finaldate", "Final Date", "date") }</Box>
                    {
                        loading || !isLogged ? null : (
                            <>
                                <Box>{ filterOptionHandler("mytrips", "My Trips", "checkbox") }</Box>
                                <Box>{ filterOptionHandler("membertrips", "Trips I'm In", "checkbox") }</Box>
                            </>
                        )
                    }
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
                            searchMethod(filters);
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