import { useCallback, useState } from 'react';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const extensionFromMime = (mimetype = 'image/jpeg') => {
  const parts = mimetype.split('/');
  return parts[1] || 'jpg';
};

export const useGalleryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const normalizeImage = useCallback(async (photo) => {
    if (photo?.file && photo.file instanceof File) {
      const mimetype = photo.file.type || 'image/jpeg';
      return {
        data: await readFileAsDataUrl(photo.file),
        mimetype,
        extension: photo.name ? photo.name.split('.').pop() : extensionFromMime(mimetype),
        name: photo.name || photo.file.name
      };
    }

    if (photo instanceof File || photo instanceof Blob) {
      const mimetype = photo.type || 'image/jpeg';
      return {
        data: await readFileAsDataUrl(photo),
        mimetype,
        extension: photo.name ? photo.name.split('.').pop() : extensionFromMime(mimetype),
        name: photo.name
      };
    }

    if (typeof photo === 'string' && photo.startsWith('data:')) {
      const mimetype = photo.substring(photo.indexOf(':') + 1, photo.indexOf(';'));
      return {
        data: photo,
        mimetype,
        extension: extensionFromMime(mimetype),
        name: undefined
      };
    }

    if (photo?.data && typeof photo.data === 'string' && photo.data.startsWith('data:')) {
      const mimetype = photo.mimetype
        || photo.data.substring(photo.data.indexOf(':') + 1, photo.data.indexOf(';'));

      return {
        data: photo.data,
        mimetype,
        extension: photo.extension || extensionFromMime(mimetype),
        name: photo.name
      };
    }

    return {
      data: photo?.data || photo,
      mimetype: photo?.mimetype || 'image/jpeg',
      extension: photo?.extension || 'jpg',
      name: photo?.name
    };
  }, []);

  const uploadImages = useCallback(async ({ images = [], uploadRequest, buildPayload, context }) => {
    if (!images.length) {
      return { uploaded: false, count: 0 };
    }

    if (typeof uploadRequest !== 'function') {
      throw new Error('uploadRequest callback is required');
    }

    setIsUploading(true);
    try {
      const normalizedImages = await Promise.all(images.map((photo) => normalizeImage(photo)));
      const payload = typeof buildPayload === 'function'
        ? buildPayload(normalizedImages, context)
        : {
            images: normalizedImages.map(({ data, mimetype, extension }) => ({ data, mimetype, extension }))
          };

      const response = await uploadRequest(payload, context);

      return {
        uploaded: true,
        count: normalizedImages.length,
        payload,
        response
      };
    } finally {
      setIsUploading(false);
    }
  }, [normalizeImage]);

  return {
    isUploading,
    normalizeImage,
    uploadImages
  };
};

export default useGalleryUpload;