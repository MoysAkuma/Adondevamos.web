import { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
    CircularProgress,
    Alert,
    Box,
    Stack,
} from "@mui/material";
import { useTripsByOwnerApi } from "../../hooks/Trips/useTripsByOwnerApi";
import { useTripDetailsApi } from "../../hooks/Trips/useTripDetailsApi";
import {
    PixelModalDialog,
    PixelModalSelect,
    PixelModalTypography,
    modalActionsSx,
    modalAlertSx,
    modalCancelBtnSx,
    modalContentSx,
    modalFieldSx,
    modalInfoAlertSx,
    modalInputLabelSx,
    modalLoaderSx,
    modalMenuItemSx,
    modalPrimaryBtnSx,
    modalTitleRootSx,
    modalTitleTextSx,
} from "../../Css/Modals/modal.styles";

interface Trip {
    id: number | string;
    name: string;
    initialdate?: string;
    finaldate?: string;
}

interface AddToTripModalProps {
    open: boolean;
    onClose: () => void;
    placeId: string | number;
    userId: string | number;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

function AddToTripModal({ open, onClose, placeId, userId, onSuccess, onError }: AddToTripModalProps) {
    const { getTripsByOwner } = useTripsByOwnerApi();
    const { saveItinerary } = useTripDetailsApi();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [tripsError, setTripsError] = useState<string | null>(null);

    const [selectedTripId, setSelectedTripId] = useState<string | number>("");
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;

        setLoadingTrips(true);
        setTripsError(null);
        setSelectedTripId("");
        setInitialDate("");
        setFinalDate("");

        getTripsByOwner(userId, 1, 50, {
            action: "additinerary",
            placeIds: [placeId],
        })
            .then((res) => {
                setTrips(res.data.info || []);
            })
            .catch(() => {
                setTripsError("Failed to load your trips.");
            })
            .finally(() => setLoadingTrips(false));
    }, [open, userId, getTripsByOwner]);

    const handleSubmit = async () => {
        if (!selectedTripId || !initialDate || !finalDate) return;
        setSubmitting(true);
        try {
            await saveItinerary(
                selectedTripId,
                { Itinerary: [{ placeid: placeId, initialdate: initialDate, finaldate: finalDate }] },
                "post"
            );
            onSuccess?.("Place added to trip successfully!");
            onClose();
        } catch {
            onError?.("Could not add place to trip. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isValid =
        !!selectedTripId &&
        !!initialDate &&
        !!finalDate &&
        new Date(finalDate) >= new Date(initialDate);

    return (
        <PixelModalDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={modalTitleRootSx}>
                <PixelModalTypography variant="h6" sx={modalTitleTextSx}>
                    Add to Trip
                </PixelModalTypography>
            </DialogTitle>

            <DialogContent sx={modalContentSx}>
                {loadingTrips ? (
                    <Box sx={modalLoaderSx}>
                        <CircularProgress />
                    </Box>
                ) : tripsError ? (
                    <Alert severity="error" sx={modalAlertSx}>
                        {tripsError}
                    </Alert>
                ) : trips.length === 0 ? (
                    <Alert severity="info" sx={modalInfoAlertSx}>
                        You have no trips yet. Create one first!
                    </Alert>
                ) : (
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel sx={modalInputLabelSx}>
                                Trip Name
                            </InputLabel>
                            <PixelModalSelect
                                value={selectedTripId}
                                label="Trip Name"
                                onChange={(e) => setSelectedTripId(e.target.value as string | number)}
                            >
                                {trips.map((trip) => (
                                    <MenuItem key={trip.id} value={trip.id} sx={modalMenuItemSx}>
                                        {trip.name}
                                    </MenuItem>
                                ))}
                            </PixelModalSelect>
                        </FormControl>

                        <TextField
                            label="Initial Date"
                            type="date"
                            value={initialDate}
                            onChange={(e) => setInitialDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={modalFieldSx}
                        />

                        <TextField
                            label="Final Date"
                            type="date"
                            value={finalDate}
                            onChange={(e) => setFinalDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: initialDate }}
                            sx={modalFieldSx}
                        />
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={modalActionsSx}>
                <Button
                    onClick={onClose}
                    disabled={submitting}
                    sx={modalCancelBtnSx}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    sx={modalPrimaryBtnSx}
                >
                    {submitting ? (
                        <CircularProgress size={14} sx={{ color: "#fff" }} />
                    ) : (
                        "Add to Trip"
                    )}
                </Button>
            </DialogActions>
        </PixelModalDialog>
    );
}

export default AddToTripModal;
