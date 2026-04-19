/**
 * TripCardSkeleton - Loading placeholder for TripCard component
 * 
 * A skeleton loader that matches the visual structure of the TripCard component,
 * providing a smooth loading experience while API data is being fetched.
 * 
 * Features:
 * - Matches TripCard layout: header, avatar, image, content, actions
 * - Uses same 8-bit retro styling as actual card
 * - Subtle pulsing animation
 * - Optimized skeleton colors for each card section
 * 
 * Usage:
 * - Single card: <TripCardSkeleton />
 * - Multiple cards: <TripSkeletonList count={6} />
 * 
 * @component
 */
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  IconButton,
  Skeleton,
  Stack,
  Box
} from '@mui/material';
import { 
  FavoriteBorder,
  Share,
  ExpandMore
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

// Use the same styled components from TripCard for consistency
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
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
    '& .MuiSkeleton-root': {
      borderRadius: 0,
      border: '2px solid #2C2C2C',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));

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
  },
}));

function TripCardSkeleton() {
  return (
    <StyledCard
      sx={{
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
      }}
    >
      <StyledCardHeader
        avatar={
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{
              borderRadius: 0,
              border: '2px solid #2C2C2C',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
        }
        title={
          <Skeleton
            variant="text"
            width="60%"
            height={24}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
        }
        subheader={
          <Stack 
            direction="row" 
            spacing={0.5} 
            alignItems="center"
            sx={{ mt: 0.5 }}
          >
            <Skeleton
              variant="circular"
              width={14}
              height={14}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
            <Skeleton
              variant="text"
              width={60}
              height={16}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
            <Skeleton
              variant="text"
              width={8}
              height={16}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
            <Skeleton
              variant="text"
              width={60}
              height={16}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
          </Stack>
        }
      />

      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
        }}
      />
      
      <StyledCardContent>
        <Box sx={{ mb: 1 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={20}
            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
          />
        </Box>
        <Box sx={{ mb: 1 }}>
          <Skeleton
            variant="text"
            width="90%"
            height={20}
            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
          />
        </Box>
        <Box>
          <Skeleton
            variant="text"
            width="70%"
            height={20}
            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
          />
        </Box>
      </StyledCardContent>

      <StyledCardActions disableSpacing>
        <IconButton 
          aria-label="vote" 
          disabled
          size="small"
        >
          <FavoriteBorder sx={{ opacity: 0.5 }} />
        </IconButton>

        <IconButton 
          aria-label="share" 
          disabled
          size="small"
        >
          <Share sx={{ opacity: 0.5 }} />
        </IconButton>

        <IconButton
          disabled
          size="small"
          sx={{ marginLeft: 'auto' }}
        >
          <ExpandMore sx={{ opacity: 0.5 }} />
        </IconButton>
      </StyledCardActions>
    </StyledCard>
  );
}

export default TripCardSkeleton;