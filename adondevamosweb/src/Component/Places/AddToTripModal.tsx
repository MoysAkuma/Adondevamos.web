import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Alert,
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTripsByOwnerApi } from "../../hooks/Trips/useTripsByOwnerApi";
import { useTripDetailsApi } from "../../hooks/Trips/useTripDetailsApi";

const PixelTypography = styled(Typography)(() => ({
    fontFamily: "'Press Start 2P', cursive",
}));

const StyledDialog = styled(Dialog)(() => ({
    "& .MuiPaper-root": {
        borderRadius: 0,
        border: "4px solid #2C2C2C",
        boxShadow: "8px 8px 0px rgba(0,0,0,0.3)",
        backgroundColor: "#F5F5F5",
    },
}));

const StyledSelect = styled(Select)(() => ({
    borderRadius: 0,
    fontFamily: "'Press Start 2P', cursive",
    fontSize: "0.6rem",
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    border: "2px solid #2C2C2C",
}));

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 0,
        border: "2px solid #2C2C2C",
        fontFamily: "'Press Start 2P', cursive",
        fontSize: "0.6rem",
        "& fieldset": { border: "none" },
    },
    "& .MuiInputLabel-root": {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: "0.6rem",
    },
};

const actionBtnBase = {
    borderRadius: 0,
    border: "2px solid #2C2C2C",
    fontFamily: "'Press Start 2P', cursive",
    fontSize: "0.5rem",
};

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

        getTripsByOwner(userId)
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
        <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    backgroundColor: "#3D5A80",
                    borderBottom: "4px solid #2C2C2C",
                    p: 3,
                }}
            >
                <PixelTypography
                    variant="h6"
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" }, color: "#FFFFFF" }}
                >
                    Add to Trip
                </PixelTypography>
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: "#F5F5F5", pt: "24px !important" }}>
                {loadingTrips ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : tripsError ? (
                    <Alert
                        severity="error"
                        sx={{ borderRadius: 0, border: "2px solid #2C2C2C" }}
                    >
                        {tripsError}
                    </Alert>
                ) : trips.length === 0 ? (
                    <Alert
                        severity="info"
                        sx={{
                            borderRadius: 0,
                            border: "2px solid #2C2C2C",
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: "0.55rem",
                        }}
                    >
                        You have no trips yet. Create one first!
                    </Alert>
                ) : (
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel
                                sx={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: "0.6rem",
                                }}
                            >
                                Trip Name
                            </InputLabel>
                            <StyledSelect
                                value={selectedTripId}
                                label="Trip Name"
                                onChange={(e) => setSelectedTripId(e.target.value as string | number)}
                            >
                                {trips.map((trip) => (
                                    <MenuItem
                                        key={trip.id}
                                        value={trip.id}
                                        sx={{
                                            fontFamily: "'Press Start 2P', cursive",
                                            fontSize: "0.6rem",
                                        }}
                                    >
                                        {trip.name}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </FormControl>

                        <TextField
                            label="Initial Date"
                            type="date"
                            value={initialDate}
                            onChange={(e) => setInitialDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={fieldSx}
                        />

                        <TextField
                            label="Final Date"
                            type="date"
                            value={finalDate}
                            onChange={(e) => setFinalDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: initialDate }}
                            sx={fieldSx}
                        />
                    </Stack>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    backgroundColor: "#52B788",
                    borderTop: "4px solid #2C2C2C",
                    p: 2,
                    gap: 1,
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    onClick={onClose}
                    disabled={submitting}
                    sx={{
                        ...actionBtnBase,
                        backgroundColor: "#FFFFFF",
                        color: "#2C2C2C",
                        "&:hover": { backgroundColor: "#F8F8F8" },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    sx={{
                        ...actionBtnBase,
                        backgroundColor: "#3D5A80",
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "#2d4a70" },
                        "&.Mui-disabled": { backgroundColor: "#999", color: "#ccc" },
                    }}
                >
                    {submitting ? (
                        <CircularProgress size={14} sx={{ color: "#fff" }} />
                    ) : (
                        "Add to Trip"
                    )}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}

export default AddToTripModal;
