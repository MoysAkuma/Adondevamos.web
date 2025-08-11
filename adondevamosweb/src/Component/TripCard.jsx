import { useState, useEffect } from "react";

import 
    {
        Avatar, 
        Button,
        Typography,
        Card,
        CardHeader,
        CardActions,
        CardContent,
        CardMedia,
        IconButton
    } from '@mui/material';

import { Visibility } from "@mui/icons-material";

import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';


function TripCard ({
  tripinfo
}) 
{
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };
    return(
        <Card>
          <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#000" }} aria-label="creator">
              {
                tripinfo.owner.tag[0]
              }
            </Avatar>
          }
          action={
            <IconButton aria-label="view">
              <Visibility />
            </IconButton>
          }
            title={tripinfo.name}
            subheader={"S: " + formatDate(tripinfo.initialdate) + ", E: " + formatDate(tripinfo.finaldate)}
            />
          <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {tripinfo.description}
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              Itinerary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <ul >
                {tripinfo.itinerary.map((item, index) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
      </Card>
    );
}
export default TripCard;