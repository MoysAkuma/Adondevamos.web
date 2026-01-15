import React from "react";

import 
    {
        MenuItem,
        Select
    } from '@mui/material';

function CountriesSelectList({ val, onChangecall, catCountries}){
    return (
        <Select
            id="countryid"
            name="countryid"
            value={val}
            onChange={onChangecall}
            fullWidth
            size="small"
            variant="standard"
            helperText="Please select a Country"
            >
                <MenuItem value={0}>-- Select Country --</MenuItem>
            {
                catCountries.map(
                    (option) => (
                        <MenuItem 
                        key={option.id} 
                        value={option.id}
                        >
                            {option.name}
                        </MenuItem>
                    )
                )
            }
        </Select>
    );
}

export default CountriesSelectList;