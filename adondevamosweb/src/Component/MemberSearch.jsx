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

import { Search, Clear, Add } from '@mui/icons-material';
import SearchResultList from "./SearchResultList";

function MemberSearch(){
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
        setTagOrEmail(e.target.value);
    };

    const handleClear = (e) => {
        /*const { name, value } = e.target;
        setFormTrip(prev => ({
        ...prev,
        [name]: value
        }));*/
        setTagOrEmail("");
    };

    const [foundUsers, setFoundUsers] = useState([]);

    const searchUsers = async (e) => {
        setFoundUsers([
            {
                id:1,
                name:"Member Name",
                description:"Desc",
                role: "Admin"
            },
            {
                id:2,
                name:"Place Name",
                description:"Desc",
                role: "Owner"
            }
        ]);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent form submission if wrapped in a form
          searchUsers();
        }
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
                    helperText="Enter to search"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={tagoremail}
                    fullWidth
                    required
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton onClick={handleClear}>
                                    <Clear />
                                </IconButton>
                                <IconButton onClick={searchUsers}>
                                    <Search />
                                </IconButton>  
                            </InputAdornment>
                              
                        )
                    }}
                />
            </Box>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    foundUsers.length > 0 ? foundUsers.map(
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
        </Container>
    );
}

export default MemberSearch;
