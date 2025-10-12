import React from "react";

import 
    {
        MenuItem,
        Select
    } from '@mui/material';

function StateSelect({ val, onChangecall, catStates}){
    return (
        catStates.length > 0 ? (
        <Select
            id="stateid"
            name="stateid"
            value={val}
            onChange={onChangecall}
            fullWidth
            variant="standard"
            >
            {  
                catStates.map(
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
        </Select>) : (<></>)
    );
}

export default StateSelect;