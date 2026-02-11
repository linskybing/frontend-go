import { useEffect, useState } from 'react';
import { getAllowedImages, AllowedImage } from '@/core/services/imageService';

export function useAllowedImages(open: boolean) {
  const [allowedImages, setAllowedImages] = useState<AllowedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (open) loadAllowedImages();
    // load when `open` changes
  }, [open]);

  const loadAllowedImages = async () => {
    setLoadingImages(true);
    try {
      const images = await getAllowedImages();
      setAllowedImages(images);
    } catch (err) {
      // Keep non-fatal — UI can render without images
      console.error('Failed to load allowed images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  return { allowedImages, loadingImages, loadAllowedImages };
}
