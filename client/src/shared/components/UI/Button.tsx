type ButtonType = "submit" | "reset" | "button";

interface ButtonProps {
  children: React.ReactNode;
  title: string;
  name: string;
  id: string;
  type: ButtonType;
  classButton?: string;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ariaLabel?: string;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
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
  tabIndex,
  onClick,
}) => {
  return (
    <button
      id={id}
      name={name}
      type={type}
      className={`btn-primary ${classButton}`}
      disabled={disabled}
      aria-label={ariaLabel || title}
      aria-disabled={disabled ? "true" : "false"}
      title={title}
      tabIndex={tabIndex || 0}
      onClick={onClick}
    >
      {iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
      {children}
      {iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
};
