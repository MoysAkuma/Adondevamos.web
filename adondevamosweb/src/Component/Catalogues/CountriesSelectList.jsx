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
        MenuItem
    } from '@mui/material';

function CountriesSelectList({ val, onChangecall, catCountries}){

    return (<>
    <TextField
            id="countryID"
            name="countryID"
            select
            label="Country"
            helperText="Please select your Country"
            value={val}
            onChange={onChangecall}
            >
            {  catCountries?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.name}
                </MenuItem>
            ))}
    </TextField>
    </>);
}

export default CountriesSelectList;