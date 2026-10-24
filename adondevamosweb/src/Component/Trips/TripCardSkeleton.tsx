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
import {
  TripCardRoot,
  TripCardHeader,
  TripCardContent,
  TripCardActions,
  tripCardSkeletonPulseSx,
  skeletonHeaderPieceSx,
  skeletonBodyPieceSx,
  skeletonMediaSx,
  skeletonDisabledIconSx,
  skeletonExpandButtonSx,
} from '../../Css/Trips/trips.styles';

function TripCardSkeleton() {
  return (
    <TripCardRoot sx={tripCardSkeletonPulseSx}>
      <TripCardHeader
        avatar={
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{
              borderRadius: 0,
              border: '2px solid #2C2C2C',
              ...skeletonHeaderPieceSx,
            }}
          />
        }
        title={
          <Skeleton
            variant="text"
            width="60%"
            height={24}
            sx={skeletonHeaderPieceSx}
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
              sx={skeletonHeaderPieceSx}
            />
            <Skeleton
              variant="text"
              width={60}
              height={16}
              sx={skeletonHeaderPieceSx}
            />
            <Skeleton
              variant="text"
              width={8}
              height={16}
              sx={skeletonHeaderPieceSx}
            />
            <Skeleton
              variant="text"
              width={60}
              height={16}
              sx={skeletonHeaderPieceSx}
            />
          </Stack>
        }
      />

      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={skeletonMediaSx}
      />
      
      <TripCardContent>
        <Box sx={{ mb: 1 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={20}
            sx={skeletonBodyPieceSx}
          />
        </Box>
        <Box sx={{ mb: 1 }}>
          <Skeleton
            variant="text"
            width="90%"
            height={20}
            sx={skeletonBodyPieceSx}
          />
        </Box>
        <Box>
          <Skeleton
            variant="text"
            width="70%"
            height={20}
            sx={skeletonBodyPieceSx}
          />
        </Box>
      </TripCardContent>

      <TripCardActions disableSpacing>
        <IconButton 
          aria-label="vote" 
          disabled
          size="small"
        >
          <FavoriteBorder sx={skeletonDisabledIconSx} />
        </IconButton>

        <IconButton 
          aria-label="share" 
          disabled
          size="small"
        >
          <Share sx={skeletonDisabledIconSx} />
        </IconButton>

        <IconButton
          disabled
          size="small"
          sx={skeletonExpandButtonSx}
        >
          <ExpandMore sx={skeletonDisabledIconSx} />
        </IconButton>
      </TripCardActions>
    </TripCardRoot>
  );
}

export default TripCardSkeleton;