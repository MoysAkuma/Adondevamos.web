import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, 
    Button, Box, CircularProgress, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText
 } from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Container } from "@mui/system";
import { NotListedLocation, Menu as MenuIcon } from "@mui/icons-material";
import UserProfileAvatar from "../Users/UserProfileAvatar";

export default function AppBarComp() {
    const { isLogged, loading, role, logout, hasRole } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const settings = [{text :'Profile', path: '/Profile'}, {text: 'Logout', path: '/Logout'}];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
    }

    return (
        <>
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
                    ) : (
                        <>
                            {/* Desktop Menu */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                {isLogged ? (
                                    <>
                                        {hasRole('admin') && (
                                            <Button color="inherit" component={Link} to="/ManageSite">
                                                Manage Site
                                            </Button>
                                        )}
                                        <Button color="inherit" component={Link} to="/Trips">
                                            Trips
                                        </Button>
                                        <Button color="inherit" component={Link} to="/Places">
                                            Places
                                        </Button>
                                        <Button color="inherit" component={Link} to="/Ranking">
                                            Ranking
                                        </Button>
                                        <Button color="inherit" component={Link} to="/FAQ">
                                            FAQ
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
                                        <Button color="inherit" component={Link} to="/Ranking">
                                            Ranking
                                        </Button>
                                        <Button color="inherit" component={Link} to="/FAQ">
                                            FAQ
                                        </Button>
                                        <Button color="inherit" component={Link} to="/Login">
                                            Login
                                        </Button>
                                    </>
                                )}
                            </Box>

                            {/* Mobile Menu Icon */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="menu"
                                    onClick={toggleMobileMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </>
                    )}
                    
                </Toolbar>
            </Container>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={toggleMobileMenu}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleMobileMenu}
            >
                <List>
                    {isLogged ? (
                        <>
                            {hasRole('admin') && (
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/ManageSite">
                                        <ListItemText primary="Manage Site" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Trips">
                                    <ListItemText primary="Trips" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Places">
                                    <ListItemText primary="Places" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Ranking">
                                    <ListItemText primary="Ranking" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/FAQ">
                                    <ListItemText primary="FAQ" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Profile">
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/" 
                                onClick={handleLogout}>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Trips">
                                    <ListItemText primary="Trips" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Places">
                                    <ListItemText primary="Places" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Ranking">
                                    <ListItemText primary="Ranking" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/FAQ">
                                    <ListItemText primary="FAQ" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/Login">
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
        </Drawer>
        </>
    );
}