import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Tooltip, Avatar, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileAvatar({ settings }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = async (setting) => {
        handleCloseUserMenu();
        
        if (setting.text === 'Logout') {
            await logout();
            navigate('/');
        } else if (setting.path) {
            navigate(setting.path);
        }
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                        <Person />
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                    <MenuItem 
                        key={setting.text} 
                        onClick={() => handleMenuClick(setting)}
                    >
                        <Typography sx={{ textAlign: 'center' }}>
                            {setting.text}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}