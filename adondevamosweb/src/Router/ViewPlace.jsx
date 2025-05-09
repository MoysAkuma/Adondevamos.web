import { useState, useEffect } from "react";
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
        ListItemText
    } from '@mui/material';

function ViewPlace(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    //mock
    const [placemock, setPlacemock] = useState(
        {
            id : 1,
            name: 'Place Name',
            countryID: 1,
            stateID: 1,
            cityID: 1,
            description: 'Description',
            address:'Address Text',
            facilities:[
                {
                    id:1,
                    name:"WC"
                }
            ],
            isInternational: false
        }
    );
    //catalogues
    const [catCountries, setCatCountries] = useState([
        {
            value:1,
            label:"MEXICO"
        }
    ]);
    const [catStates, setCatStates] = useState([
        {
            value:1,
            label:"SINALOA"
        }
    ]);

    const [catCities, setCatCities] = useState([
        {
            value:1,
            label:"Culiacan"
        },
        {
            value:2,
            label:"Los mochis"
        }
    ]);

    const [catFacilities, setCatFacilities] = useState([
        {
            value:true,
            label:"Wi-fi",
            code:"wifi"
        },
        {
            value:false,
            label:"Bathroom",
            code:"bath"
        }
    ]);
    return (<Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
            }}
        >
            <Typography variant="h5" component="h5" gutterBottom align="center">
                Name
            </Typography>
            <Typography variant="body1" component="body1" gutterBottom align="center">
                {
                    placemock.name
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="center">
                Description
            </Typography>
            <Typography variant="body1" component="body1"  align="center">
                {
                    placemock.description
                }
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="center">
                Address
            </Typography>
            <Typography variant="body1" component="body1"  align="center">
                {
                    placemock.address
                }
            </Typography>

            <Typography gutterBottom variant="h6" component="div" align="center">
            Ubication
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
            
            {
                catCities.filter(x=>x.value == placemock.cityID)[0].label 
            }
            , 
            {
                catStates.filter(x=>x.value == placemock.stateID)[0].label 
            }
            , 
            {
                catCountries.filter(x=>x.value == placemock.countryID)[0].label 
            } 
            </Typography>

            <Typography variant="h5" component="h5" gutterBottom align="center">
                Facilities
            </Typography>
            <Typography variant="body1" component="body1"  align="center">
                {
                    placemock.facilities.map((fac) => (
                    <>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={fac.name}
                                >
                                </ListItemText>
                            </ListItem>
                        </List>
                    </>)
                    )
                }
            </Typography>
        </Box>
    </Container>);
}
export default ViewPlace;