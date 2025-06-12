import React from "react";

import 
    {
        MenuItem,
        Select
    } from '@mui/material';

function CountriesSelectList({ val, onChangecall, catCountries}){
    
    return (
        <Select
            label="Country"
            id="countryid"
            name="countryid"
            helperText="Please select your Country"
            value={val}
            onChange={onChangecall}
            >
            {
                catCountries.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.name}
                </MenuItem>
            ))
            }
        </Select>
    );
}

export default CountriesSelectList;