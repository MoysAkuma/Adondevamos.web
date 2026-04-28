import React, { useState, useEffect } from 'react';
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
    Paper,
    Snackbar,
    Alert,
    Chip
} from '@mui/material';
import { Delete, Visibility, Close, Star } from '@mui/icons-material';
import ImageUploader from './ImageUploader';

const GalleryListManager = ({
    items = [],
    onRemove,
    pendingImages = [],
    onPendingImagesChange,
    showUploader = false,
    maxPendingImages = 10,
    coverImageId = null,
    coverImageIndex = null,
    onSetCover = null
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Auto-set first image as cover for new galleries
    useEffect(() => {
        if (onSetCover && pendingImages.length > 0 && coverImageIndex === null) {
            onSetCover(0, true); // true indicates auto-set
        }
    }, [pendingImages.length]);

    // Auto-set first uploaded image as cover for existing galleries
    useEffect(() => {
        if (onSetCover && items.length > 0 && coverImageId === null && pendingImages.length === 0) {
            onSetCover(items[0].id, true);
        }
    }, [items.length]);

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

    const handleSetCover = (itemIdOrIndex, autoSet = false) => {
        if (onSetCover) {
            onSetCover(itemIdOrIndex, autoSet);
            if (!autoSet) {
                setSnackbarMessage('Cover image set successfully!');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Gallery
            </Typography>
            <List sx={{ width: '100%' }}>
                {/* Existing gallery items */}
                {items.map((item, index) => (
                    <Paper
                        key={item.id || index}
                        elevation={coverImageId === item.id ? 3 : 1}
                        sx={{ 
                            mb: 1, 
                            p: 1,
                            border: coverImageId === item.id ? '2px solid #FFD700' : 'none',
                            cursor: onSetCover ? 'pointer' : 'default'
                        }}
                        onDoubleClick={() => handleSetCover(item.id, false)}
                    >
                        <ListItem
                            secondaryAction={
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {coverImageId === item.id && (
                                        <Chip
                                            icon={<Star />}
                                            label="Cover"
                                            color="warning"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                    )}
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
                
                {/* Pending images - only shown when uploader is active */}
                {showUploader && pendingImages.map((image, index) => {
                    return (
                        <Paper
                            key={`pending-${index}`}
                            elevation={coverImageIndex === index ? 3 : 1}
                            sx={{ 
                                mb: 1, 
                                p: 1,
                                border: coverImageIndex === index ? '2px solid #FFD700' : 'none',
                                backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                cursor: onSetCover ? 'pointer' : 'default'
                            }}
                            onDoubleClick={() => handleSetCover(index, false)}
                        >
                            <ListItem
                                secondaryAction={
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {coverImageIndex === index && (
                                            <Chip
                                                icon={<Star />}
                                                label="Cover"
                                                color="warning"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                        <IconButton
                                            edge="end"
                                            aria-label="view"
                                            onClick={() => handlePreview(image)}
                                            color="primary"
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={`Pending IMG ${items.length + index + 1}`}
                                    secondary="Not uploaded yet"
                                />
                            </ListItem>
                        </Paper>
                    );
                })}
            </List>

            {showUploader && (
                <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Double-click any image to set as cover
                    </Typography>
                    <ImageUploader
                        images={pendingImages}
                        onChange={(newImages) => {
                            if (onPendingImagesChange) {
                                onPendingImagesChange(newImages);
                            }
                        }}
                        maxImages={maxPendingImages}
                    />
                </>
            )}

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
                            src={selectedImage.completeurl || selectedImage.url || selectedImage.preview || selectedImage.data}
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

            {/* Snackbar for cover image notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default GalleryListManager;
