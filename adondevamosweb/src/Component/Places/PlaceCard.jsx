import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Visibility } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import 
    { 
        Button,
        Typography,
        Card,
        CardHeader,
        CardActions,
        CardContent,
        CardMedia,
        IconButton,
        Badge,
        Collapse
    } from '@mui/material';

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
function PlaceCard ({
  placeinfo
}) 
{
  const [logo, setLogo] = useState("/PlaceHolder.jpg");
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  const gotoViewPlace = (place) => {
      if (place.id == undefined) return;
      navigate('/ViewPlace/'+place.id);
  };
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    return(
        <Card>
          <CardHeader
            sx={{ bgcolor: "#184029", 
                  '& .MuiCardHeader-title': { color: '#ffffffff' },
                  '& .MuiCardHeader-subheader': { color: '#d0d0d0ff' }
            }}
            action={
              <IconButton aria-label="view">
                <Visibility onClick={(x) => gotoViewPlace(placeinfo)} />
              </IconButton>
            }
            title={placeinfo.name}
            subheader={placeinfo.location}
          />
          <CardMedia
            sx={{ height: 140 }}
            image={logo}
            title="place image"
            alt="place image"
            onClick={ (x) => gotoViewPlace(placeinfo) }
            style={{ cursor: 'pointer' }}
          />
          <CardContent sx={{ bgcolor: "#F9E1D4" }}>
            <Typography variant="p" sx={{ color: 'text.secondary' }}>
              {
                placeinfo.description
              }
            </Typography>
            <Typography variant="body2" align="right" >
              {
                placeinfo.facilities
              }
            </Typography>
          </CardContent>
        <CardActions disableSpacing 
        sx={{ bgcolor: "#C9C1F8" }}>
            <IconButton aria-label="add to favorites">
              <Badge 
              color="secondary" 
              badgeContent={placeinfo.statics.Votes.Total} 
              max={999}>
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton 
              aria-label="share">
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
            <CardContent>
              
            </CardContent>
          </Collapse>
      </Card>
    );
}
export default PlaceCard;