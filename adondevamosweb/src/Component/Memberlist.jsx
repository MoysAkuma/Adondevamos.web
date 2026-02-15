import { useState } from 'react';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        Container,
        Typography,
        Box,
        MenuItem,
        FormGroup,
        FormControlLabel,
        Checkbox,
        InputAdornment,
        IconButton,
        List,
        ListItem,
        ListItemText
        
} from '@mui/material';

import { Add, Delete } from '@mui/icons-material';


function Memberlist({ members}){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    members.length > 0 ? members.map(
                        (x)=>(
                            <ListItem key={x.id}>
                                <ListItemText 
                                    primary={x.name} 
                                    secondary={x.description} />
                                <IconButton edge="end" aria-label="add">
                                    <Add />
                                    <Delete />
                                </IconButton> 
                            </ListItem>
                    )): <ListItem> 
                        <ListItemText primary="No members added yet" ></ListItemText>
                    </ListItem>
                }
            </List>
        </Box>
        </Container>
    );
}

export default Memberlist;
