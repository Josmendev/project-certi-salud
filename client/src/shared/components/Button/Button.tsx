import React from "react";
type ButtonType = "submit" | "reset" | "button";

interface ButtonProps {
  title: string;
  id?: string;
  name?: string;
  type?: ButtonType;
  children?: React.ReactNode;
  classButton?: string;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ariaLabel?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      name,
      id,
      type = "button",
      title,
      classButton = "",
      disabled = false,
      iconLeft,
      iconRight,
      ariaLabel,
      ariaControls,
      ariaExpanded,
      tabIndex,
      onClick,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        id={id}
        name={name}
        type={type}
        className={`${classButton}`}
        disabled={disabled}
        aria-label={ariaLabel || title}
        aria-disabled={disabled ? "true" : "false"}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        title={title}
        tabIndex={tabIndex || 0}
        onClick={onClick}
      >
        {iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
        {children}
        {iconRight && <span className="btn-icon-right">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
