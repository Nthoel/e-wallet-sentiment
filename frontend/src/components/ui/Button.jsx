import { Link } from "react-router-dom";
import "./Button.css";

const Button = ({
  variant = "primary", // primary, transparent, outline
  disabled = false,
  children,
  iconLeft,
  iconRight,
  fullWidth = false,
  onClick,
  type = "button",
  to,
  className = "",
  ...rest
}) => {
  // Base classes
  const baseClasses = "button";

  // Variant classes
  const variantClasses = {
    primary: "button--primary",
    transparent: "button--transparent",
    outline: "button--outline",
  };

  // Size classes
  const sizeClasses = fullWidth ? "button--full-width" : "";

  // Disabled classes
  const disabledClasses = disabled ? "button--disabled" : "";

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // If it's a link (for navigation)
  if (to && !disabled) {
    return (
      <Link to={to} className={buttonClasses} {...rest}>
        {iconLeft && (
          <span className="button__icon">{iconLeft}</span>
        )}
        {children && <span>{children}</span>}
        {iconRight && (
          <span className="button__icon button__icon--right">{iconRight}</span>
        )}
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {iconLeft && (
        <span className="button__icon button__icon--left">{iconLeft}</span>
      )}
      {children && <span className="button__text">{children}</span>}
      {iconRight && (
        <span className="button__icon button__icon--right">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
