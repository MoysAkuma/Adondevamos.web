import {
    Box,
    Typography,
    ListItemText,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import { Visibility, ThumbUp, CalendarToday, LocationOn } from '@mui/icons-material';
import {
    TripListItemRoot,
    TripListItemTitle,
    tripListNameSx,
    tripListSecondaryWrapperSx,
    tripListDescriptionSx,
    tripListChipStackSx,
    tripListDateChipSx,
    tripListPlaceChipSx,
    tripListVoteChipSx,
    tripListChipIconSx,
    tripListViewButtonSx,
} from '../../Css/Trips/trips.styles';

function TripListItem({ trip, onView }) {
    // Extract trip data
    const tripName = trip?.name || 'Unnamed Trip';
    const description = trip?.description || '';
    const initialDate = trip?.initialdate ? new Date(trip.initialdate).toLocaleDateString() : '';
    const finalDate = trip?.finaldate ? new Date(trip.finaldate).toLocaleDateString() : '';
    const voteCount = trip?.statics?.Votes?.Total || 0;
    const locationCount = trip?.itinerary ? trip.itinerary.length : 0;

    const handleClick = () => {
        if (onView && trip?.id) {
            onView(trip.id);
        }
    };

    return (
        <TripListItemRoot onClick={handleClick}>
            <ListItemText
                primary={
                    <TripListItemTitle
                        variant="h6"
                        sx={tripListNameSx}
                    >
                        {tripName}
                    </TripListItemTitle>
                }
                secondary={
                    <Box component="span" sx={tripListSecondaryWrapperSx}>
                        {description && (
                            <Typography
                                component="span"
                                variant="body2"
                                sx={tripListDescriptionSx}
                            >
                                {description}
                            </Typography>
                        )}
                        <Stack component="span" direction="row" spacing={1} flexWrap="wrap" sx={tripListChipStackSx}>
                            {initialDate && finalDate && (
                                <Chip
                                    icon={<CalendarToday sx={tripListChipIconSx} />}
                                    label={`${initialDate} - ${finalDate}`}
                                    size="small"
                                    sx={tripListDateChipSx}
                                />
                            )}
                            {locationCount > 0 && (
                                <Chip
                                    icon={<LocationOn sx={tripListChipIconSx} />}
                                    label={`${locationCount} ${locationCount === 1 ? 'Place' : 'Places'}`}
                                    size="small"
                                    sx={tripListPlaceChipSx}
                                />
                            )}
                            <Chip
                                icon={<ThumbUp sx={tripListChipIconSx} />}
                                label={`${voteCount} ${voteCount === 1 ? 'Vote' : 'Votes'}`}
                                size="small"
                                sx={tripListVoteChipSx}
                            />
                        </Stack>
                    </Box>
                }
                secondaryTypographyProps={{ component: 'div' }}
            />
            <IconButton
                edge="end"
                aria-label="view"
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                sx={tripListViewButtonSx}
            >
                <Visibility />
            </IconButton>
        </TripListItemRoot>
    );
}

export default TripListItem;
