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
 import { useAuth } from '../../context/AuthContext'

 export default function PlacesResultSearch({results}){
    //navigate
    const navigate = useNavigate();
    
    //Valida if is admin
    const auth = useAuth();
    
    const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }; 
        
        const goToEditPlace = (place) => {
          if (place.id == undefined) return;
          navigate('/EditPlace/' + place.id);
        };
    
        const goToViewPlace = (place) => {
          if (place.id == undefined) return;
          navigate('/ViewPlace/' + place.id);
        };

        return (
                <>
                    {
                    (results.length === 0) ? 
                    ( <p>No places found.</p> ) : ( 
                        <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="place table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="left">Country</TableCell>
                                    <TableCell align="left">State</TableCell>
                                    <TableCell align="left">City</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody> 
                                {
                                    results.map(
                                        (place) => (
                                            <TableRow
                                                key={place.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {place.name}
                                                </TableCell>
                                                <TableCell align="right">{ place.country.name }</TableCell>
                                                <TableCell align="right">{ place.state.name }</TableCell>
                                                <TableCell align="right">{ place.city.name }</TableCell>
                                                <TableCell align="center" >
                                                    { (auth.role === "Admin") ?
                                                        (<>
                                                            <Tooltip title="Edit Place">
                                                                <IconButton
                                                                    color="primary"
                                                                    aria-label="edit"
                                                                    onClick={ () => goToEditPlace(place)}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                    
                                                            <IconButton
                                                                color="primary"
                                                                aria-label="view"
                                                                onClick={ () => goToViewPlace(place)}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </>) : (<></>)
                                                    }
                                                    
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