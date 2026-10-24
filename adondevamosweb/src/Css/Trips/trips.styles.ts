import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  ListItem,
  Pagination,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export {
  PixelTypography,
  StyledContainer,
  StyledHeaderCard,
  StyledHeaderContent,
  StyledSectionCard,
  StyledSectionHeader,
  StyledSectionContent,
} from '../pixel.styles';

export const StyledBanner = styled(CardMedia)(({ theme }) => ({
  height: 300,
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  objectFit: 'cover',
  [theme.breakpoints.down('sm')]: {
    height: 200,
  },
}));

export const StyledActionsCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#52B788',
  padding: theme.spacing(2),
}));

export const StyledActionButton = styled(IconButton)(({ theme }) => ({
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  padding: theme.spacing(1.5),
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-2px)',
    boxShadow: '3px 3px 0px #2C2C2C',
  },
}));

export const pageLoadingSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  py: 4,
};

const pixelAlertBaseSx: SxProps<Theme> = {
  mt: 2,
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
  color: '#2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.7rem',
  lineHeight: 1.6,
};

export const warningAlertSx: SxProps<Theme> = {
  ...pixelAlertBaseSx,
  backgroundColor: '#FEF3C7',
  '& .MuiAlert-icon': {
    fontSize: '1rem',
    color: '#D97706',
  },
};

export const errorAlertSx: SxProps<Theme> = {
  ...pixelAlertBaseSx,
  backgroundColor: '#FEE2E2',
  '& .MuiAlert-icon': {
    fontSize: '1rem',
    color: '#DC2626',
  },
};

export const tripTitleSx: SxProps<Theme> = {
  fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
  color: '#FFFFFF',
  mb: 2,
  lineHeight: 1.4,
};

export const tripDescriptionSx: SxProps<Theme> = {
  fontSize: { xs: '0.6rem', sm: '0.8rem' },
  color: '#E8F4FD',
  mb: 2,
  lineHeight: 1.6,
};

export const tripOwnerSx: SxProps<Theme> = {
  fontSize: { xs: '0.5rem', sm: '0.6rem' },
  color: '#E8F4FD',
  cursor: 'pointer',
  '&:hover': {
    color: '#FFFFFF',
    textDecoration: 'underline',
  },
};

export const tripDatesSx: SxProps<Theme> = {
  fontSize: { xs: '0.5rem', sm: '0.6rem' },
  color: '#E8F4FD',
};

export const sectionHeaderRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: { xs: '0.8rem', sm: '1rem' },
  color: '#FFFFFF',
};

export const compactActionButtonSx: SxProps<Theme> = {
  padding: '6px',
  minWidth: 'auto',
  backgroundColor: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-1px)',
    boxShadow: '2px 2px 0px #2C2C2C',
  },
};

export const iconSmallSx: SxProps<Theme> = {
  fontSize: '1rem',
};

export const emptyMembersAlertSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
  backgroundColor: '#FEF3C7',
  color: '#2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  lineHeight: 1.6,
  padding: '16px',
  '& .MuiAlert-icon': {
    fontSize: '1rem',
    color: '#D97706',
  },
  '& .MuiAlert-message': {
    padding: 0,
    fontFamily: "'Press Start 2P', cursive",
  },
};

export const actionsRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  gap: 1,
  flexWrap: 'wrap',
};

export const likedIconSx: SxProps<Theme> = {
  color: '#ef4444',
};

export const dialogTitleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
};

export const dialogTitleSx: SxProps<Theme> = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.8rem',
};

export const pendingPlacesTitleSx: SxProps<Theme> = {
  mb: 1,
  fontWeight: 700,
};

export const pendingPlacesListSx: SxProps<Theme> = {
  border: '1px solid #ddd',
  borderRadius: 1,
};

export const CreatedTripsSectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
}));

export const CreatedTripsSectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#0F766E',
  padding: theme.spacing(2),
  borderBottom: '4px solid #2C2C2C',
}));

export const CreatedTripsSectionContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#F8FAFC',
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

export const CreatedTripsHeaderText = styled('div')(({ theme }) => ({
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '1rem',
  color: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));

export const createdTripsEmptyAlertSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  lineHeight: 1.6,
};

export const createdTripsListSx: SxProps<Theme> = {
  width: '100%',
  padding: 0,
};

export const TripListItemRoot = styled(ListItem)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(2),
  backgroundColor: '#E0AC69',
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.1s, box-shadow 0.1s',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
    backgroundColor: '#E8B976',
  },
}));

export const TripListItemTitle = styled(Typography)(() => ({
  fontFamily: "'Press Start 2P', cursive",
}));

export const tripListNameSx: SxProps<Theme> = {
  fontSize: { xs: '0.7rem', sm: '0.8rem' },
  color: '#2C2C2C',
  mb: 1,
  lineHeight: 1.4,
};

export const tripListSecondaryWrapperSx: SxProps<Theme> = {
  display: 'block',
};

export const tripListDescriptionSx: SxProps<Theme> = {
  color: '#2C2C2C',
  fontSize: '0.85rem',
  mb: 1.5,
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const tripListChipStackSx: SxProps<Theme> = {
  gap: 1,
  display: 'flex',
};

export const tripListChipBaseSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
  height: 'auto',
  padding: '4px 8px',
  '& .MuiChip-icon': {
    fontSize: '0.8rem',
  },
};

export const tripListDateChipSx: SxProps<Theme> = {
  ...tripListChipBaseSx,
  backgroundColor: '#FFFFFF',
};

export const tripListPlaceChipSx: SxProps<Theme> = {
  ...tripListChipBaseSx,
  backgroundColor: '#52B788',
  color: '#FFFFFF',
  '& .MuiChip-icon': {
    fontSize: '0.8rem',
    color: '#FFFFFF',
  },
};

export const tripListVoteChipSx: SxProps<Theme> = {
  ...tripListChipBaseSx,
  backgroundColor: '#E63946',
  color: '#FFFFFF',
  '& .MuiChip-icon': {
    fontSize: '0.8rem',
    color: '#FFFFFF',
  },
};

export const tripListChipIconSx: SxProps<Theme> = {
  fontSize: '0.9rem',
};

export const tripListViewButtonSx: SxProps<Theme> = {
  color: '#3D5A80',
  border: '3px solid #2C2C2C',
  borderRadius: 0,
  padding: '8px',
  backgroundColor: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#F0F0F0',
  },
};

export const TripCardRoot = styled(Card)(({ theme }) => ({
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

export const TripCardHeader = styled(CardHeader)(({ theme }) => ({
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
    '& .MuiSkeleton-root': {
      borderRadius: 0,
      border: '2px solid #2C2C2C',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  '& .MuiCardHeader-action': {
    marginTop: 0,
    marginRight: 0,
  },
  '& .MuiIconButton-root': {
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: '6px',
    '&:hover': {
      backgroundColor: '#F8F8F8',
      transform: 'translateY(-2px)',
      boxShadow: '3px 3px 0px #2C2C2C',
    },
  },
}));

export const TripCardMedia = styled(CardMedia)({
  height: 200,
  cursor: 'pointer',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 0.9,
  },
});

export const TripCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
  backgroundColor: '#E0AC69',
  borderBottom: '4px solid #2C2C2C',
}));

export const TripCardActions = styled(CardActions)(({ theme }) => ({
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

interface ExpandButtonProps {
  expand?: boolean;
}

export const TripCardExpandButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expand',
})<ExpandButtonProps>(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const tripCardAvatarClickSx: SxProps<Theme> = {
  cursor: 'pointer',
};

export const tripCardRankingBadgeSx = (rankingColor: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: rankingColor,
  border: '2px solid #2C2C2C',
  borderRadius: 0,
  padding: '4px 8px',
  boxShadow: '2px 2px 0px #2C2C2C',
});

export const tripCardRankingIconTextSx: SxProps<Theme> = {
  fontSize: '0.6rem',
  fontFamily: "'Press Start 2P', cursive",
  color: '#2C2C2C',
  fontWeight: 'bold',
};

export const tripCardTitleSx: SxProps<Theme> = {
  fontSize: { xs: '0.7rem', sm: '0.8rem' },
  fontFamily: "'Press Start 2P', cursive",
  fontWeight: 600,
  color: '#FFFFFF',
  cursor: 'pointer',
  '&:hover': {
    color: '#98C1D9',
    textDecoration: 'underline',
  },
};

export const tripCardDateStackSx: SxProps<Theme> = {
  mt: 0.5,
};

export const tripCardDateIconSx: SxProps<Theme> = {
  fontSize: 14,
  color: '#FFFFFF',
};

export const tripCardDateTextSx: SxProps<Theme> = {
  color: '#E8F4FD',
  fontSize: '0.5rem',
};

export const tripCardBulletSx: SxProps<Theme> = {
  color: '#E8F4FD',
  mx: 0.5,
};

export const tripCardDescriptionSx: SxProps<Theme> = {
  color: '#2C2C2C',
  lineHeight: 1.8,
  mb: 2,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  fontSize: { xs: '0.5rem', sm: '0.6rem' },
  fontFamily: "'Press Start 2P', cursive",
};

export const tripCardLikedIconSx: SxProps<Theme> = {
  color: '#ef4444',
};

export const tripCardCollapseContentSx: SxProps<Theme> = {
  bgcolor: '#6B5B95',
  borderTop: '4px solid #2C2C2C',
  p: 2,
};

export const tripCardCollapseTitleSx: SxProps<Theme> = {
  fontWeight: 600,
  color: '#FFFFFF',
  mb: 1.5,
  fontSize: '0.65rem',
  fontFamily: "'Press Start 2P', cursive",
};

export const tripCardCollapseEmptySx: SxProps<Theme> = {
  color: '#E8F4FD',
  fontStyle: 'italic',
  fontSize: '0.6rem',
  fontFamily: "'Press Start 2P', cursive",
};

export const tripCardSkeletonPulseSx: SxProps<Theme> = {
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.8,
    },
    '100%': {
      opacity: 1,
    },
  },
};

export const skeletonHeaderPieceSx: SxProps<Theme> = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
};

export const skeletonBodyPieceSx: SxProps<Theme> = {
  backgroundColor: 'rgba(44, 44, 44, 0.2)',
};

export const skeletonMediaSx: SxProps<Theme> = {
  backgroundColor: 'rgba(200, 200, 200, 0.3)',
};

export const skeletonDisabledIconSx: SxProps<Theme> = {
  opacity: 0.5,
};

export const skeletonExpandButtonSx: SxProps<Theme> = {
  marginLeft: 'auto',
};

export const ItineraryMapCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#E0AC69',
}));

export const ItineraryMapHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#52B788',
  padding: theme.spacing(2),
  borderBottom: '4px solid #2C2C2C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const ItineraryMapContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#E0AC69',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

export const ItineraryMapTitle = styled(Typography)(() => ({
  fontFamily: "'Press Start 2P', cursive",
}));

export const ItineraryMapContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '400px',
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
  },
});

export const ItineraryMapActionButton = styled(IconButton)({
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  padding: '6px',
  margin: '0 2px',
  color: '#2C2C2C',
  '&:hover': {
    backgroundColor: '#3D5A80',
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: '2px 2px 0px #2C2C2C',
  },
  '&:disabled': {
    backgroundColor: '#CCCCCC',
    borderColor: '#999999',
    color: '#666666',
  },
});

export const itineraryMapHeaderRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const itineraryMapIconSx: SxProps<Theme> = {
  color: '#FFFFFF',
  fontSize: '1.5rem',
};

export const itineraryMapTitleSx: SxProps<Theme> = {
  color: '#FFFFFF',
  fontSize: { xs: '0.6rem', sm: '0.8rem' },
};

export const itineraryMapActionsRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 0.5,
};

export const itineraryMapInfoAlertSx: SxProps<Theme> = {
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  backgroundColor: '#DBEAFE',
  '& .MuiAlert-message': {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    lineHeight: 1.8,
  },
};

export const itineraryMapPopupBoxSx: SxProps<Theme> = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  lineHeight: 1.8,
  textAlign: 'center',
};

export const itineraryMapPopupTitleSx: SxProps<Theme> = {
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  fontWeight: 'bold',
  mb: 1,
  color: '#2C2C2C',
};

export const itineraryMapFooterBoxSx: SxProps<Theme> = {
  mt: 2,
};

export const itineraryMapFooterTextSx: SxProps<Theme> = {
  fontSize: '0.5rem',
  color: '#2C2C2C',
  lineHeight: 1.8,
};

export const ItineraryNoDataCard = styled(Paper)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  backgroundColor: '#E0AC69',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

export const ItineraryFilterButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.6rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

export const ItineraryMainCard = styled(Paper)({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  backgroundColor: '#E0AC69',
  overflow: 'hidden',
});

export const ItineraryPixelTypography = styled(Typography)({
  fontFamily: "'Press Start 2P', cursive",
});

export const ItineraryFilterCard = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  marginBottom: theme.spacing(2),
  overflow: 'visible',
}));

export const ItineraryFilterHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#52B788',
  padding: theme.spacing(1),
  borderBottom: '4px solid #2C2C2C',
}));

export const ItineraryFilterContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#E0AC69',
  padding: theme.spacing(2),
}));

export const ItineraryListItem = styled(ListItem)({
  backgroundColor: '#69bee0',
  borderBottom: '2px solid #2C2C2C',
  '&:hover': {
    backgroundColor: '#D4956B',
    transform: 'translateX(2px)',
  },
  transition: 'all 0.2s ease-in-out',
  '&:last-child': {
    borderBottom: 'none',
  },
});

export const ItineraryAvatar = styled(Avatar)({
  backgroundColor: '#3D5A80',
  border: '2px solid #2C2C2C',
  borderRadius: 0,
  width: 48,
  height: 48,
});

export const ItineraryActionButton = styled(IconButton)(({ theme }) => ({
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  padding: theme.spacing(0.5),
  margin: theme.spacing(0, 0.25),
  '&:hover': {
    backgroundColor: '#F8F8F8',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

export const ItineraryChip = styled(Chip)({
  backgroundColor: '#FFFFFF',
  color: '#2C2C2C',
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
  '&:hover': {
    backgroundColor: '#E63946',
    color: '#FFFFFF',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease-in-out',
});

export const ItineraryPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    backgroundColor: '#FFFFFF',
    color: '#2C2C2C',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    margin: theme.spacing(0, 0.25),
    '&:hover': {
      backgroundColor: '#F8F8F8',
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      backgroundColor: '#3D5A80',
      color: '#FFFFFF',
    },
  },
}));
