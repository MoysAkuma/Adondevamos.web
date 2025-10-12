import React from "react";
import {useState, useEffect } from "react";
import { Edit, Delete, Check } from "@mui/icons-material"
import  SearchIcon 
    from '@mui/icons-material/Search'
import { TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    ButtonGroup
 } from "@mui/material";

function PlaceFilter({
    searchMethod
}){
    const [filters, setFilters] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : null
    });

    const [selectedFilters, setSelectedFilters] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : null
    });

    const [showInput, setShowInput] = useState({
        name: null,
        countryid: null,
        stateid: null,
        cityid: null,
        facilities : null
    });

    const inputController=(name, id, type) => {
        if (type === "text"){
            return (
                <TextField
                    variant="outlined"
                    type={type || "text"}
                    name={field}
                    value={filters[field]}
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
                /> );
        }
            
    };

    const filterOptionHandler = (field, name, type) => {
        return (<>
            <b>{name}: </b>
            { showInput[field] ? (  
                    inputController(name, field, type);
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
        setFilters({
            name: null,
            countryid: null,
            stateid: null,
            cityid: null,
            facilities : null
        });
        setSelectedFilters({
            name: null,
            countryid: null,
            stateid: null,
            cityid: null,
            facilities : null
        });
    }
    return (<>
    <Typography variant="body1">Filters Places</Typography>
    { filterOptionHandler("name", "Place Name") }
    { filterOptionHandler("countryid", "Country") }
    { filterOptionHandler("stateid", "State") }
    { filterOptionHandler("cityid", "City") }
    { filterOptionHandler("facilities", "facilities") }
    <br/>
    <ButtonGroup 
        variant="contained"
        color="primary"
        fullWidth sx={{mt:2, mb:4}}>
            <Button 
                style={{marginTop: '10px'}}
                variant="outlined"
                startIcon={ <SearchIcon /> }
                onClick={ 
                    (e) => { 
                        e.preventDefault(); 
                        searchMethod(filters)
                    }
                } >
                Apply Filters
            </Button>
            <Button 
                style={{ marginTop: '10px' }} 
                variant="outlined"  
                startIcon={ <Delete /> }
                onClick={ (e) => { 
                    e.preventDefault(); 
                    clearFilters(); } 
                }>
                    Clear Filters
            </Button>
        </ButtonGroup>
    </>);
}

export default PlaceFilter;