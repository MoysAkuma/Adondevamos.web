import React from "react";

import { Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tab,
    ButtonGroup,
    Tooltip,
    IconButton
 } from "@mui/material";
 import { useNavigate, Link } from 'react-router-dom';
 import { Edit, Visibility } from "@mui/icons-material"; 

export default function TripsResultSearch({
    results
}) {
    //navigate
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }; 
    
    const goToEditTrip = (trip) => {
        console.log(trip);
      if (trip.id == undefined) return;
      navigate('/EditTrip/' + trip.id);
    };

    const goToViewTrip = (trip) => {
        console.log(trip);
      if (trip.id == undefined) return;
      navigate('/ViewTrip/' + trip.id);
    };
    
    return (
        <>
            {
            (results.length === 0) ? 
            ( <p>No trips found.</p> ) : ( 
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="trips table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Inital Date</TableCell>
                            <TableCell align="left">Final Date</TableCell>
                            <TableCell align="left">Creator</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {
                            results.map(
                                (trip) => (
                                    <TableRow
                                        key={trip.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {trip.name}
                                        </TableCell>
                                        <TableCell align="right">{ formatDate(trip.initialdate) }</TableCell>
                                        <TableCell align="right">{ formatDate(trip.finaldate) }</TableCell>
                                        <TableCell align="right">{trip.owner.tag}</TableCell>
                                        <TableCell
                                        align="center" >
                                            <Tooltip title="Edit Trip">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="edit"
                                                    onClick={ () => goToEditTrip(trip)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            <IconButton
                                                color="primary"
                                                aria-label="view"
                                                onClick={ () => goToViewTrip(trip)}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) 
                        }
                    </TableBody>
                </Table>
                </TableContainer>
                   
             )
            }
        </>
    )
}