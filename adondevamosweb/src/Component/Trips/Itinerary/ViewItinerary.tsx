import { useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Badge,
    Alert,
    Box,
    Button,
    Pagination
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Visibility, ExpandMore, ExpandLess } from '@mui/icons-material';
import utils from "../../../Resources/utils";
import { useAuth } from '../../../context/AuthContext';

function ViewItinerary({ itinerary = [] }) {
    const [showAll, setShowAll] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const { isLogged, user, loading } = useAuth();
    
    const displayedItems = showAll 
        ? itinerary.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        : itinerary.slice(0, 3);
    
    const totalPages = Math.ceil(itinerary.length / itemsPerPage);
    
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (itinerary.length === 0) {
        return (
            <Alert severity="warning">
                This trip has no itinerary yet.
            </Alert>
        );
    }

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {displayedItems.map((item) => (
                    <ListItem 
                        key={item.id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="actions">
                                    <ShareIcon />
                                </IconButton>
                                {item.place.id ? (
                                    <IconButton 
                                        edge="end" 
                                        aria-label="actions" 
                                        href={"/View/Place/" + item.place.id}
                                    >
                                        <Visibility />
                                    </IconButton>
                                ) : null}
                            </>
                        }
                    >
                        <ListItemText 
                            primary={item.place.name} 
                            secondary={
                                utils.formatDate(item.initialdate) 
                                + " to " 
                                + utils.formatDate(item.finaldate)
                            } 
                        />
                    </ListItem>
                ))}
            </List>
            
            {itinerary.length > 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => {
                            setShowAll(!showAll);
                            setPage(1);
                        }}
                    >
                        {showAll ? 'Show Less' : `Show All (${itinerary.length})`}
                    </Button>
                    
                    {showAll && totalPages > 1 && (
                        <Pagination 
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="small"
                        />
                    )}
                </Box>
            )}
        </>
    );
}

export default ViewItinerary;
