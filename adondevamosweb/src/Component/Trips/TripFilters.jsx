import React from "react";
import { useState, useEffect } from "react";
import { Edit, 
    Delete,
    Check } 
    from '@mui/icons-material';
import  SearchIcon 
    from '@mui/icons-material/Search'
import { TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    ButtonGroup
 } from "@mui/material";
import Search from "../../Pages/Search";

export default function TripFilters( { searchMethod } ) {
    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

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
        name: false,
        initialdate: false,
        finaldate: false,
        cityid: false,
        countryid: false,
        stateid: false,
        creatorid: false,
        mytrips: false,
        membertrips: false
    });

    const filterOptionHandler = (field, name, type) => {
        return (<>
            <b>{name}: </b>
            { showInput[field] ? (
                    <TextField
                        variant="outlined"
                        type={type || "text"}
                        name={field}
                        value={filters[field]}
                        onChange={handleChange}
                        size="small"
                        slotProps={{
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
            ) : 
            (
            <>
                {  ( selectedFilters[field] ) ? (
                    field.includes("date") ? 
                    formatDate(selectedFilters[field]) :
                            selectedFilters[field]
                    ) : (
                    <span> 
                        None 
                    </span>
                )}
                <Edit 
                    fontSize="small"
                    style={{ cursor: 'pointer', marginLeft: '5px' }} 
                    onClick={ changeShowInput(field)}
                />
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
        setFilters(
            {
                name: null,
                initialdate: null,
                finaldate: null,
                cityid: null,
                countryid: null,
                stateid: null,
                creatorid: null,
                mytrips: false,
                membertrips: false
            }
        );
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
    };

    return ( <>
        <Typography variant="body1">Filters Trips</Typography>
        { filterOptionHandler("name", "Trip Name") }
        { filterOptionHandler("initialdate", "Initial Date", "date") }
        { filterOptionHandler("finaldate", "Final Date", "date") }
        <br/>
        <ButtonGroup variant="contained" 
        color="primary" 
        fullWidth sx={{ mt: 2, mb: 4 }}>
            <Button 
                style={{ marginTop: '10px' }} 
                variant="outlined"  
                startIcon={ <SearchIcon /> }
                onClick={ (e) => { e.preventDefault(); searchMethod(filters); } }>Apply Filters
            </Button>
            <Button 
            style={{ marginTop: '10px' }} 
            variant="outlined"  
            startIcon={ <Delete /> }
            onClick={ (e) => { e.preventDefault(); clearFilters(); } }>Clear Filters
            </Button>
        </ButtonGroup>
        
    </>);
}