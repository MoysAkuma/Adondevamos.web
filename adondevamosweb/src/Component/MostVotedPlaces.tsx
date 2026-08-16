import React, { useState, useEffect } from "react";
import PlaceCard from "./Places/PlaceCard";
import axios from 'axios';
import 
    {
        Typography,
        Box
    } from '@mui/material';

function MostVotedPlaces(){
    const [lstMostVotedPlaces, setLstMostVotedPlaces] = useState([
        {
          id:1,
          name:"Naritasan Shinsho-ji",
          description:"Shrine in japan",
          statics:{
            Votes:{
              Total:5
            }
          },
          countryid : 2,
          stateid : 1,
          cityid: 2,
          location:"Narita, Narita, Japan",
          facilities:"Wc, Wi-Fi"
      },
      {
        id:6,
        name:"Tortas don lupito",
        description:"Rural exotic food",
        statics:{
          Votes:{
            Total:4
          }
        }
        ,
          countryid : 1,
          stateid : 1,
          cityid: 2,
          location:"Los Mochis, Sinaloa, Mexico",
          facilities:"Wc"
      },
      {
        id:3,
        name:"Sensō-ji",
        statics:{
          Votes:{
            Total:3
          }
        }
        ,
          countryid : 2,
          stateid : 1,
          cityid: 2,
          location:"Tokio, Tokio, Japan",
          facilities:"Wc, Wi-Fi"
      }
      ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
      }, []);

      
    return (
      <div>
        <Typography variant="h6" component="h6" gutterBottom align="left">
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