import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
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
  Tooltip,
  Chip,
  Box,
  Stack,
  Divider
} from '@mui/material';
import { 
  CalendarToday, 
  Visibility, 
  FavoriteBorder,
  Favorite,
  Share,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import Itinerary from "./Itinerary/Itinerary";
import { useAuth } from '../../context/AuthContext';
import useVoteApi from '../../hooks/Votes/useVoteApi';
import SnackbarNotification from '../Commons/SnackbarNotification';

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
  '& .MuiCardHeader-avatar': {
    '& .MuiAvatar-root': {
      borderRadius: 0,
      border: '2px solid #2C2C2C',
      backgroundColor: '#E63946',
    },
  },
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

function TripCard({ tripinfo }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { voteTrip } = useVoteApi();
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(tripinfo?.statics?.Votes?.Total || 0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [placeHolderImageJP] = useState("/PlaceHolder_JP.jpg");
  const [placeHolderImageMX] = useState("/PlaceHolder_MX.jpg");

  useEffect(() => {
    setIsLiked(!!tripinfo?.userVoted);
  }, [tripinfo?.userVoted]);

  useEffect(() => {
    setVoteCount(tripinfo?.statics?.Votes?.Total || 0);
  }, [tripinfo?.statics?.Votes?.Total]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleLikeClick = async () => {
    if (!user) {
      showSnackbar('You must be logged in to vote.', 'warning');
      return;
    }

    if (!tripinfo?.id || isVoting) {
      return;
    }

    const previousLiked = isLiked;
    const previousCount = voteCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

    setIsVoting(true);
    setIsLiked(nextLiked);
    setVoteCount(nextCount);

    try {
      await voteTrip(tripinfo.id, user);
      showSnackbar(nextLiked ? 'Trip added to favorites' : 'Trip removed from favorites', 'success');
    } catch (error) {
      setIsLiked(previousLiked);
      setVoteCount(previousCount);
      showSnackbar('Could not update vote. Please try again.', 'error');
      console.error('There was an error voting the trip!', error);
    } finally {
      setIsVoting(false);
    }
  };


  const getFullURL = () => {
    return window.location.origin + location.pathname + location.search;
  };

  const gotoViewTrip = (trip) => {
    if (!trip.id) return;
    navigate('/View/Trip/' + trip.id);
  };

  const goToViewPlace = (placeId) => {
    if (!placeId) return;
    navigate('/View/Place/' + placeId);
  };

  const getShareLocation = (id) => {
    const url = getFullURL() + 'ViewTrip/' + id;
    navigator.clipboard.writeText(url);
    // Show a toast notification here
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getPlaceholderImage = () => {
    if(tripinfo.gallery && tripinfo.gallery.length > 0) {
      return tripinfo.gallery[0].completeurl;
    }
    if (tripinfo.itinerary.length > 0) {
      return tripinfo.itinerary[0].place.Country.acronym === "JP" 
        ? placeHolderImageJP 
        : placeHolderImageMX;
    }
    return placeHolderImageMX;
  };

  // Get unique country acronyms
  const uniqueCountries = [...new Set(
    tripinfo.itinerary.map((x) => x.place.Country.acronym).filter(Boolean)
  )];

  //get locations name from itinerary
  const locations =  [...new Set(
     tripinfo.itinerary.map((item) => `${item.place.City.name},${item.place.State.name},${item.place.Country.name}`)
  )];


  return (
    <StyledCard>
      <StyledCardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: '#6366f1',
              width: 40,
              height: 40,
              fontSize: '1rem'
            }}
          >
            {tripinfo.owner.tag[0]}
          </Avatar>
        }
        action={
          <Tooltip title="View Trip">
            <IconButton 
              aria-label="view" 
              onClick={() => gotoViewTrip(tripinfo)}
              size="small"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        }
        title={
          <Typography 
            variant="h6" 
            component="h6"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              fontFamily: "'Press Start 2P', cursive",
              fontWeight: 600,
              color: '#FFFFFF',
              textShadow: '2px 2px 0px #2C2C2C',
            }}
          >
            {tripinfo.name}
          </Typography>
        }
        subheader={
          <Stack 
            direction="row" 
            spacing={0.5} 
            alignItems="center"
            flexWrap="wrap"
            sx={{ mt: 0.5 }}
          >
            <CalendarToday sx={{ fontSize: 14, color: '#FFFFFF' }} />
            <Typography 
              variant="caption" 
              sx={{ color: '#E8F4FD', fontSize: '0.5rem' }}
            >
              {formatDate(tripinfo.initialdate)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#E8F4FD', mx: 0.5 }}>
              •
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: '#E8F4FD', fontSize: '0.5rem' }}
            >
              {formatDate(tripinfo.finaldate)}
            </Typography>
          </Stack>
        }
      />

      <StyledCardMedia
        component="img"
        image={getPlaceholderImage()}
        alt="Trip image"
        onClick={() => gotoViewTrip(tripinfo)}
      />
      

      <StyledCardContent>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#2C2C2C',
            lineHeight: 1.8,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: { xs: '0.5rem', sm: '0.6rem' },
            fontFamily: "'Press Start 2P', cursive"
          }}
        >
          {tripinfo.description}
        </Typography>
        <Divider sx={{ my: 1, borderColor: '#2C2C2C' }} />

        {uniqueCountries.length > 0 && (
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap"
            gap={0.5}
          >
            {uniqueCountries.map((acronym, index) => (
              <Chip
                key={`${acronym}-${index}`}
                label={acronym}
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
        {
          locations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                component="h6"
                sx={{
                  fontWeight: 600,
                  color: '#2C2C2C',
                  mb: 1,
                  fontSize: '0.65rem',
                  fontFamily: "'Press Start 2P', cursive",
                }}
              >
                Locations
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1}
                flexWrap="wrap"
                gap={0.5}
              >
                {locations.map((loc, index) => (
                  <Chip
                    key={`loc-${index}`}
                    label={loc}
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
            </Box>
          )
        }
      </StyledCardContent>

      <StyledCardActions disableSpacing>
        <Tooltip title={isLiked ? "Unlike" : "Like"}>
          <IconButton 
            aria-label="vote" 
            onClick={handleLikeClick}
            disabled={isVoting}
            size="small"
          >
            <Badge 
              badgeContent={voteCount} 
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
            onClick={() => getShareLocation(tripinfo.id)}
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
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              color: '#FFFFFF',
              mb: 1.5,
              fontSize: '0.65rem',
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '2px 2px 0px #2C2C2C',
            }}
          >
            Itinerary
          </Typography>
          {tripinfo.itinerary.length === 0 ? (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#E8F4FD', 
                fontStyle: 'italic',
                fontSize: '0.6rem',
                fontFamily: "'Press Start 2P', cursive",
              }}
            >
              No places added yet.
            </Typography>
          ) : (
            <Itinerary tripinfo={tripinfo}
            callBackView={goToViewPlace}
             />
          )}
        </CardContent>
      </Collapse>
      <SnackbarNotification
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </StyledCard>
  );
}
export default TripCard;