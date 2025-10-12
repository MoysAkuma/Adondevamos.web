import React from "react";
import 
    {
        MenuItem,
        Select,
        Typography
    } from '@mui/material';

function NewPlaces() {
    return (
        <>
        <Typography variant="h6" component="h6" gutterBottom align="left">
          New Places!
        </Typography>
        <Typography variant="span" component="span" gutterBottom align="right">
          Places added by users like you
        </Typography>
        
        </>
    );
}

export default NewPlaces;