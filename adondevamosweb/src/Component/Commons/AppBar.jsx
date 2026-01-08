import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, 
    Button, Box, CircularProgress
 } from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Container } from "@mui/system";
import { NotListedLocation } from "@mui/icons-material";
import UserProfileAvatar from "../Users/UserProfileAvatar";

export default function AppBarComp() {
    const { isLogged, loading } = useAuth();

    const settings = [{text :'Profile', path: '/Profile'}, {text: 'Logout', path: '/Logout'}];

    return (
        <AppBar position="fixed" color="default" sx={{ mb: 2 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <NotListedLocation sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            AdondeVamos
                        </Link>
                    </Typography>
                    
                    {loading ? (
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={20} />
                        </Box>
                    ) : isLogged ? (
                        <>
                            <Button color="inherit" component={Link} to="/ManageSite">
                                Manage Site
                            </Button>
                            <Button color="inherit" component={Link} to="/Trips">
                                Trips
                            </Button>
                            <Button color="inherit" component={Link} to="/Places">
                                Places
                            </Button>
                            <UserProfileAvatar settings={settings} />
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/Trips">
                                Trips
                            </Button>
                            <Button color="inherit" component={Link} to="/Places">
                                Places
                            </Button>
                            <Button color="inherit" component={Link} to="/Login">
                                Login
                            </Button>
                        </>
                    )}
                    
                </Toolbar>
            </Container>
        </AppBar>
    );
}