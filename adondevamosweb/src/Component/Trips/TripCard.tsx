import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  CardContent,
  IconButton,
  Badge,
  Collapse,
  Tooltip,
  Box,
  Stack
} from '@mui/material';
import { 
  CalendarToday,
  FavoriteBorder,
  Favorite,
  Share,
  ExpandMore,
  ExpandLess,
  EmojiEvents
} from "@mui/icons-material";
import Itinerary from "./Itinerary/Itinerary";
import ItineraryMap from "./ItineraryMap";
import { useAuth } from '../../context/AuthContext';
import useVoteApi from '../../hooks/Votes/useVoteApi';
import SnackbarNotification from '../Commons/SnackbarNotification';
import UserAvatar from '../Commons/UserAvatar';
import {
  TripCardRoot,
  TripCardHeader,
  TripCardMedia,
  TripCardContent,
  TripCardActions,
  TripCardExpandButton,
  tripCardAvatarClickSx,
  tripCardRankingBadgeSx,
  tripCardRankingIconTextSx,
  tripCardTitleSx,
  tripCardDateStackSx,
  tripCardDateIconSx,
  tripCardDateTextSx,
  tripCardBulletSx,
  tripCardDescriptionSx,
  tripCardLikedIconSx,
  tripCardCollapseContentSx,
  tripCardCollapseTitleSx,
  tripCardCollapseEmptySx,
} from '../../Css/Trips/trips.styles';

function TripCard({ tripinfo, showRankingBadge = false, rankingPosition = null }) {
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

  const goToViewProfile = (userId) => {
    if (!userId) return;
    navigate('/View/User/' + userId);
  };

  const getShareLocation = (id) => {
    const url = getFullURL() + 'ViewTrip/' + id;
    navigator.clipboard.writeText(url);
    // Show a toast notification here
  };


  const getRankingBadgeColor = (position) => {
    switch(position) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#FFD700';
    }
  };

  const getRankingIcon = (position) => {
    switch(position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
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
    if (tripinfo.itinerary && tripinfo.itinerary.length > 0) {
      return tripinfo.itinerary[0].place.Country.acronym === "JP" 
        ? placeHolderImageJP 
        : placeHolderImageMX;
    }
    return placeHolderImageMX;
  };

  //get locations name from itinerary
  const locations = tripinfo.itinerary && tripinfo.itinerary.length > 0
    ? [...new Set(
        tripinfo.itinerary.map((item) => `${item.place.City.name},${item.place.State.name},${item.place.Country.name}`)
      )]
    : [];


  return (
    <TripCardRoot>
      <TripCardHeader
        avatar={
          <Box 
            onClick={() => goToViewProfile(tripinfo.owner.id)}
            sx={tripCardAvatarClickSx}
          >
            <UserAvatar
              src={tripinfo.owner?.pictureurl || tripinfo.owner?.avatar || ''}
              name={tripinfo.owner.name || tripinfo.owner.lastname}
              tag={tripinfo.owner.tag}
              size="medium"
              alt={tripinfo.owner.tag || tripinfo.owner.name || 'Trip owner'}
            />
          </Box>
        }
        action={
          showRankingBadge && rankingPosition && (
            <Tooltip title={`#${rankingPosition} Most Voted Trip`}>
              <Box
                sx={tripCardRankingBadgeSx(getRankingBadgeColor(rankingPosition))}
              >
                <Typography
                  variant="caption"
                  sx={tripCardRankingIconTextSx}
                >
                  {getRankingIcon(rankingPosition)}
                </Typography>
              </Box>
            </Tooltip>
          )
        }
        title={
          <Typography 
            variant="h6" 
            component="h6"
            onClick={() => gotoViewTrip(tripinfo)}
            sx={tripCardTitleSx}
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
            sx={tripCardDateStackSx}
          >
            <CalendarToday sx={tripCardDateIconSx} />
            <Typography 
              variant="caption" 
              sx={tripCardDateTextSx}
            >
              {formatDate(tripinfo.initialdate)}
            </Typography>
            <Typography variant="caption" sx={tripCardBulletSx}>
              •
            </Typography>
            <Typography 
              variant="caption" 
              sx={tripCardDateTextSx}
            >
              {formatDate(tripinfo.finaldate)}
            </Typography>
          </Stack>
        }
      />

      <TripCardMedia
        image={getPlaceholderImage()}
        title="Trip image"
        onClick={() => gotoViewTrip(tripinfo)}
      />
      
      <TripCardContent>
        <Typography 
          variant="body2" 
          sx={tripCardDescriptionSx}
        >
          {tripinfo.description}
        </Typography>
        
      </TripCardContent>

      <TripCardActions disableSpacing>
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
                <Favorite sx={tripCardLikedIconSx} />
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

        <TripCardExpandButton
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          size="small"
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </TripCardExpandButton>
      </TripCardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent 
          sx={tripCardCollapseContentSx}
        >
          <Typography 
            variant="subtitle2" 
            sx={tripCardCollapseTitleSx}
          >
            Itinerary
          </Typography>
          {!tripinfo.itinerary || tripinfo.itinerary.length === 0 ? (
            <Typography 
              variant="body2" 
              sx={tripCardCollapseEmptySx}
            >
              No places added yet.
            </Typography>
          ) : (
            <>
              <Itinerary tripinfo={tripinfo}
              callBackView={goToViewPlace}
               />
            </>
          )}
        </CardContent>
      </Collapse>
      <SnackbarNotification
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={3000}
      />
    </TripCardRoot>
  );
}
export default TripCard;