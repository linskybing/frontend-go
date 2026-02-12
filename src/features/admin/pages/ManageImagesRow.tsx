import { AllowedImage } from '@/core/services/imageService';
import ManageImagesStatusPill from './ManageImagesStatusPill';
import ManageImagesRowActions from './ManageImagesRowActions';
import ManageImagesBadge from './ManageImagesBadge';

type Props = {
  image: AllowedImage;
  selectedImages: Set<number>;
  toggleImageSelect: (id: number) => void;
  setDeleteId: (id: number | null) => void;
};

export default function ManageImagesRow({
  image,
  selectedImages,
  toggleImageSelect,
  setDeleteId,
}: Props) {
  return (
    <div className="border-b border-gray-200 px-6 py-4 last:border-b-0 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selectedImages.has(image.ID)}
          onChange={() => toggleImageSelect(image.ID)}
          className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600"
        />
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
            <div className="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
              {image.Name}
            </div>
          </div>
          <div className="col-span-2">
            <span className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {image.Tag}
            </span>
          </div>
          <div className="col-span-2">
            <ManageImagesBadge isGlobal={image.IsGlobal} projectId={image.ProjectID ?? undefined} />
          </div>
          <div className="col-span-3 flex items-center justify-between">
            <ManageImagesStatusPill isPulled={image.IsPulled} />
            <ManageImagesRowActions onDelete={() => setDeleteId(image.ID)} />
          </div>
        </div>
      </div>
    </div>
  );
}
