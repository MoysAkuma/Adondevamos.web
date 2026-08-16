import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Modal,
    useMediaQuery,
    useTheme,
    Typography
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Close,
    ZoomIn
} from '@mui/icons-material';

function ImageCarousel({ images = [], title = "Gallery" }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <Box 
                sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: 'grey.100', 
                    borderRadius: 2 
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    No images available
                </Typography>
            </Box>
        );
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleZoomOpen = (index) => {
        setZoomIndex(index);
        setZoomOpen(true);
    };

    const handleZoomClose = () => {
        setZoomOpen(false);
    };

    const handleZoomPrevious = () => {
        setZoomIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleZoomNext = () => {
        setZoomIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const currentImage = images[currentIndex];
    const imageUrl = currentImage?.completeurl || currentImage?.url || currentImage;

    return (
        <>
            <Box sx={{ position: 'relative', width: '100%' }}>
                {/* Main Image Display */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: isMobile ? 300 : 400,
                        bgcolor: 'black',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={currentImage?.filename || `Image ${currentIndex + 1}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleZoomOpen(currentIndex)}
                    />

                    {/* Zoom Button */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)'
                            }
                        }}
                        onClick={() => handleZoomOpen(currentIndex)}
                    >
                        <ZoomIn />
                    </IconButton>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    left: 8,
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                                    }
                                }}
                                onClick={handlePrevious}
                            >
                                <ChevronLeft />
                            </IconButton>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                                    }
                                }}
                                onClick={handleNext}
                            >
                                <ChevronRight />
                            </IconButton>
                        </>
                    )}

                    {/* Image Counter */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="body2">
                            {currentIndex + 1} / {images.length}
                        </Typography>
                    </Box>
                </Box>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            mt: 2,
                            overflowX: 'auto',
                            pb: 1,
                            '&::-webkit-scrollbar': {
                                height: 8
                            },
                            '&::-webkit-scrollbar-thumb': {
                                bgcolor: 'grey.400',
                                borderRadius: 1
                            }
                        }}
                    >
                        {images.map((image, index) => {
                            const thumbUrl = image?.completeurl || image?.url || image;
                            return (
                                <Box
                                    key={image?.id || index}
                                    sx={{
                                        minWidth: 80,
                                        height: 60,
                                        cursor: 'pointer',
                                        border: currentIndex === index ? 3 : 1,
                                        borderColor: currentIndex === index ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        opacity: currentIndex === index ? 1 : 0.6,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            opacity: 1,
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={thumbUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Zoom Modal */}
            <Modal
                open={zoomOpen}
                onClose={handleZoomClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        outline: 'none'
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            zIndex: 1,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)'
                            }
                        }}
                        onClick={handleZoomClose}
                    >
                        <Close />
                    </IconButton>

                    {/* Zoomed Image */}
                    <img
                        src={images[zoomIndex]?.completeurl || images[zoomIndex]?.url || images[zoomIndex]}
                        alt={images[zoomIndex]?.filename || `Image ${zoomIndex + 1}`}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain'
                        }}
                    />

                    {/* Navigation in Zoom */}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                                    }
                                }}
                                onClick={handleZoomPrevious}
                            >
                                <ChevronLeft fontSize="large" />
                            </IconButton>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                                    }
                                }}
                                onClick={handleZoomNext}
                            >
                                <ChevronRight fontSize="large" />
                            </IconButton>
                        </>
                    )}

                    {/* Counter in Zoom */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="body2">
                            {zoomIndex + 1} / {images.length}
                        </Typography>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default ImageCarousel;
