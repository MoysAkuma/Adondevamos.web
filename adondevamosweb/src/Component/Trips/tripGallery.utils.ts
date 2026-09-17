const normalizePlaceId = (value: any) => {
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeOrder = (value: any, fallback: number) => {
  const parsed = Number(value ?? fallback);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const normalizeCapturedDate = (value: any) => {
  if (!value) {
    return null;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  return text.includes('T') ? text.split('T')[0] : text;
};

export const normalizeGalleryMetadataForUpdate = (gallery: any[] = []) => {
  return gallery
    .filter((image) => image?.id !== null && image?.id !== undefined)
    .map((image, index) => ({
      id: Number(image.id),
      orden: normalizeOrder(image.orden, index + 1),
      placeid: normalizePlaceId(image.placeid),
      captureddate: normalizeCapturedDate(image.captureddate),
      descripcion: typeof image.descripcion === 'string' ? image.descripcion.trim() : ''
    }));
};

export const buildGalleryMetadataSnapshot = (gallery: any[] = []) => {
  return JSON.stringify(normalizeGalleryMetadataForUpdate(gallery));
};

export const buildGalleryUploadPayload = (
  sourceImages: any[] = [],
  normalizedImages: any[] = [],
  coverIdx: number | null = null
) => {
  return {
    images: normalizedImages.map((image, index) => ({
      data: image.data,
      mimetype: image.mimetype,
      extension: image.extension,
      iscover: coverIdx !== null && index === coverIdx,
      orden: normalizeOrder(sourceImages[index]?.orden, index + 1),
      placeid: normalizePlaceId(sourceImages[index]?.placeid),
      captureddate: normalizeCapturedDate(sourceImages[index]?.captureddate),
      descripcion: typeof sourceImages[index]?.descripcion === 'string'
        ? sourceImages[index].descripcion.trim()
        : ''
    }))
  };
};

export const validateTripInfo = (trip: any) => {
  if (!trip?.name?.trim()) {
    throw new Error('Trip name is required');
  }

  if (!trip?.description?.trim()) {
    throw new Error('Trip description is required');
  }

  if (!trip?.initialdate) {
    throw new Error('set initial date');
  }

  if (!trip?.finaldate) {
    throw new Error('set final date');
  }
};

export const buildItineraryPayload = (itinerary: any[] = [], includeHide = false) => {
  const items = itinerary.map((item) => {
    const payloadItem: any = {
      placeid: item?.place?.id,
      initialdate: item?.initialdate,
      finaldate: item?.finaldate
    };

    if (includeHide) {
      payloadItem.hide = false;
    }

    return payloadItem;
  });

  return {
    Itinerary: items
  };
};

export const buildMembersPayload = (members: any[] = []) => {
  return {
    Members: members
      .map((member) => ({
        userid: member?.user?.id ?? member?.id,
        hide: false
      }))
      .filter((member) => member.userid !== null && member.userid !== undefined)
  };
};

export const hasCollectionChanged = (original: any, current: any) => {
  return JSON.stringify(original || []) !== JSON.stringify(current || []);
};

export const hasTripInfoChanged = (current: any, original: any) => {
  if (!original) {
    return true;
  }

  return (
    String(current?.name || '').trim() !== String(original?.name || '').trim()
    || String(current?.description || '').trim() !== String(original?.description || '').trim()
    || String(current?.initialdate || '') !== String(original?.initialdate || '')
    || String(current?.finaldate || '') !== String(original?.finaldate || '')
  );
};
