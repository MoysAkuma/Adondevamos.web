import React from "react";

import 
    {
        MenuItem,
        Select
    } from '@mui/material';

function StateSelect({ val, onChangecall, catStates}){
    return (
        <Select
            label="State"
            id="stateid"
            name="stateid"
            value={val}
            onChange={onChangecall}
            >
            {  
                catStates.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.name}
                </MenuItem>
            ))
            }
        </Select>
    );
}

export default StateSelect;