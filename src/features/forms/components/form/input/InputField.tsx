import React, { InputHTMLAttributes } from 'react';

/**
 * Props for the InputField component. Extends standard HTMLInputElement attributes
 * to allow passing any native input property.
 */
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** The text displayed as the label above the input field. */
  label: string;
  /** Optional class names applied to the outermost wrapper <div> for layout control. */
  className?: string;
  // NOTE: Other common props like type, value, onChange, disabled are inherited.
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  className = '',
  // Destructure standard props used directly in the component logic
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  // Collect all other native HTML input props
  ...rest
}) => {
  // Use React.useId for robust accessibility linkage between label and input.
  const id = React.useId();

  return (
    // Outer Wrapper Div: Applies layout classes and any custom parent classNames.
    <div className={`space-y-1.5 text-left ${className}`}>
      {/* Label Element: Increased spacing to 'space-y-1.5' for cleaner look */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {/* Required Indicator: Subtle red asterisk */}
        {required && <span className="text-red-500 ml-1 leading-none">*</span>}
      </label>

      {/* Input Element */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        // Tailwind CSS Styling: Consolidated into a single, clean template literal string.
        className={`
          w-full 
          px-3 py-2 
          border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-700 dark:text-white 
          rounded-md 
          shadow-inner-sm // Used a more subtle inner shadow for depth
          
          transition duration-150 ease-in-out
          
          focus:outline-none 
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 // Clear focus state
          
          disabled:bg-gray-100 dark:disabled:bg-gray-700/50
          disabled:cursor-not-allowed
        `}
        {...rest} // Spread any remaining HTML props
      />
    </div>
  );
};

export default InputField;
