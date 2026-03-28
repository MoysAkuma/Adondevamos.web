import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Badge,
  Collapse,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  ExpandMore,
  ExpandLess,
  LocationOn
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import MapView from "../Commons/MapView";

// Styled components for 8-bit retro design
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: '10px 10px 0px rgba(0,0,0,0.4)',
  },
  
  [theme.breakpoints.up('sm')]: {
    maxWidth: 400,
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
  backgroundColor: '#3D5A80',
  borderBottom: '4px solid #2C2C2C',
  '& .MuiCardHeader-action': {
    marginTop: 0,
    marginRight: 0,
  },
  '& .MuiIconButton-root': {
    color: '#FFFFFF',
    backgroundColor: '#E63946',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: '6px',
    '&:hover': {
      backgroundColor: '#F77F00',
      transform: 'scale(1.1)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  cursor: 'pointer',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 0.9,
  },
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
  backgroundColor: '#E0AC69',
  borderBottom: '4px solid #2C2C2C',
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: '#52B788',
  borderTop: '4px solid #2C2C2C',
  '& .MuiIconButton-root': {
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: '8px',
    margin: '0 4px',
    '&:hover': {
      backgroundColor: '#F8F8F8',
      transform: 'translateY(-2px)',
      boxShadow: '3px 3px 0px #2C2C2C',
    },
  },
}));

const ExpandButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expand',
})(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function PlaceCard({ placeinfo }) {
  const [logo] = useState("/PlaceHolder.jpg");
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const gotoViewPlace = (place) => {
    if (!place?.id) return;
    navigate('/View/Place/' + place.id);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // Add your vote logic here
  };

  const handleShare = () => {
    // Add your share logic here
    if (navigator.share) {
      navigator.share({
        title: placeinfo?.name || 'Place',
        text: placeinfo?.description || '',
        url: window.location.href,
      }).catch(() => {});
    }
  };

  // Safe access to nested properties with fallbacks
  const placeName = placeinfo?.name || 'Unknown Place';
  const placeAddress = placeinfo?.address || 'Address not available';
  const placeDescription = placeinfo?.description || 'No description available';
  const votesTotal = placeinfo?.statics?.Votes?.Total || 0;
  const facilities = placeinfo?.facilities || [];
  const hasValidFacilities = Array.isArray(facilities) && facilities.length > 0;

  return (
    <StyledCard>
      <StyledCardHeader
        title={
          <Typography
            variant="h6"
            component="h2"
            onClick={() => gotoViewPlace(placeinfo)}
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              '&:hover': {
                color: '#98C1D9',
                textDecoration: 'underline',
              }
            }}
          >
            {placeName}
          </Typography>
        }
        subheader={
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 0.5 }}
          >
            <LocationOn sx={{ fontSize: 14, color: '#FFFFFF' }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Press Start 2P', cursive",
                color: '#E8F4FD',
                fontSize: '0.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {placeAddress}
            </Typography>
          </Stack>
        }
      />

      <StyledCardMedia
        component="img"
        image={placeinfo.gallery && placeinfo.gallery.length > 0 ? placeinfo.gallery[0].completeurl : logo}
        title="place image"
        alt="place image"
        onClick={() => gotoViewPlace(placeinfo)}
      />

      <StyledCardContent>
        <Typography
          variant="body2"
          sx={{
            color: '#2C2C2C',
            lineHeight: 1.8,
            mb: hasValidFacilities ? 2 : 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: { xs: '.5rem', sm: '0.6rem' },
            fontFamily: "'Press Start 2P', cursive"
          }}
        >
          {placeDescription}
        </Typography>

        {hasValidFacilities && (
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap"
            gap={0.5}
          >
            {facilities.map((facility, index) => (
              <Chip
                key={`${facility.code}-${index}`}
                label={facility.name}
                size="small"
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#2C2C2C',
                  fontWeight: 600,
                  fontSize: '0.5rem',
                  height: 24,
                  borderRadius: 0,
                  border: '2px solid #2C2C2C',
                  fontFamily: "'Press Start 2P', cursive",
                  '&:hover': {
                    bgcolor: '#E63946',
                    color: '#FFFFFF',
                    transform: 'scale(1.05)',
                  }
                }}
              />
            ))}
          </Stack>
        )}
      </StyledCardContent>

      <StyledCardActions disableSpacing>
        <Tooltip title={isLiked ? "Unlike" : "Like"}>
          <IconButton 
            aria-label="add to favorites"
            onClick={handleLikeClick}
            size="small"
          >
            <Badge
              badgeContent={votesTotal}
              max={999}
              color="error"
            >
              {isLiked ? (
                <Favorite sx={{ color: '#ef4444' }} />
              ) : (
                <FavoriteBorder />
              )}
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Share">
          <IconButton 
            aria-label="share"
            onClick={handleShare}
            size="small"
          >
            <Share />
          </IconButton>
        </Tooltip>

        <ExpandButton
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          size="small"
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ExpandButton>
      </StyledCardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            bgcolor: '#6B5B95',
            borderTop: '4px solid #2C2C2C',
            p: 2
          }}
        >
           <MapView
            height={300}
            latitude={ parseFloat(placeinfo?.latitude) || 0}
            longitude={parseFloat(placeinfo?.longitude) || 0}
            markers={[{
              latitude: parseFloat(placeinfo?.latitude) || 0,
              longitude: parseFloat(placeinfo?.longitude) || 0,
              title: placeName,
            }]}
          />
          
        </CardContent>
      </Collapse>
    </StyledCard>
  );
}
export default PlaceCard;