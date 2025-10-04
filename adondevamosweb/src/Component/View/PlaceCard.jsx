import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Visibility } from "@mui/icons-material";
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
        Badge
    } from '@mui/material';

function PlaceCard ({
  placeinfo
}) 
{
  const [logo, setLogo] = useState("/PlaceHolder.jpg");

  const navigate = useNavigate();

  const gotoViewPlace = (place) => {
      if (place.id == undefined) return;
      navigate('/ViewPlace/'+place.id);
  };

    return(
        <Card>
          <CardHeader
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
          />
          <CardContent>
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
        <CardActions disableSpacing>
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
          </CardActions>
      </Card>
    );
}
export default PlaceCard;