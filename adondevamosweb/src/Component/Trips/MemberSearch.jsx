import { useState, useEffect } from 'react';
import axios from 'axios';
import 
    {
        TextField, 
        Button,
        useMediaQuery,
        useTheme,
        InputAdornment,
        Typography,
        Box
    } from '@mui/material';


import config from '../../Resources/config';
import UserListFound from '../View/UserListFound';

function MemberSearch({ callback, memberlist }){
    const [loading, setLoading] = useState(false);

    //var param to search user with a given tag or email
    const [searchtext, setSearchText] = useState('');

    //selected user from found list
    const [selectedUser, setSelectedUser] = useState(null);

    //Urls
    const [URLsService, setURLsService] = useState(
        {
            Users : `${config.api.baseUrl}${config.api.endpoints.Users}`
        }
    );

    //user foud list
    const [foundedUsers, setFoundedUser] = useState([
        {
            id : 1,
            name : "User name",
            lastname : "Last name",
            tag : "userTag",
            email : "example@domain.com"
        }
    ]);

    //update request
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchText(value);
        if( value.length >= 3 ) {
            searchUserList(value);
        }
    };

    //request to get user list
    const searchUserList = async( item ) =>{
        axios.get(URLsService.Users+'/Search/tag/'+item)
        .then(resp => {
            setFoundedUser(resp.data.info);
            if(resp.data.info.length > 0){
                setLoading(true);
            }
        })
        .catch(error => { 
            console.error("Error searching users")}
        );
    };

    const addUser = async( item ) =>{
        const user = foundedUsers.filter( (x) => ( x.id == item ) )[0];
        callresponse(user);
    };

    const callresponse = async( user ) =>{

        const resp = {
            id : user.id,
            name : user.name,
            email : user.email,
            tag : user.tag,
            roleid : 0
        };
        //restart component
        setSearchText("");
        setLoading(false);
        setSelectedUser(null);
        //Return response
        callback(resp);
    }

    return (<>
        <Typography variant="span"  gutterBottom align="left">
           { 
                !searchtext ? "Search Users to add to your itinerary" : ""
           } 
        </Typography>

        <TextField
            id="tagoremail"
            name="tagOrEmail"
            label="Tag or Email"
            placeholder="Tag or Email"
            variant="outlined"
            onChange={handleChange}
            value={searchtext}
            fullWidth
        />
        {
            (loading && searchtext.length >= 3 ) ? 
                ( 
                    <UserListFound 
                        callback={addUser}
                        memberList={memberlist}
                        userList={foundedUsers}
                    />) 
                : 
                ( <></>)
        }        
    </> );
}

export default MemberSearch;