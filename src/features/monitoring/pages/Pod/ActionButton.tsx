// ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'primary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'default',
}) => {
  const baseClass =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-sm border';

  const variants = {
    default:
      'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white',
    primary:
      'text-white bg-accent-600 border-transparent hover:bg-accent-700 shadow-blue-500/20 dark:bg-accent-600 dark:hover:bg-accent-500',
  };

  return (
    <button onClick={onClick} className={`${baseClass} ${variants[variant]}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
};
