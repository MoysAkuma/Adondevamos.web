import { useState, useEffect } from "react";
import axios from 'axios';

import { Accordion, AccordionActions, AccordionSummary, AccordionDetails,Typography } from '@mui/material';
import { ExpandMore, FlightLand, FlightTakeoff } from '@mui/icons-material';
function Itinerary ({itinerary = [
    { 
        id : 0,
        name : "Place Name",
        description : "Place description",
        initialdate : "17/0/2025",
        finaldate : "17/0/2025"
    }
    ] })
{
    return (<>

        {
            itinerary.map( (visit) => ( <> 
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMore />}
                >
                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }} > { visit.name } </Typography> 
                    <Typography component="span"sx={{ color: 'text.secondary' }} > <FlightLand /> { visit.initialdate } - <FlightTakeoff /> { visit.finaldate } </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component="subtitle1"> { visit.description } </Typography> <br/>
                    
                    
                </AccordionDetails>
            </Accordion>
            </>))
        }
    </>);
}

export default Itinerary;