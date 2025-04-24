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
        IconButton
        
} from '@mui/material';

import { Search, Clear } from '@mui/icons-material';

function Memberlist(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tagoremail, setTagOrEmail] = useState(null);
    const handleSubmit = async (e) => {

    }

    //update request
    const handleChange = (e) => {
        /*const { name, value } = e.target;
        setFormTrip(prev => ({
        ...prev,
        [name]: value
        }));*/
    };

    const handleClear = (e) => {
        /*const { name, value } = e.target;
        setFormTrip(prev => ({
        ...prev,
        [name]: value
        }));*/
        setTagOrEmail("");
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
                }}
            >
                <TextField
                    id="tagoremail"
                    name="tagoremail"
                    label="Type a tag or email to search"
                    placeholder="Tag or Email"
                    variant="outlined"
                    helperText="Tag or Email has to be an user of this site"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={tagoremail}
                    fullWidth
                    required
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton onClick={handleClear}>
                                    <Clear />
                                </IconButton>  
                            </InputAdornment>
                              
                        )
                    }}
                />
            </Box>
        </Container>
    );
}

export default Memberlist;
