import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from "@mui/material";
import axios from 'axios';

export default function Search() {
    //Module to show the search page
    const { opt } = useParams();

    return (
        <Container maxWidth="sm"  sx={{ py: 8 }}>
            <Typography variant="h5" align="center">
                Search Page {opt}
            </Typography>
            <img 
                src="/UnderConstruction.png" 
                alt="UnderConstruction" 
                style={{ width: '100%', height: 'auto', marginTop: '20px' }} />
        </Container>
    );
}