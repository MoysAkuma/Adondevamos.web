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
  Visibility,
  FavoriteBorder,
  Favorite,
  Share,
  ExpandMore,
  ExpandLess,
  LocationOn
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import MapView from "../Commons/MapView";

// Styled components for clean, mobile-first design
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: '#fafafa',
  borderTop: '1px solid #f0f0f0',
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
        action={
          <Tooltip title="View Place">
            <IconButton 
              aria-label="view" 
              onClick={() => gotoViewPlace(placeinfo)}
              size="small"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        }
        title={
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 600,
              color: '#1f2937'
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
            <LocationOn sx={{ fontSize: 14, color: '#6b7280' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#6b7280',
                fontSize: '0.75rem',
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
            color: '#4b5563',
            lineHeight: 1.6,
            mb: hasValidFacilities ? 2 : 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
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
                  bgcolor: '#f3f4f6',
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  '&:hover': {
                    bgcolor: '#e5e7eb',
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
            bgcolor: '#fafafa',
            borderTop: '1px solid #f0f0f0',
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