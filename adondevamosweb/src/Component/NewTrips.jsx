import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import axios from 'axios';
import 
    {
        Typography,
        Box
    } from '@mui/material';

function NewTrips(){
    const [NewTripsResp, setNewTripsResp] = useState([ 
      {
          name : "Nihon Trip 2024",
          id : 1,
          description : "First time at japan, itinerary made by Luis hongo and site by MoysAkuma",
          initialdate: "2024-02-04",
          finaldate: "2024-02-18",
          owner:{ tag : "MoysAkuma", email:"moises141294@hotmail.com"},
          itinerary : [
            {
              id:1,
              name:"Naritasan Shinsho-ji",
              initialdate: "2024-02-04",
              finaldate: "2024-02-04",
            },
            {
              id:2,
              name:"Hachiko Statue",
              initialDate: "2024-02-05",
              finaldate: "2024-02-05"
            },
            {
              id:3,
              name:"Sensō-ji",
              initialDate: "2024-02-06",
              finaldate: "2024-02-06"
            }
          ],
          statics:{
          Votes:{
            Total:99
          }
        }
      },
      {
          name : "Medio Maraton Mochis",
          id : 2,
          description : "Gastronomic trip with some friends at mochis",
          initialdate: "2024-03-22",
          finaldate: "2024-03-23",
          owner:{ tag : "MoysAkuma", email:"moises141294@hotmail.com"},
          itinerary : [
            {
              id:4,
              name:"Tortas Don Lupito",
              initialdate: "2025-03-22",
              finaldate: "2025-03-22",
            },
            {
              id:5,
              name:"Los Nachos",
              initialdate: "2025-03-22",
              finaldate: "2025-03-22",
            },
            {
              id:6,
              name:"Papas locas de litro",
              initialdate: "2025-03-22",
              finaldate: "2025-03-22"
            }
          ],
          statics:{
          Votes:{
            Total:0
          }
        }
      } ,
      {
          name : "Visa and fisrt couple trip",
          id : 3,
          description : "First time at Guadalajara as couple, visa interview and gastronomic trip",
          initialdate: "2024-04-29",
          finaldate: "2024-05-07",
          owner:{ tag : "MoysAkuma", email:"moises141294@hotmail.com"},
          itinerary : [
            {
              id:7,
              name:"Waffle House",
              initialdate: "2024-04-29",
              finaldate: "2024-04-29",
            },
            {
              id:8,
              name:"IRORI",
              initialdate: "2024-04-29",
              finaldate: "2024-04-29"
            },
            {
              id:9,
              name:"Zoologico of guadalajara",
              initialdate: "2024-04-29",
              finaldate: "2024-04-29"
            }
          ],
          statics:{
          Votes:{
            Total:0
          }
        }
      }  
    ]);
    
    useEffect(() => {

    });

    return (
      <>
      <Typography variant="h6" component="h6" gutterBottom align="left">
        New Trips!
      </Typography>
      <Typography variant="span" component="span" gutterBottom align="right">
          Trips created by users like you
      </Typography>
      <Box
        sx={{
        display: 'grid',
        gap: 3,
        width: '100%'
      }}
      >
        {
            NewTripsResp.length > 0 ? NewTripsResp.map(
                (x)=>(
                    <TripCard key={x.id} tripinfo={x}/>
                  )
            ) : 
            <Typography variant="span" component="span" gutterBottom align="left">
              No trips added yet. Please create and user and help me!
            </Typography>
        }
        </Box>
        </>
    );
}
export default NewTrips;