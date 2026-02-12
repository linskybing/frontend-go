import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAllowedImages,
  deleteAllowedImage,
  AllowedImage,
  getFailedPullJobs,
  FailedPullJob,
  getActivePullJobs,
} from '@/core/services/imageService';
import ManageImagesHeader from './ManageImagesHeader';
import { API_BASE_URL, BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

interface PullJobStatus {
  job_id: string;
  image: string;
  status: 'pending' | 'pulling' | 'completed' | 'failed';
  progress: number;
  message: string;
  timestamp: string;
}

interface PullImageRequest {
  names: string[];
}

import ImagesSection from './ManageImages.list';
import ManageImagesModals from './ManageImagesModals';

export default function ManageImages() {
  const [images, setImages] = useState<AllowedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [pullJobStatuses, setPullJobStatuses] = useState<Map<string, PullJobStatus>>(new Map());
  const [failedJobs, setFailedJobs] = useState<FailedPullJob[]>([]);
  const wsConnectionsRef = useRef<Map<string, WebSocket>>(new Map());

  const loadImagesRef = useRef<() => void | Promise<void> | undefined>(undefined);

  const connectWebSocket = (jobId: string) => {
    // Avoid duplicate connections
    if (wsConnectionsRef.current.has(jobId)) {
      return;
    }

    // Construct WebSocket URL
    const protocol = BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
    const host = BASE_URL.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/ws/image-pull/${jobId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (import.meta.env.DEV) {
        console.log(`WebSocket connected for job ${jobId}`);
      }
    };

    ws.onmessage = (event) => {
      try {
        const status: PullJobStatus = JSON.parse(event.data);
        setPullJobStatuses((prev) => new Map(prev).set(jobId, status));

        // If job is completed or failed, reload images
        if (status.status === 'completed') {
          setTimeout(() => {
            try {
              if (loadImagesRef.current) {
                loadImagesRef.current();
              }
            } catch (_e) {
              // ignore
            }
            ws.close();
            wsConnectionsRef.current.delete(jobId);
          }, 1000);
        } else if (status.status === 'failed') {
          ws.close();
          wsConnectionsRef.current.delete(jobId);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error parsing WebSocket message:', err);
        }
      }
    };

    ws.onerror = (err) => {
      if (import.meta.env.DEV) {
        console.error(`WebSocket error for job ${jobId}:`, err);
      }
    };

    ws.onclose = () => {
      if (import.meta.env.DEV) {
        console.log(`WebSocket closed for job ${jobId}`);
      }
      wsConnectionsRef.current.delete(jobId);
    };

    wsConnectionsRef.current.set(jobId, ws);
  };

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      // Load allowed images - gracefully handle 404 if endpoint unavailable
      try {
        const data = await getAllowedImages();
        setImages(data);
      } catch (imgErr: any) {
        if (imgErr?.status === 404) {
          if (import.meta.env.DEV) {
            console.warn('Image service endpoints temporarily unavailable');
          }
          setImages([]);
        } else {
          throw imgErr;
        }
      }

      // Load failed jobs - gracefully handle 404 if endpoint unavailable
      try {
        const failed = await getFailedPullJobs(10);
        setFailedJobs(failed);
      } catch (failErr: any) {
        if (failErr?.status === 404) {
          if (import.meta.env.DEV) {
            console.warn('Failed pull jobs endpoint temporarily unavailable');
          }
          setFailedJobs([]);
        } else {
          throw failErr;
        }
      }

      // Load active pull jobs - gracefully handle 404 if endpoint unavailable
      try {
        const active = await getActivePullJobs();
        if (active && active.length > 0) {
          const activeMap = new Map<string, PullJobStatus>();
          active.forEach((job) => {
            activeMap.set(job.job_id, {
              job_id: job.job_id,
              image: `${job.image_name}:${job.image_tag}`,
              status: (job.status as 'pending' | 'pulling' | 'completed' | 'failed') || 'pending',
              progress: job.progress,
              message: job.message,
              timestamp: job.updated_at,
            });
            // Reconnect to WebSocket for this job if still pulling
            if (job.status === 'pending' || job.status === 'pulling') {
              connectWebSocket(job.job_id);
            }
          });
          setPullJobStatuses(activeMap);
        }
      } catch (activeErr: any) {
        if (activeErr?.status === 404) {
          if (import.meta.env.DEV) {
            console.warn('Active pull jobs endpoint temporarily unavailable');
          }
          setPullJobStatuses(new Map());
        } else {
          throw activeErr;
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to load images:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep a ref to the latest loadImages so sockets can call it without causing
  // circular dependencies between connectWebSocket and loadImages.
  useEffect(() => {
    loadImagesRef.current = loadImages;
  }, [loadImages]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    const currentSockets = wsConnectionsRef.current;
    return () => {
      // Close all WebSocket connections on unmount
      currentSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, []);

  const toggleImageSelect = (imageId: number) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.ID)));
    }
  };

  const handlePullSelected = async () => {
    if (selectedImages.size === 0) return;

    const selectedImgs = images.filter((img) => selectedImages.has(img.ID));
    const confirmMsg = `Pull ${selectedImgs.length} image${selectedImgs.length > 1 ? 's' : ''}?\n\n${selectedImgs
      .map((img) => `${img.Name}:${img.Tag}`)
      .join('\n')}`;

    if (!confirm(confirmMsg)) return;

    try {
      setProcessing(true);

      // Send multiple images in one request
      const imageNames = selectedImgs.map((img) => `${img.Name}:${img.Tag}`);

      // Call API to pull multiple images
      const data = await fetchWithAuth(`${API_BASE_URL}/images/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ names: imageNames } as PullImageRequest),
      });
      const jobIds = data.data?.job_ids || [];

      // Connect WebSocket for each job to monitor progress
      jobIds.forEach((jobId: string) => {
        connectWebSocket(jobId);
      });

      setSelectedImages(new Set());
      setSuccessMessage(`Started pulling ${selectedImgs.length} image(s)...`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to pull images: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setProcessing(true);
      await deleteAllowedImage(deleteId);
      await loadImages();
      setDeleteId(null);
      setSuccessMessage('Image deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete image: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  const pulledCount = images.filter((img) => img.IsPulled).length;
  const unPulledCount = images.length - pulledCount;

  return (
    <div>
      <ManageImagesHeader
        successMessage={successMessage}
        pullJobStatuses={pullJobStatuses}
        failedJobs={failedJobs}
      />

      <ImagesSection
        images={images}
        loading={loading}
        selectedImages={selectedImages}
        toggleImageSelect={toggleImageSelect}
        toggleSelectAll={toggleSelectAll}
        setDeleteId={setDeleteId}
        pulledCount={pulledCount}
        unPulledCount={unPulledCount}
        handlePullSelected={handlePullSelected}
        processing={processing}
      />

      <ManageImagesModals
        deleteId={deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        processing={processing}
      />
    </div>
  );
}
