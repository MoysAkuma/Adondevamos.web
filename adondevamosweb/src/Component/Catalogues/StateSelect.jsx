import React from "react";
import 
    {
        MenuItem,
        Select
    } from '@mui/material';

function StateSelect({ val, onChangecall, catStates}){
    return (
        <Select
            id="stateid"
            name="stateid"
            label="state"
            helperText="Please select your States"
            value={val}
            onChange={onChangecall}
            >
            {  
                catStates?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.name}
                </MenuItem>
            ))
            }
        </Select>
    );
}

export default StateSelect;