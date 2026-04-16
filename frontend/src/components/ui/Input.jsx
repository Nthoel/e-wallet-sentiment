// src/components/ui/Input.jsx
import "./Input.css";

const Input = ({
  // Variants
  variant = "default", // default, outline, filled

  // Types
  type = "text", // text, email, password, number, tel, search

  // States
  disabled = false,
  error = false,

  // Size
  fullWidth = false,

  // Content
  label,
  placeholder,
  helperText,
  errorMessage,
  iconLeft,
  iconRight,

  // Value
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,

  // Required
  required = false,

  // Name & ID
  name,
  id,

  // Additional props
  className = "",
  ...rest
}) => {
  // Base classes
  const baseClasses = "input";

  // Variant classes (sama seperti button)
  const variantClasses = {
    default: "input--default",
  };

  // State classes
  const errorClasses = error ? "input--error" : "";
  const disabledClasses = disabled ? "input--disabled" : "";

  // Size classes
  const sizeClasses = fullWidth ? "input--full-width" : "";

  // Combine classes
  const inputClasses = [
    baseClasses,
    variantClasses[variant],
    errorClasses,
    disabledClasses,
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Generate unique ID if not provided
  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`input-wrapper ${fullWidth ? "input-wrapper--full-width" : ""}`}
    >
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}

      {/* Input container (untuk icon) */}
      <div className="input-container">
        {/* Icon Kiri */}
        {iconLeft && (
          <span className="input__icon input__icon--left">{iconLeft}</span>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          name={name}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          {...rest}
        />

        {/* Icon Kanan */}
        {iconRight && (
          <span className="input__icon input__icon--right">{iconRight}</span>
        )}
      </div>

      {/* Helper Text atau Error Message */}
      {(helperText || (error && errorMessage)) && (
        <div
          className={`input__helper-text ${error ? "input__helper-text--error" : ""}`}
        >
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
