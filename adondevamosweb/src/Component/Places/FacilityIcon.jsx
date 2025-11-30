import {
    Wc,
    Subway,
    Wifi,
    Restaurant,
    LocalParking,
    AcUnit,
    Pool,
    FitnessCenter,
    Pets,
    SmokingRooms,
    LocalBar,
    HelpOutline
} from '@mui/icons-material';

// Icon mapping based on facility code
const facilityIcons = {
    Wc: Wc,
    Subway: Subway,
    Wifi: Wifi,
    Restaurant: Restaurant,
    Parking: LocalParking,
    AC: AcUnit,
    Pool: Pool,
    Gym: FitnessCenter,
    Pets: Pets,
    Smoking: SmokingRooms,
    Bar: LocalBar,
};

function FacilityIcon({ code, ...props }) {
    const IconComponent = facilityIcons[code] || HelpOutline;
    return <IconComponent {...props} />;
}

export default FacilityIcon;