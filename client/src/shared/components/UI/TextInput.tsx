import type { TextInputType } from "../../types/textInputType";

interface TextInputProps {
  label: string;
  name: string;
  id: string;
  type: TextInputType;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  value?: string;
  classTextInput?: string;
  classTextInputParent?: string;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  tabIndex?: number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  id,
  type,
  placeholder,
  minLength,
  maxLength,
  value,
  classTextInput = "",
  classTextInputParent = "",
  readonly = false,
  disabled = false,
  required = false,
  pattern,
  min,
  max,
  autoComplete,
  autoFocus = false,
  ariaLabel,
  ariaLabelledBy,
  tabIndex,
  iconLeft,
  iconRight,
  onChange,
  onClick,
}) => {
  return (
    <div className="form-control">
      {label && (
        <label
          htmlFor={id}
          className="textInput-label"
        >
          {label}
          {required && <span className="textInput-label-required">*</span>}
        </label>
      )}
      <div className={`flex items-center justify-center relative ${classTextInputParent}`}>
        {iconLeft && <span className="icon-input-left">{iconLeft}</span>}
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          className={`textInput ${classTextInput}`}
          readOnly={readonly}
          disabled={disabled}
          required={required}
          pattern={pattern}
          min={min}
          max={max}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-label={ariaLabel || label}
          aria-labelledby={ariaLabelledBy}
          aria-required={required ? "true" : "false"}
          tabIndex={tabIndex || 0}
          onChange={onChange}
          onClick={onClick}
        />
        {iconRight && <span className="icon-input-right">{iconRight}</span>}
      </div>
    </div>
  );
};
