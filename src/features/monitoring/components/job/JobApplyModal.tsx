import React, { useState, FormEvent } from 'react';
import { useAllowedImages } from '@/features/monitoring/hooks/useAllowedImages';
import { SubmitJobRequest } from '@/core/services/jobSubmitService';
import JobApplyHeader from './JobApplyHeader';
import JobApplyForm from './JobApplyForm';

interface JobApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitJobRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [priority, setPriority] = useState('normal');
  const [cpu, setCpu] = useState('');
  const [memory, setMemory] = useState('');
  const [gpuCount, setGpuCount] = useState(0);
  const [command, setCommand] = useState('');
  const { allowedImages, loadingImages } = useAllowedImages(open);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: SubmitJobRequest = {
      name,
      image,
      namespace,
      priority,
      cpu_request: cpu || undefined,
      memory_request: memory || undefined,
      gpu_count: gpuCount > 0 ? gpuCount : undefined,
      command: command ? command.split(' ') : undefined,
    };
    await onSubmit(payload);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 relative flex flex-col max-h-[90vh]">
        <JobApplyHeader onClose={onClose} />
        <JobApplyForm
          name={name}
          setName={setName}
          image={image}
          setImage={setImage}
          namespace={namespace}
          setNamespace={setNamespace}
          priority={priority}
          setPriority={setPriority}
          cpu={cpu}
          setCpu={setCpu}
          memory={memory}
          setMemory={setMemory}
          gpuCount={gpuCount}
          setGpuCount={setGpuCount}
          command={command}
          setCommand={setCommand}
          allowedImages={allowedImages}
          loadingImages={loadingImages}
          loading={loading}
          error={error}
          success={success}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default JobApplyModal;
