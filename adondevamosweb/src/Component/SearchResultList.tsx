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
        List,
        ListItem,
        ListItemText,
        IconButton

    } from '@mui/material';
import {BeachAccessIcon, Add} from '@mui/icons-material';

function SearchResultList({name, results}){
    return (
    <Container>
        <Box>    
            <Typography variant="subtitle1" gutterBottom align="center">
                Found {name}
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    results.length > 0 ? results.map(
                        (x)=>(
                            <ListItem key={x.id}>
                                <ListItemText 
                                    primary={x.name} 
                                    secondary={x.description} />
                                <IconButton edge="end" aria-label="add">
                                    <Add />
                                </IconButton> 
                            </ListItem>
                    )): <p>Select filters</p>
                }
            </List>
        </Box>
    </Container>);
}
export default SearchResultList;