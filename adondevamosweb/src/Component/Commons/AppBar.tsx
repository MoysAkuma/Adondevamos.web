import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, 
    Button, Box, CircularProgress, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText
 } from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Container } from "@mui/system";
import { NotListedLocation, Menu as MenuIcon } from "@mui/icons-material";
import UserProfileAvatar from "../Users/UserProfileAvatar";
import { useNavbarConfig } from "../../hooks/useNavbarConfig";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AppBarComp() {
    const { isLogged, loading, role, logout } = useAuth();
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Get navbar configuration based on user role
    const { brand, menuItems, authButton: _authButton, settings } = useNavbarConfig(role, isLogged);
    const authButton = _authButton as any;

    const userSettings = [
        { text: t('navigation.profile'), path: '/Profile' },
        { text: t('navigation.logout'), action: 'logout' },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleAuthAction = () => {
        if (authButton?.action === 'logout') {
            handleLogout();
        }
    };

    return (
        <>
        <AppBar position="fixed" color="default" sx={{ mb: 2 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <NotListedLocation sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                        <Link to={brand.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {brand.name}
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
                                {/* Regular menu items */}
                                {menuItems.map((item) => (
                                    item.id !== 'profile' && (
                                        <Button 
                                            key={item.id}
                                            color="inherit" 
                                            component={Link} 
                                            to={item.href}
                                            sx={{ fontSize: '0.75rem' }}
                                        >
                                            {settings.showIcons && item.icon && (
                                                <span style={{ marginRight: '3px' }}>{item.icon}</span>
                                            )}
                                            {t(`navigation.${item.id === 'managesite' ? 'settings' : item.id}`)}
                                        </Button>
                                    )
                                ))}
                                
                                {/* Auth button or user avatar */}
                                {isLogged ? (
                                    <UserProfileAvatar settings={userSettings} />
                                ) : (
                                    authButton && (
                                        <Button 
                                            color="inherit" 
                                            component={Link} 
                                            to={authButton.href}
                                            sx={{ fontSize: '0.75rem' }}
                                        >
                                            {settings.showIcons && authButton.icon && (
                                                <span style={{ marginRight: '3px' }}>{authButton.icon}</span>
                                            )}
                                            {t(authButton.action === 'logout' ? 'navigation.logout' : 'navigation.login')}
                                        </Button>
                                    )
                                )}
                            </Box>

                            {/* Mobile Menu Icon */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label={t('common.menu')}
                                    onClick={toggleMobileMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </>
                    )}
                    <LanguageSwitcher />
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
                    {/* Regular menu items */}
                    {menuItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <ListItemButton component={Link} to={item.href}>
                                <ListItemText 
                                    primaryTypographyProps={{ sx: { fontSize: '0.875rem' } }}
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {settings.showIcons && item.icon && (
                                                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                                            )}
                                            {t(`navigation.${item.id === 'managesite' ? 'settings' : item.id}`)}
                                        </Box>
                                    } 
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    
                    {/* Auth button */}
                    {authButton && (
                        <ListItem disablePadding>
                            {authButton.action === 'logout' ? (
                                <ListItemButton onClick={handleAuthAction}>
                                    <ListItemText 
                                        primaryTypographyProps={{ sx: { fontSize: '0.875rem' } }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {settings.showIcons && authButton.icon && (
                                                    <span style={{ marginRight: '8px' }}>{authButton.icon}</span>
                                                )}
                                                {t(authButton.action === 'logout' ? 'navigation.logout' : 'navigation.login')}
                                            </Box>
                                        } 
                                    />
                                </ListItemButton>
                            ) : (
                                <ListItemButton component={Link} to={authButton.href}>
                                    <ListItemText 
                                        primaryTypographyProps={{ sx: { fontSize: '0.875rem' } }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {settings.showIcons && authButton.icon && (
                                                    <span style={{ marginRight: '8px' }}>{authButton.icon}</span>
                                                )}
                                                {t(authButton.action === 'logout' ? 'navigation.logout' : 'navigation.login')}
                                            </Box>
                                        } 
                                    />
                                </ListItemButton>
                            )}
                        </ListItem>
                    )}
                </List>
            </Box>
        </Drawer>
        </>
    );
}