import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface ButtonProps {
  children: ReactNode;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'outline';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string; // This will now correctly override base styles
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  // Base classes that apply to all variants and sizes
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'border border-transparent bg-accent-600 text-white shadow-sm hover:bg-accent-700 disabled:bg-accent-300',
    outline:
      'border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
  };

  // CORE FIX: Use twMerge and clsx to intelligently combine classes
  const combinedClasses = twMerge(
    clsx(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabled && 'cursor-not-allowed opacity-50', // Conditionally add disabled classes
      className, // This is now the last argument, allowing it to override the defaults
    ),
  );

  return (
    <button
      type={type}
      className={combinedClasses} // Use the intelligently merged classes
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};

export default Button;
