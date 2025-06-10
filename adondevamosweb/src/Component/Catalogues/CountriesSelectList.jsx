import React from "react";

import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        Select
    } from '@mui/material';

function CountriesSelectList({ val, onChangecall, catCountries}){
    
    return (
    <Select
        id="countryid"
        name="countryid"
        label="Country"
        helperText="Please select your Country"
        value={val}
        onChange={onChangecall}
        >
        {  
            catCountries?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
            {option.name}
            </MenuItem>
        ))
        }
    </Select>
    );
}

export default CountriesSelectList;