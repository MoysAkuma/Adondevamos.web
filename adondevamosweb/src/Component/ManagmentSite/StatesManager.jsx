import React from "react";
import axios from 'axios';
import FormStates from './FormStates';
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
        ListItemText,
        ButtonGroup,
        Slide
} from '@mui/material';
import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import config from '../../Resources/config';
function StatesManager(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess,setSubmitSuccess] = useState(false);
    const [showCountries, setShowCountries] = useState(false);
    const [catStates, setCatStates] = useState([]);
    const [URLStates, setURLStates] = useState(`${config.api.baseUrl}${config.api.endpoints.State}`);
    return (<Box
        sx={{
                    display: 'grid',
                    gap: 2,
                    width: '100%'
                }}
    >
        <Typography variant="h6" component="h6" gutterBottom align="center">
            Countries 
        </Typography>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={toggleShowCountries} >Add</Button>
        </ButtonGroup>
        
        <FormCountry id={null} />
        
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                !loading && catCountries.length > 0 ? catCountries.map(
                    (x)=>(
                        <ListItem key={x.id}>
                            <ListItemText 
                                primary={x.name} 
                                secondary={x.code} />
                            <IconButton edge="end" aria-label="add">
                                <Delete onClick={() => deleteCountry(x.id)} />
                            </IconButton>
                            <IconButton edge="end">
                                { x.hide ? <Visibility  /> : <VisibilityOff/>}
                            </IconButton>
                            
                        </ListItem>
                )): <ListItem> 
                    <ListItemText primary="No countries added" ></ListItemText>
                </ListItem>
            }
        </List>
    </Box>
    );
}
export default StatesManager;