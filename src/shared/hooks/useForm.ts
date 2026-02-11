import { ChangeEvent, useState } from 'react';

interface UseFormReturn<T> {
  formData: T;
  setFormData: (data: T) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  handleInputChange: (
    field: keyof T,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  reset: (initial: T) => void;
}

export const useForm = <T extends Record<string, unknown>>(initialData: T): UseFormReturn<T> => {
  const [formData, setFormData] = useState(initialData);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange =
    (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, type } = e.target as HTMLInputElement;
      const finalValue = type === 'number' ? Number(value) : value;
      updateField(field, finalValue as T[typeof field]);
    };

  const reset = (initial: T) => {
    setFormData(initial);
  };

  return {
    formData,
    setFormData,
    updateField,
    handleInputChange,
    reset,
  };
};

export default useForm;
