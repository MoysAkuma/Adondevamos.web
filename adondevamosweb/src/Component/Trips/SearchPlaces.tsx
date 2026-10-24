import { useEffect, useMemo, useRef, useState } from 'react';
import 
    {
        TextField, 
        useMediaQuery,
        useTheme,
        InputAdornment,
        Typography,
        IconButton,
        Stack,
        Button,
        MenuItem,
        Box,
        CircularProgress
    } from '@mui/material';

import { FlightTakeoff, 
    FlightLand, 
    Delete,
    Add } 
    from '@mui/icons-material';

import PlaceListFound from '../View/PlaceListFound';
import usePlaceQueryApi from '../../hooks/Places/usePlaceQueryApi';
import useCatalogues from '../../hooks/useCatalogues';

function SearchPlaces({ callback, itinerary, allowRepeatedPlaces = false }){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const requestIdRef = useRef(0);
    const { searchPlaces } = usePlaceQueryApi();
    const { countries, states, cities } = useCatalogues();

    //var param to search places with a given name
    const [placename, setPlaceName] = useState('');

    const [locationFilters, setLocationFilters] = useState({
        countryid: '',
        stateid: '',
        cityid: ''
    });

    //selected place from found list
    const [selectedPlace, setSelectedPlace] = useState(null);

    //Callback object
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");
    //place list
    const [findedPlaces, setFindedPlaces] = useState([
        {
            id : 1,
            name : "Place name",
            description : "A place description"
        }
    ]);

    const filteredStates = useMemo(
        () => (
            locationFilters.countryid
                ? states.filter((state) => String(state.countryid) === String(locationFilters.countryid))
                : []
        ),
        [states, locationFilters.countryid]
    );

    const filteredCities = useMemo(
        () => (
            locationFilters.stateid
                ? cities.filter((city) => String(city.stateid) === String(locationFilters.stateid))
                : []
        ),
        [cities, locationFilters.stateid]
    );

    const hasSearchCriteria =
        placename.trim().length >= 3 ||
        !!locationFilters.countryid ||
        !!locationFilters.stateid ||
        !!locationFilters.cityid;

    //update request
    const handleChange = (e) => {
        const { value } = e.target;
        setPlaceName(value);
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;

        if (name === 'countryid') {
            setLocationFilters({
                countryid: value,
                stateid: '',
                cityid: ''
            });
            return;
        }

        if (name === 'stateid') {
            setLocationFilters((prev) => ({
                ...prev,
                stateid: value,
                cityid: ''
            }));
            return;
        }

        setLocationFilters((prev) => ({
            ...prev,
            cityid: value
        }));
    };

    //handle change of place 
    const handleChangeplace = (e) => {
        const { name, value } = e.target;
        
        switch(name){
            case "initialdate": 
                setInitialDate(value);
                // Auto-set finalDate to same value when initialDate is selected
                // Only auto-set if finalDate is empty OR if it's less than the new initial date
                if (!finalDate || finalDate < value) {
                    setFinalDate(value);
                }
            break;

            case "finaldate": 
                setFinalDate(value);
            break;
        }
    };

    //request to get place list
    const searchPlaceList = async(filters) =>{
        const currentRequestId = ++requestIdRef.current;

        setIsSearching(true);
        searchPlaces(filters)
            .then((resp) => {
                if (currentRequestId !== requestIdRef.current) return;

                const places = Array.isArray(resp?.data?.info) ? resp.data.info : [];
                setFindedPlaces(places);
                setShowResults(true);
            })
            .catch(() => {
                if (currentRequestId !== requestIdRef.current) return;

                setFindedPlaces([]);
                setShowResults(true);
            })
            .finally(() => {
                if (currentRequestId !== requestIdRef.current) return;
                setIsSearching(false);
            });
    };

    useEffect(() => {
        if (selectedPlace) return;

        if (!hasSearchCriteria) {
            setFindedPlaces([]);
            setShowResults(false);
            setIsSearching(false);
            return;
        }

        const filters: {
            name?: string;
            countryid?: number;
            stateid?: number;
            cityid?: number;
        } = {};
        const trimmedName = placename.trim();

        if (trimmedName.length >= 3) {
            filters.name = trimmedName;
        }
        if (locationFilters.countryid) {
            filters.countryid = Number(locationFilters.countryid);
        }
        if (locationFilters.stateid) {
            filters.stateid = Number(locationFilters.stateid);
        }
        if (locationFilters.cityid) {
            filters.cityid = Number(locationFilters.cityid);
        }

        const debounceId = setTimeout(() => {
            searchPlaceList(filters);
        }, 350);

        return () => clearTimeout(debounceId);
    }, [placename, locationFilters, selectedPlace, hasSearchCriteria]);

    const addPlace = async( item ) =>{
        const place = findedPlaces.find((x) => String(x.id) === String(item));
        setSelectedPlace(place);
    };

    const callresponse = async( final ) =>{
        const resp = {
            id : selectedPlace.id,
            name : selectedPlace.name,
            description : selectedPlace.description,
            initialdate : initialDate,
            finaldate : final
        };
        //restart component
        setFinalDate("");
        setInitialDate("");
        setPlaceName("");
        setLocationFilters({ countryid: '', stateid: '', cityid: '' });
        setShowResults(false);
        setSelectedPlace(null);
        //Return response
        callback(resp);
    }

    return (<>
        <Typography variant="body1"  gutterBottom align="left">
           { 
                !placename ? 
                "Search Places to add to your itinerary" : (!selectedPlace ? "Choose a place " : "")
           } 
        </Typography>
        {
            selectedPlace ? 
            (
                <>
                    <Typography variant="body2"  
                        gutterBottom 
                        align="left">
                        Selected Place
                    </Typography>
                    
                    {
                        selectedPlace ? ( 
                        <>
                        <Stack direction="row" spacing={1} alignItems="center" >
                            <Typography variant="body1"  gutterBottom sx={{mb:0}} >
                                {selectedPlace.name}
                            </Typography>
                            <IconButton aria-label="delete" onClick={ () => setSelectedPlace(null) }>
                                <Delete  />
                            </IconButton>
                        </Stack>
                        </>
                        )  : <></>
                    }
                    
                    {

                    }
                    <TextField
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        id="initialdate"
                        name="initialdate"
                        label="Visit Initial Date"
                        placeholder="Initial Visit Date"
                        variant="outlined"
                        onChange={handleChangeplace}
                        size={isMobile ? 'small' : 'medium'}
                        value={initialDate}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlightLand />
                                    </InputAdornment>
                                    )
                            }
                        }}
                    />

                    <TextField
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        id="finaldate"
                        name="finaldate"
                        label="Visit Final Date"
                        placeholder="Final Visit Date"
                        variant="outlined"
                        onChange={handleChangeplace}
                        size={isMobile ? 'small' : 'medium'}
                        value={finalDate}
                        fullWidth
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlightTakeoff />
                                    </InputAdornment>
                                )
                            }
                        }}
                        inputProps={{
                            min: initialDate
                        }}
                    />
                    
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => callresponse(finalDate)}
                        disabled={!initialDate || !finalDate}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Add to Itinerary
                    </Button>
                </>
            ) : <>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                        gap: 1.5,
                        mb: 1
                    }}
                >
                    <TextField
                        id="countryid"
                        name="countryid"
                        select
                        label="Country"
                        value={locationFilters.countryid}
                        onChange={handleLocationChange}
                        size={isMobile ? 'small' : 'medium'}
                        fullWidth
                    >
                        <MenuItem value="">All countries</MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="stateid"
                        name="stateid"
                        select
                        label="State"
                        value={locationFilters.stateid}
                        onChange={handleLocationChange}
                        size={isMobile ? 'small' : 'medium'}
                        disabled={!locationFilters.countryid}
                        fullWidth
                    >
                        <MenuItem value="">All states</MenuItem>
                        {filteredStates.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                                {state.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="cityid"
                        name="cityid"
                        select
                        label="City"
                        value={locationFilters.cityid}
                        onChange={handleLocationChange}
                        size={isMobile ? 'small' : 'medium'}
                        disabled={!locationFilters.stateid}
                        fullWidth
                    >
                        <MenuItem value="">All cities</MenuItem>
                        {filteredCities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <TextField
                    id="placename"
                    name="placename"
                    label="Name"
                    placeholder="Name of place"
                    variant="standard"
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    value={placename}
                    fullWidth
                />
                {
                    isSearching ? (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                            <CircularProgress size={16} />
                            <Typography variant="body2">Searching places...</Typography>
                        </Stack>
                    ) : null
                }
                {
                    (showResults && !isSearching) ? 
                        ( 
                            <PlaceListFound 
                                placeList={findedPlaces} 
                                callback={addPlace} 
                                itinerary={itinerary} 
                                allowRepeatedPlaces={allowRepeatedPlaces}
                            />) 
                        : 
                        ( <></>)
                }
            </>
        }        
    </> );
}

export default SearchPlaces;