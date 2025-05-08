import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function TripCard ({
  tripinfo
}) 
{
    return(
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {tripinfo.Name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {tripinfo.Description}
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              Place List
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <ul >
                {tripinfo.Itinerary.map((item, index) => (
                  <li key={item.id}>{item.Name}</li>
                ))}
              </ul>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View Trip</Button>
          </CardActions>
      </Card>
    );
}
export default TripCard;