interface ICheckboxUIProps {
  id: string;
  htmlFor?: string;
  labelText?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange(_event: React.ChangeEvent<HTMLInputElement, Element>): void;
}

const CheckboxUI = ({
  id = "",
  htmlFor = "",
  labelText = "",
  checked = false,
  disabled = false,
  onChange = (_event: React.ChangeEvent<HTMLInputElement, Element>) => {},
}: ICheckboxUIProps) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
      />
      <label htmlFor={htmlFor} className="ml-2 block text-sm text-gray-700">
        {labelText}
      </label>
    </div>
  );
};

export { CheckboxUI };
