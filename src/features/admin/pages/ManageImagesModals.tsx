import DeleteModal from './ManageImages.deleteModal';

type Props = {
  deleteid: string | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  processing: boolean;
};

export default function ManageImagesModals({ deleteId, onCancel, onConfirm, processing }: Props) {
  return (
    <>
      {deleteId && (
        <DeleteModal
          deleteId={deleteId}
          onCancel={onCancel}
          onConfirm={onConfirm}
          processing={processing}
        />
      )}
    </>
  );
}
