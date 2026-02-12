import ConfirmModal from './ConfirmModal';

type Props = {
  deleteId: number | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  processing: boolean;
};

export default function DeleteModal({ deleteId, onCancel, onConfirm, processing }: Props) {
  return (
    <ConfirmModal
      isOpen={!!deleteId}
      title="Delete Image"
      message="Are you sure you want to delete this image? This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onCancel={onCancel}
      onConfirm={onConfirm}
      processing={processing}
    />
  );
}
