import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import { Delete, Visibility, Close, Star, Edit } from '@mui/icons-material';
import ImageUploader from './ImageUploader';

const GalleryListManager = ({
    items = [],
    onItemsChange = null,
    onRemove,
    pendingImages = [],
    onPendingImagesChange,
    showUploader = false,
    maxPendingImages = 10,
    coverImageId = null,
    coverImageIndex = null,
    onSetCover = null,
    enableImageMetadata = false,
    metadataPlaceOptions = []
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
    const [uploaderOpen, setUploaderOpen] = useState(false);
    const [dragSource, setDragSource] = useState(null);
    const [metadataDraft, setMetadataDraft] = useState({
        index: null,
        isPending: false,
        placeid: '',
        captureddate: '',
        descripcion: '',
        title: ''
    });

    const normalizeCapturedDate = (value) => {
        if (!value) {
            return '';
        }

        if (typeof value === 'string') {
            if (value.includes('T')) {
                return value.split('T')[0];
            }
            return value;
        }

        return '';
    };

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

    const reorderArray = (list, fromIndex, toIndex) => {
        const updated = [...list];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        return updated;
    };

    const assignExistingOrders = (list) => {
        return list.map((image, index) => ({
            ...image,
            orden: index + 1
        }));
    };

    const assignPendingOrders = (list) => {
        return list.map((image, index) => ({
            ...image,
            orden: items.length + index + 1
        }));
    };

    const getReorderedIndex = (fromIndex, toIndex, selectedIndex) => {
        if (selectedIndex === null || selectedIndex === undefined) {
            return selectedIndex;
        }

        if (selectedIndex === fromIndex) {
            return toIndex;
        }

        if (fromIndex < toIndex && selectedIndex > fromIndex && selectedIndex <= toIndex) {
            return selectedIndex - 1;
        }

        if (fromIndex > toIndex && selectedIndex >= toIndex && selectedIndex < fromIndex) {
            return selectedIndex + 1;
        }

        return selectedIndex;
    };

    const handlePendingImageMetadataChange = (index, field, value) => {
        if (!onPendingImagesChange) {
            return;
        }

        const updatedImages = pendingImages.map((image, imageIndex) => {
            if (imageIndex !== index) {
                return image;
            }

            return {
                ...image,
                [field]: value
            };
        });

        onPendingImagesChange(updatedImages);
    };

    const handleExistingImageMetadataChange = (index, field, value) => {
        if (!onItemsChange) {
            return;
        }

        const updatedItems = items.map((image, imageIndex) => {
            if (imageIndex !== index) {
                return image;
            }

            return {
                ...image,
                [field]: value
            };
        });

        onItemsChange(updatedItems);
    };

    const handleCardDragStart = (index, isPending) => {
        setDragSource({ index, isPending });
    };

    const handleCardDragOver = (event) => {
        event.preventDefault();
    };

    const handleCardDrop = (targetIndex, isPending) => {
        if (!dragSource || dragSource.isPending !== isPending) {
            setDragSource(null);
            return;
        }

        if (dragSource.index === targetIndex) {
            setDragSource(null);
            return;
        }

        if (isPending) {
            if (!onPendingImagesChange) {
                setDragSource(null);
                return;
            }

            const reordered = reorderArray(sortedPendingImages, dragSource.index, targetIndex);
            const ordered = assignPendingOrders(reordered);
            onPendingImagesChange(ordered);

            const nextCoverIndex = getReorderedIndex(dragSource.index, targetIndex, coverImageIndex);
            if (onSetCover && nextCoverIndex !== coverImageIndex) {
                onSetCover(nextCoverIndex, true);
            }
        } else {
            if (!onItemsChange) {
                setDragSource(null);
                return;
            }

            const reordered = reorderArray(sortedItems, dragSource.index, targetIndex);
            onItemsChange(assignExistingOrders(reordered));
        }

        setDragSource(null);
    };

    const getPlaceName = (placeId) => {
        const normalizedPlaceId = Number(placeId);
        const match = metadataPlaceOptions.find((option) => Number(option.id) === normalizedPlaceId);
        return match?.name || `Place ${placeId}`;
    };

    const handleOpenMetadataModal = (image, index, isPending) => {
        setMetadataDraft({
            index,
            isPending,
            placeid: image.placeid ?? '',
            captureddate: normalizeCapturedDate(image.captureddate),
            descripcion: image.descripcion || '',
            title: isPending ? `Pending IMG ${items.length + index + 1}` : `IMG ${index + 1}`
        });
        setMetadataDialogOpen(true);
    };

    const handleCloseMetadataModal = () => {
        setMetadataDialogOpen(false);
    };

    const handleSaveMetadataModal = () => {
        if (metadataDraft.index === null) {
            setMetadataDialogOpen(false);
            return;
        }

        const normalizedPlaceId = metadataDraft.placeid === '' ? null : Number(metadataDraft.placeid);
        const payload = {
            placeid: Number.isNaN(normalizedPlaceId) ? null : normalizedPlaceId,
            captureddate: metadataDraft.captureddate || null,
            descripcion: metadataDraft.descripcion
        };

        if (metadataDraft.isPending) {
            if (onPendingImagesChange) {
                const updatedImages = pendingImages.map((image, imageIndex) => {
                    if (imageIndex !== metadataDraft.index) {
                        return image;
                    }

                    return {
                        ...image,
                        placeid: payload.placeid,
                        captureddate: payload.captureddate,
                        descripcion: payload.descripcion
                    };
                });

                onPendingImagesChange(updatedImages);
            }
        } else {
            if (onItemsChange) {
                const updatedItems = items.map((image, imageIndex) => {
                    if (imageIndex !== metadataDraft.index) {
                        return image;
                    }

                    return {
                        ...image,
                        placeid: payload.placeid,
                        captureddate: payload.captureddate,
                        descripcion: payload.descripcion
                    };
                });

                onItemsChange(updatedItems);
            }
        }

        setMetadataDialogOpen(false);
    };

    const shouldShowPlaceSelector =
        metadataPlaceOptions.length > 0
        || (metadataDraft.placeid !== '' && metadataDraft.placeid !== null && metadataDraft.placeid !== undefined);

    const getSortedImages = (images = []) => {
        return [...images].sort((left, right) => {
            const leftOrder = Number(left?.orden ?? Number.MAX_SAFE_INTEGER);
            const rightOrder = Number(right?.orden ?? Number.MAX_SAFE_INTEGER);
            return leftOrder - rightOrder;
        });
    };

    const sortedItems = getSortedImages(items);
    const sortedPendingImages = getSortedImages(pendingImages);

    const renderGalleryCard = ({ item, index, isPending = false, totalExistingCount = 0 }) => {
        const isCover = isPending ? coverImageIndex === index : coverImageId === item.id;
        const imageSource = item.completeurl || item.url || item.preview || item.data;
        const imageTitle = (item.descripcion && String(item.descripcion).trim())
            || (isPending ? `Pending image ${totalExistingCount + index + 1}` : 'Without description');

        return (
            <Paper
                key={isPending ? `pending-${index}` : item.id || index}
                data-orden={item.orden ?? ''}
                draggable
                onDragStart={() => handleCardDragStart(index, isPending)}
                onDragOver={handleCardDragOver}
                onDrop={() => handleCardDrop(index, isPending)}
                elevation={isCover ? 4 : 1}
                sx={{
                    p: 1.25,
                    border: isCover ? '2px solid #FFD700' : '1px solid #e0e0e0',
                    backgroundColor: isPending ? 'rgba(33, 150, 243, 0.05)' : '#fff',
                    cursor: onSetCover ? 'pointer' : 'default',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onDoubleClick={() => handleSetCover(isPending ? index : item.id, false)}
            >
                <Box sx={{ position: 'relative' }}>
                    <Box
                        component="img"
                        src={imageSource}
                        alt={item.filename || imageTitle}
                        onClick={() => handlePreview(item)}
                        sx={{
                            width: '100%',
                            height: 170,
                            borderRadius: 1,
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5,
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            borderRadius: 5,
                            px: 0.5
                        }}
                    >
                        <IconButton aria-label="view" onClick={() => handlePreview(item)} size="small" sx={{ color: '#fff' }}>
                            <Visibility fontSize="small" />
                        </IconButton>
                        {enableImageMetadata && (
                            <IconButton
                                aria-label="edit"
                                onClick={() => handleOpenMetadataModal(item, index, isPending)}
                                size="small"
                                sx={{ color: '#ffd27d' }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        )}
                        {!isPending && (
                            <IconButton aria-label="delete" onClick={() => handleRemove(item)} size="small" sx={{ color: '#ffb4b4' }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">{imageTitle}</Typography>
                    {isPending && (
                        <Typography variant="caption" color="text.secondary">
                            Not uploaded yet
                        </Typography>
                    )}
                    {!isPending && (item.descripcion || item.placeid !== null && item.placeid !== undefined && item.placeid !== '') && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {item.placeid !== null && item.placeid !== undefined && item.placeid !== '' ? `Place: ${getPlaceName(item.placeid)}. ` : ''}
                            {item.captureddate ? `Date: ${item.captureddate}` : ''}
                        </Typography>
                    )}
                    {isCover && (
                        <Chip
                            icon={<Star />}
                            label="Cover"
                            color="warning"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    )}
                </Box>

            </Paper>
        );
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Gallery
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        md: 'repeat(3, minmax(0, 1fr))'
                    },
                    gap: 1.5
                }}
            >
                {sortedItems.map((item, index) => renderGalleryCard({ item, index }))}
                {showUploader && sortedPendingImages.map((image, index) => (
                    renderGalleryCard({ item: image, index, isPending: true, totalExistingCount: sortedItems.length })
                ))}
            </Box>

            {showUploader && (
                <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Double-click any image to set as cover
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setUploaderOpen((prev) => !prev)}
                        sx={{ mb: 1 }}
                    >
                        {uploaderOpen ? 'Hide uploader' : 'Add image'}
                    </Button>
                    {uploaderOpen && (
                        <ImageUploader
                            images={pendingImages}
                            onChange={(newImages) => {
                                if (onPendingImagesChange) {
                                    onPendingImagesChange(assignPendingOrders(newImages));
                                }
                            }}
                            maxImages={maxPendingImages}
                        />
                    )}
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
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="body2">{selectedImage?.filename}</Typography>
                        {selectedImage?.placeid !== null && selectedImage?.placeid !== undefined && selectedImage?.placeid !== '' && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Place: {getPlaceName(selectedImage.placeid)}
                            </Typography>
                        )}
                        {normalizeCapturedDate(selectedImage?.captureddate) && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Captured: {normalizeCapturedDate(selectedImage?.captureddate)}
                            </Typography>
                        )}
                    </Box>
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

            <Dialog
                open={metadataDialogOpen}
                onClose={handleCloseMetadataModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit image info</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {metadataDraft.title}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {shouldShowPlaceSelector && (
                            <FormControl fullWidth size="small">
                                <InputLabel id="metadata-place-label">Place</InputLabel>
                                <Select
                                    labelId="metadata-place-label"
                                    value={metadataDraft.placeid}
                                    label="Place"
                                    onChange={(event) => {
                                        const selectedPlace = metadataPlaceOptions.find(
                                            (option) => String(option.id) === String(event.target.value)
                                        );

                                        setMetadataDraft((prev) => ({
                                            ...prev,
                                            placeid: event.target.value,
                                            captureddate: selectedPlace?.initialdate || ''
                                        }));
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Without place</em>
                                    </MenuItem>
                                    {metadataPlaceOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            size="small"
                            label="Captured date"
                            type="date"
                            value={metadataDraft.captureddate}
                            onChange={(event) => {
                                setMetadataDraft((prev) => ({
                                    ...prev,
                                    captureddate: event.target.value
                                }));
                            }}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            size="small"
                            label="Description"
                            value={metadataDraft.descripcion}
                            onChange={(event) => {
                                setMetadataDraft((prev) => ({
                                    ...prev,
                                    descripcion: event.target.value
                                }));
                            }}
                            placeholder="Add a short description"
                            multiline
                            minRows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMetadataModal} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveMetadataModal} variant="contained">
                        Save
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
