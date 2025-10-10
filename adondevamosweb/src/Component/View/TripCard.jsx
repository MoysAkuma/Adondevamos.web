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
        ListItemText,
        Tooltip
    } from '@mui/material';

import { Visibility, FlightLand, FlightTakeoff, Place, Edit } from "@mui/icons-material";

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
      if( !trip.id ) return;
      navigate('/ViewTrip/'+trip.id);
    };

    const gotoEditTrip = (trip) => {
      if( !trip.id ) return; 
      navigate('/EditTrip/'+trip.id);
    };
    
    const gotoViewPlace = (place) => {
      if( !place.id ) return;
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

    const generateOptions = (creatorid) => {
     const isOwner = (creatorid == localStorage.getItem('userid'));
     
      return (<>
          <IconButton aria-label="view">
            <Tooltip title="View Trip">
            <Visibility 
              onClick={ (x) => gotoViewTrip(tripinfo) } 
              sx={{color: grey[500]}}
            />
            </Tooltip>
          </IconButton>
          {    
            (isOwner) ? (
            <IconButton aria-label="view">
              <Tooltip title="Edit Trip">
                <Edit 
                  onClick={ (x) => gotoEditTrip(tripinfo) } 
                  sx={{color: grey[500]}}
                  />
                </Tooltip>
            </IconButton>
          ) : (<></>)
          }
        </>
        )
    }
    const generateSubHeader = (initialdate, finaldate) => {
      if( !initialdate || !finaldate ) return "Initial and final dates";
      return formatDate(initialdate) + " to " + formatDate(finaldate);
    }
    return(
        <Card>
          <CardHeader
            sx={{ bgcolor: "#184029", 
                  '& .MuiCardHeader-title': { color: '#ffffffff' },
                  '& .MuiCardHeader-subheader': { color: '#d0d0d0ff' }
            }}
            avatar={
              <Avatar sx={{ bgcolor: "#6934BF" }} aria-label="creator">
                {tripinfo.owner.tag[0]}
              </Avatar>
            }
            action={generateOptions(tripinfo.owner.id)}
            title={tripinfo.name}
            subheader={generateSubHeader(tripinfo.initialdate, tripinfo.finaldate)}
          />
          <CardContent
          sx={{ bgcolor: "#F9E1D4" }}
          >
            <Typography component="p" sx={{ color: 'text.secondary' }}>
              {
                tripinfo.description
              }
            </Typography>

            <Typography gutterBottom component="p" >
              Itinerary
            </Typography>
            <Typography variant="div" sx={{ color: 'text.secondary' }}>
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
          <CardActions disableSpacing sx={{ bgcolor: "#C9C1F8" }}>
            <IconButton aria-label="vote">
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