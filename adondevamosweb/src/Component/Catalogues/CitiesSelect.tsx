import React from "react";
import 
    {
        MenuItem,
        Select,
        FormControl,
        FormHelperText
} from '@mui/material';

function CitiesSelect({ val, onChangecall, catCities}){
    return (
    <FormControl fullWidth variant="standard">
        <Select
            id="cityid"
            name="cityid"
            value={val}
            onChange={onChangecall}
            >
            {  
                catCities?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                {option.name}
                </MenuItem>
            ))
            }
        </Select>
        <FormHelperText>Please select your City</FormHelperText>
    </FormControl>
    );
}

export default CitiesSelect;