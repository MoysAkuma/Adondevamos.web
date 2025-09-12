import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
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
        IconButton,
        Badge,
        List,
        ListItem,
        ListItemIcon,
        ListItemText
    } from '@mui/material';

import { Visibility, FlightLand, FlightTakeoff, Place } from "@mui/icons-material";

import { red,grey, common } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';


function TripCard ({
  tripinfo
}) 
{
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const gotoViewTrip = (trip) => {
      navigate('/ViewTrip/'+trip.id);
    };

    const gotoViewPlace = (place) => {
      navigate('/ViewPlace/'+place.id);
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
          sx={{ bgcolor: "#dddddcff" }}
          avatar={
            <Avatar sx={{ bgcolor: "#6934BF" }} aria-label="creator">
              {
                tripinfo.owner.tag[0]
              }
            </Avatar>
          }
          action={
            <IconButton aria-label="view">
              <Visibility 
                onClick={ (x) => gotoViewTrip(tripinfo) } 
                sx={{color: grey[500]}}
              />
            </IconButton>
          }
            title={tripinfo.name}
            subheader={ formatDate(tripinfo.initialdate) + " to " + formatDate(tripinfo.finaldate)}
            />
          <CardContent
          sx={{ bgcolor: "#e0e0daff" }}
          >
            <Typography component="p" sx={{ color: 'text.secondary' }}>
              {
                tripinfo.description
              }
            </Typography>
            <Typography gutterBottom component="p" >
              Itinerary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <List>
                {
                  tripinfo.itinerary.map(
                    (item) => (
                      <ListItem key={item.id}> 
                        <ListItemIcon>
                          <Place 
                          fontSize="small"  
                          sx={{color: red[500]}}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                        />
                        <IconButton 
                          edge="end" 
                          aria-label='actions'
                        >
                          <Visibility 
                            fontSize="small" 
                            onClick={(x) => gotoViewPlace(item)} 
                            sx={{color: common.black}}
                          />
                        </IconButton>
                      </ListItem>
                    )
                  )
                }
            </List>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <Badge 
              color="secondary" 
              badgeContent={tripinfo.statics.Votes.Total} max={999}>
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
      </Card>
    );
}
export default TripCard;