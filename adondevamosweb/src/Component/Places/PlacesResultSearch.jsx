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
          navigate('/View/Place/' + place.id);
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
                                    <TableCell align="left">Ubication</TableCell>
                                    <TableCell align="left">Address</TableCell>
                                    <TableCell align="left"></TableCell>
                                    <TableCell align="left"></TableCell>
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
                                                    { 
                                                        place.name 
                                                    }
                                                </TableCell>
                                                <TableCell align="right">{ place.City.name + ", " + place.Country.name + ", " + place.State.name }</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title={place.address}>
                                                        <span>
                                                            { place.address.length > 15 ? place.address.substring(0, 15) + "..." : place.address }
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="right">{  }</TableCell>
                                                <TableCell align="center" >
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="view"
                                                        onClick={ () => goToViewPlace(place)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
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