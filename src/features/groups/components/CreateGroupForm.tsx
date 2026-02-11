import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { useTranslation } from '@nthucscc/utils';

// Assuming InputField is the component provided above,
// and that InputFieldDefault is aliased to InputField here.
import { InputField } from '@/features/forms/components/form';
import { Button } from '@nthucscc/ui';

// SVG Components (omitted for brevity)
const SpinnerIcon = ({ className = 'w-4 h-4' }) => (
  /* ... */ <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

interface CreateGroupFormProps {
  groupName: string;
  description: string;
  loading: boolean;
  error: string | null;
  onGroupNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  groupName,
  description,
  loading,
  error,
  onGroupNameChange,
  onDescriptionChange,
  onSubmit,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  // Ref to hold the timeout ID
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Animation Logic FIX ---
  useEffect(() => {
    // 1. CLEAR any existing timeouts to prevent multiple flashes
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isOpen) {
      // OPENING:
      setShouldRender(true);
      // Use a single, zero-delay setTimeout to apply the class on the NEXT render tick.
      // This is generally cleaner than requestAnimationFrame for simple class toggles.
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationClass('fade-in-0');
      }, 0);
    } else if (shouldRender) {
      // CLOSING:
      setAnimationClass('fade-out-0');

      // Wait 300ms for the animation to complete before unmounting
      animationTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass('');
        onClose();
      }, 300);
    }

    // Cleanup function: Ensures timers are cleared when the component is unmounted or effect reruns
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }
  // -----------------------------------------------------------------------

  return (
    // Modal Backdrop: Apply dynamic animation class
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 ${animationClass}`}
    >
      {/* Modal Content Card */}
      <div
        className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent accidental closure
      >
        <div className="p-8">
          {/* Close Button (Top Right X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {/* Header Section */}
          <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
            {t('groups.form.title')}
          </h3>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Group Name Input */}
            <InputField
              type="text"
              label={t('groups.nameLabel')}
              value={groupName}
              onChange={onGroupNameChange}
              placeholder={t('groups.namePlaceholder')}
              className="w-full"
              required
              disabled={loading}
              aria-invalid={!!error}
            />

            {/* Description Input */}
            <InputField
              type="text"
              label={t('groups.descriptionLabel')}
              value={description}
              onChange={onDescriptionChange}
              placeholder={t('groups.descriptionPlaceholder')}
              className="w-full"
              disabled={loading}
            />

            {/* Submission Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="
                  w-full px-6 py-2.5 text-base font-semibold 
                  bg-accent-600 text-white rounded-md 
                  hover:bg-violet-700 transition duration-150 
                  focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                "
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center animate-pulse">
                    <SpinnerIcon className="w-4 h-4 mr-2 text-white" />
                    {t('groups.creating')}
                  </span>
                ) : (
                  t('groups.createButton')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupForm;
