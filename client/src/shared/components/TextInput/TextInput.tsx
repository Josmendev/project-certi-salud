import React from "react";
import type { TextInputType } from "../../types/textInputType";

interface TextInputProps {
  label: string;
  type: TextInputType;
  id?: string;
  name?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  value?: string;
  classTextInput?: string;
  classIconRight?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  tabIndex?: number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  error?: string;
  inputMode?: "numeric" | "text" | "tel" | "decimal"; // Se pasen los valores correctos
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      name,
      id,
      type,
      placeholder,
      minLength,
      maxLength,
      value,
      classTextInput = "",
      classIconRight = "",
      readOnly = false,
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
      error,
      inputMode = "text",
      ...rest
    },
    ref
  ) => {
    return (
      <div className="form-control">
        {label && (
          <label htmlFor={id} className="textInput-label">
            {label}
            {required && <span className="textInput-label-required">*</span>}
          </label>
        )}
        <div className="flex items-center relative">
          {iconLeft && <span className="icon-input-left">{iconLeft}</span>}
          <input
            ref={ref}
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            value={value}
            className={`textInput ${
              readOnly
                ? "cursor-not-allowed bg-neutral-50 focus:border-neutral-400 text-neutral-500"
                : classTextInput
            }`}
            readOnly={readOnly}
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
            inputMode={inputMode}
            {...rest}
          />
          {iconRight && <span className={`icon-input-right ${classIconRight}`}>{iconRight}</span>}
        </div>

        {error && (
          <span className="text-red-500 text-paragraph-s-medium block text-left py-1">{error}</span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
