import { useState, useEffect } from "react";
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
  const [logo, setLogo] = useState("/UnderConstruction.png");
    return(
        <Card>
          <CardHeader
            action={
              <IconButton aria-label="view">
                <Visibility />
              </IconButton>
            }
              title={placeinfo.name}
              subheader={placeinfo.description}
            />
        <CardMedia
          sx={{ height: 140 }}
          image={logo}
          title="place image"
        />
        <CardContent>
          
        </CardContent>
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <Badge 
              color="secondary" 
              badgeContent={placeinfo.statics.Votes.Total} max={999}>
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
export default PlaceCard;