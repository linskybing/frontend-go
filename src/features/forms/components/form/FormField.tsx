import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default FormField;
