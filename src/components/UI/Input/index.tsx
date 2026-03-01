import { ChangeEvent } from "react";

interface IInputUIProps {
  id: string;
  htmlFor?: string;
  placeholder?: string;
  type: "button" | "checkbox" | "submit" | "text" | "radio" | "password";
  value?: string;
  labelText?: string;
  errorText?: string;
  disabled?: boolean;
  error?: boolean;
  ariaDescribedby?: string;
  onChange(_event: React.ChangeEvent<HTMLInputElement, Element>): void;
  onBlur?(): void;
}

const InputUI = ({
  id = "",
  htmlFor = "",
  placeholder = "",
  type = "text",
  value = "",
  labelText = "",
  errorText = "",
  disabled = false,
  error = false,
  ariaDescribedby = "",
  onChange = (_event: ChangeEvent<HTMLInputElement, Element>) => {},
  onBlur = () => {},
}: IInputUIProps) => {
  const isError = !!errorText || error;
  const ariaInvalid = !!errorText;
  const idError = `${ariaDescribedby}-error`;
  const ariaDescribedbyInput = isError ? idError : ariaDescribedby;
  const classNameError = isError ? "border-red-500" : "border-gray-300";
  const className = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
    classNameError
  }`;

  return (
    <>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {labelText}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedbyInput}
      />
      {isError && (
        <p id={idError} className="mt-1 text-sm text-red-600">
          {errorText}
        </p>
      )}
    </>
  );
};

export { InputUI };
