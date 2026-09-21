import GalleryListManager from '../Commons/GalleryListManager';

function TripGallerySection({
  items = [],
  onItemsChange,
  onRemove,
  pendingImages = [],
  onPendingImagesChange,
  itinerary = [],
  maxPendingImages = 10,
  coverImageId = null,
  coverImageIndex = null,
  onSetCover,
  showUploader = true,
  enableImageMetadata = true
}) {
  const metadataPlaceOptions = (itinerary || [])
    .filter((item) => item?.place?.id)
    .map((item) => ({
      id: item.place.id,
      name: item.place.name,
      initialdate: item.initialdate
    }));

  return (
    <GalleryListManager
      items={items}
      onItemsChange={onItemsChange}
      onRemove={onRemove}
      pendingImages={pendingImages}
      onPendingImagesChange={onPendingImagesChange}
      showUploader={showUploader}
      enableImageMetadata={enableImageMetadata}
      metadataPlaceOptions={metadataPlaceOptions}
      maxPendingImages={maxPendingImages}
      coverImageId={coverImageId}
      coverImageIndex={coverImageIndex}
      onSetCover={onSetCover}
    />
  );
}

export default TripGallerySection;
