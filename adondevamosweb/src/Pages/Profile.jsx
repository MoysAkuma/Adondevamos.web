import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Container, Box, Typography } from "@mui/material";
import  ProfileDetails from "../Component/Users/ProfileDefails";
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import config from "../Resources/config";

export default function Profile() {

    const [userInfo, setUserInfo] = useState(null);
    const auth = useAuth();
    const URLs = {
        Site: `${config.api.baseUrl}`
      };
    useEffect(() => {
        const fetchUserInfo = async () => {
            console.log('Fetching user info for:', auth.user);
            try {
                const response = await axios.get(`${URLs.Site}/Users/${auth.user}`, {
                    withCredentials: true
                });
                setUserInfo(response.data.info);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (auth.user) {
            fetchUserInfo();
        }
    }, [auth.user]);

    if (!userInfo) {
        return (
            <CenteredTemplate>
                <Typography>Loading profile...</Typography>
            </CenteredTemplate>
        );
    }
    return (
        <CenteredTemplate>
            <Container maxWidth="sm">
                <ProfileDetails user={userInfo} />
            </Container>
        </CenteredTemplate>
    );
}
