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
              {tripinfo.name}
            </Typography>
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
          <CardActions>
            <Button size="small">View Trip</Button>
          </CardActions>
      </Card>
    );
}
export default TripCard;