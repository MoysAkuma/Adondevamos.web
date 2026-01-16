import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    CloudUpload,
    Delete
} from '@mui/icons-material';

function ImageUploader({ images = [], onChange, maxImages = 10 }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        
        if (files.length + images.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        onChange([...images, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        // Revoke the URL to free up memory
        if (images[index].preview) {
            URL.revokeObjectURL(images[index].preview);
        }
        onChange(updatedImages);
    };

    return (
        <Box>
            <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                disabled={images.length >= maxImages}
            >
                Upload Images ({images.length}/{maxImages})
                <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </Button>

            {images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Selected Images: {images.length}
                    </Typography>
                    <ImageList 
                        cols={isMobile ? 2 : 3} 
                        gap={8}
                        sx={{ 
                            maxHeight: 400, 
                            overflow: 'auto' 
                        }}
                    >
                        {images.map((image, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={image.preview || image.url}
                                    alt={image.name || `Image ${index + 1}`}
                                    loading="lazy"
                                    style={{
                                        height: '150px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <ImageListItemBar
                                    title={image.name || `Image ${index + 1}`}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            )}
        </Box>
    );
}

export default ImageUploader;
