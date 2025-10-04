import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

import config from "../Resources/config";
    
function ViewUser(){
    //Get id
    const { UserID } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [UserInfo, setUserInfo] = useState({
        name : "",
        tag : "",
        lastname : "",
        secondname : "",
        email : "",
        description : "",
        countryid : 0,
        stateid: 0,
        cityid : 0
    });

    //URLS
    const [URLsService, setURLsService] = useState(
        {
            Users : `${config.api.baseUrl}${config.api.endpoints.Users}`,
            ViewUser:`${config.api.baseUrl}${config.api.site.View}${config.api.endpoints.Users}`,
            Places:`${config.api.baseUrl}${config.api.endpoints.Places}`
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

    const [ubication, setUbication] = useState({
        CountryName : "",
        StateName : "",
        CityName : ""
    });

    //getUbicationName
    const getUbicationNames = async( placeinfo ) =>{
        console.log(URLsService.Places + 
            '/Ubications/' + placeinfo.countryid +
            '/' + placeinfo.stateid +
            '/' + placeinfo.cityid);

        axios.get(URLsService.Places + 
            '/Ubications/' + placeinfo.countryid +
            '/' + placeinfo.stateid +
            '/' + placeinfo.cityid)
        .then(resp => {
            let find = resp.data.info;
            setUbication( 
            {
                CountryName : find.CountryName,
                StateName : find.StateName,
                CityName : find.CityName
            }
            );
        })
        .catch(error => console.error("Error getting names of ubications"));
    };

    //getUserInfo
    const getUserInfo = async(  ) =>{
        console.log(URLsService.Users);
        axios.get(URLsService.Users + '/' + UserID)
        .then(resp => {
            const data = resp.data.info[0];
            setUserInfo(data);
            getUbicationNames(data);
        })
        .catch(error => console.error("Error getting place id"));
    };

    useEffect(()=> {
            getUserInfo();
    },[]);
    
    return (<Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}
        >
            <Typography gutterBottom variant="h5" component="div" align="center">
                { UserInfo.name } { UserInfo.lastname } ( @{ UserInfo.tag } )
            </Typography>
            
            <Typography gutterBottom variant="h6" component="div" align="left">
                Tag
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            @{
                UserInfo.tag
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                E-mail
            </Typography>

            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                UserInfo.email
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                User Name
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                UserInfo.name
            }
            </Typography>

            {
                UserInfo.secondname != "" ? 
                (
                    <>
                        <Typography gutterBottom variant="h5" component="div">
                            User Second Name
                        </Typography>
                        <Typography gutterBottom variant="body1" component="div" align="right">
                        {
                            UserInfo.secondname
                        }
                        </Typography> 
                    </>
                ) : 
                (
                    <Typography gutterBottom variant="subtitle1" component="div" align="right">
                        No second name added
                    </Typography>
                )
            }
            
            <Typography gutterBottom variant="h6" component="div">
                Last Name
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                UserInfo.lastname
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
                Description
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="right">
            {
                UserInfo.description
            }
            </Typography>

            <Typography gutterBottom variant="h6" component="div">
            Ubication
            </Typography>

            <Typography gutterBottom variant="body1" component="div" align="right">
                { ubication.CityName }, { ubication.StateName }, { ubication.CountryName}
            </Typography>

        </Box>
    </Container>);
}
export default ViewUser;