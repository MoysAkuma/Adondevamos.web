import React, { useState, useEffect } from "react";
import PlaceCard from "./View/PlaceCard";
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox
        
    } from '@mui/material';

function MostVotedPlaces(){
    const [lstMostVotedPlaces, setLstMostVotedPlaces] = useState([
              {
                id:1,
                name:"Naritasan Shinsho-ji",
                description:"Shrine in japan",
                statics:{
                  Votes:{
                    Total:5,
                    Places:1
                  }
                },
                countryid : 2,
                stateid : 1,
                cityid: 2
                
            },
            {
              id:6,
              name:"Tortas don lupito",
              description:"Rural exotic food",
              statics:{
                Votes:{
                  Total:4,
                  Places:1
                }
              }
            },
            {
              id:3,
              name:"Sensō-ji",
              statics:{
                Votes:{
                  Total:3,
                  Places:1
                }
              }
            }
      ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
      }, []);

      
    return (
      <div>
        <Typography variant="h5" component="h5" gutterBottom align="center">
          Most voted places by users
        </Typography>
        <Box
          sx={{
          display: 'grid',
          gap: 3,
          width: '100%'
        }}
        >
          {
            lstMostVotedPlaces.length > 0 ? 
              lstMostVotedPlaces.map( (x) => (<PlaceCard placeinfo={x} />))  
              : <p>No places added</p> 
          }
        </Box>
            
        </div>
    );
}
export default MostVotedPlaces;