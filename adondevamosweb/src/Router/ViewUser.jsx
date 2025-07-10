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
        Checkbox 
    } from '@mui/material';
    
function ViewUser(){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { UserID } = useParams();
    const [UserMock, setUserMock] = useState({
        name: 'User name',
        secondName:'',
        lastName:'User Last Name',
        countryID: 1,
        stateID: 1,
        cityID: 1,
        description: 'Description text',
        email:'user@mail.com',
        tag:'user123'
    });
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
            <Typography gutterBottom variant="h5" component="div">
            View User
            </Typography>
            
            <Typography gutterBottom variant="h6" component="div">
                Tag
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            @{
                UserMock.tag
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                E-mail
            </Typography>

            <Typography gutterBottom variant="body1" component="div">
            {
                UserMock.email
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                User Name
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                UserMock.name
            }
            </Typography>

            {
                UserMock.secondName != "" ? (
                    <>
                <Typography gutterBottom variant="h5" component="div">
                User Name
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                {
                    UserMock.secondName
                }
                </Typography> </>
                ): (
                <Typography gutterBottom variant="subtitle1" component="div">
                No second name added
                </Typography>)
            }
            
            <Typography gutterBottom variant="h6" component="div">
            Last Name
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                UserMock.lastName
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
            Description
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            {
                UserMock.description
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
            Ubication
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
            
            {
                catCities.filter(x=>x.value == UserMock.cityID)[0].label 
            }
            ,
            {
                catStates.filter(x=>x.value == UserMock.stateID)[0].label 
            }
            ,
            {
                catCountries.filter(x=>x.value == UserMock.countryID)[0].label 
            } 
            </Typography>

        </Box>
    </Container>);
}
export default ViewUser;