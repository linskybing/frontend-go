import { AllowedImage } from '@/core/services/imageService';
import ManageImagesActionBar from './ManageImagesActionBar';
import ManageImagesRow from './ManageImagesRow';

type Props = {
  images: AllowedImage[];
  loading: boolean;
  selectedImages: Set<number>;
  toggleImageSelect: (id: number) => void;
  toggleSelectAll: () => void;
  setDeleteId: (id: number | null) => void;
  pulledCount: number;
  unPulledCount: number;
  handlePullSelected: () => Promise<void> | void;
  processing: boolean;
};

export default function ImagesSection({
  images,
  loading,
  selectedImages,
  toggleImageSelect,
  toggleSelectAll,
  setDeleteId,
  pulledCount,
  unPulledCount,
  handlePullSelected,
  processing,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <ManageImagesActionBar
        total={images.length}
        pulledCount={pulledCount}
        unPulledCount={unPulledCount}
        selectedCount={selectedImages.size}
        onPullSelected={handlePullSelected}
        processing={processing}
      />

      {/* Images List */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading images...</p>
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 dark:border-gray-600 dark:bg-gray-800/50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No images yet
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Add images from project settings to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedImages.size === images.length && images.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600"
              />
              <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <div className="col-span-5">Image Name</div>
                <div className="col-span-2">Tag</div>
                <div className="col-span-2">Scope</div>
                <div className="col-span-3">Status</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {images.map((img) => (
              <ManageImagesRow
                key={img.ID}
                image={img}
                selectedImages={selectedImages}
                toggleImageSelect={toggleImageSelect}
                setDeleteId={setDeleteId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
