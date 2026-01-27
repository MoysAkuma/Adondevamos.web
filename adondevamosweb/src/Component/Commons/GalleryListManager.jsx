import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Paper
} from '@mui/material';
import { Delete, Visibility, Close } from '@mui/icons-material';

const GalleryListManager = ({ items, onRemove }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const handlePreview = (item) => {
        setSelectedImage(item);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setSelectedImage(null);
    };

    const handleRemove = (item) => {
        setItemToRemove(item);
        setConfirmOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (onRemove && itemToRemove) {
            await onRemove(itemToRemove);
        }
        setConfirmOpen(false);
        setItemToRemove(null);
    };

    const handleCancelRemove = () => {
        setConfirmOpen(false);
        setItemToRemove(null);
    };

    return (
        <>
            <List sx={{ width: '100%' }}>
                {items.map((item, index) => (
                    <Paper
                        key={index}
                        elevation={1}
                        sx={{ mb: 1, p: 1 }}
                    >
                        <ListItem
                            secondaryAction={
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="view"
                                        onClick={() => handlePreview(item)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleRemove(item)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText
                                primary={"IMG " + (index + 1)}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>

            {/* Image Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePreview}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                            zIndex: 1
                        }}
                    >
                        <Close />
                    </IconButton>
                    {selectedImage && (
                        <Box
                            component="img"
                            src={selectedImage.completeurl}
                            alt={selectedImage.filename}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Typography variant="body2" sx={{ flexGrow: 1, ml: 2 }}>
                        {selectedImage?.filename}
                    </Typography>
                    <Button onClick={handleClosePreview}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={handleCancelRemove}
                maxWidth="xs"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Remove Image
                    </Typography>
                    <Typography variant="body1">
                        Want to remove {itemToRemove?.filename}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelRemove} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemove} color="error" variant="contained">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GalleryListManager;
