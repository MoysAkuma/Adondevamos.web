import React from "react";
import 
    {
        MenuItem,
        Select
} from '@mui/material';

function CitiesSelect({ val, onChangecall, catCities}){
    return (
    <Select
        id="cityid"
        name="cityid"
        helperText="Please select your City"
        value={val}
        onChange={onChangecall}
        fullWidth
        >
        {  
            catCities?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
            {option.name}
            </MenuItem>
        ))
        }
    </Select>
    );
}

export default CitiesSelect;