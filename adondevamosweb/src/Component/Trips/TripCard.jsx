import { useState, useEffect, use } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import 
  {
    Avatar,
    Typography,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    IconButton,
    Badge,
    Collapse,
    Tooltip
  } from '@mui/material';
import { ExpandMore, Visibility, FlightLand, 
  FlightTakeoff, Place, Edit } 
from "@mui/icons-material";

import { red,grey, common } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import Itinerary from "./Itinerary";


function TripCard ({
  tripinfo
}) 
{
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
      return <IconButton {...other} />;
    })(({ theme }) => ({
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    variants: [
      {
        props: ({ expand }) => !expand,
        style: {
          transform: 'rotate(0deg)',
        },
      },
      {
        props: ({ expand }) => !!expand,
        style: {
          transform: 'rotate(180deg)',
        },
      },
    ],
  }));
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const[placeHolderImage, setPlaceHolderImage] = useState("/PlaceHolder_JP.jpg");

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
    useEffect( ()=>{
      
    }, [tripinfo]);
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
          <CardMedia
            component="img"
            image={placeHolderImage}
            height="140"
            alt="Trip image"
            onClick={ (x) => gotoViewTrip(tripinfo) }
            sx={{ cursor: 'pointer' }} 
            object-fit="cover"
          />
          <CardContent
          sx={{ bgcolor: "#F9E1D4" }}
          >
            <Typography component="p" sx={{ color: 'text.secondary' }}>
              {
                tripinfo.description
              }
            </Typography>

            
          </CardContent>
          <CardActions disableSpacing 
          sx={{ bgcolor: "#C9C1F8" }}>
            <Tooltip title="Vote Trip not implemented yet">
            <IconButton aria-label="vote">
                <Badge 
                color="secondary" 
                badgeContent={tripinfo.statics.Votes.Total} max={999}>
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                sx={{ marginLeft: 'auto' }}
              >
                { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
              </ExpandMore>
          </CardActions>
           <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent sx={{ bgcolor: "#edeba6ff" }}>
                <Typography gutterBottom component="p" >
                  Itinerary
                </Typography>
                {
                  (tripinfo.itinerary.length == 0) ?
                  <Typography component="p" sx={{ color: 'text.secondary' }}>
                    No places added yet.
                  </Typography>
                  : 
                  <>
                    <Itinerary 
                      tripinfo={tripinfo} 
                    />
                  </>
                }
              </CardContent>
            </Collapse>
      </Card>
    );
}
export default TripCard;