import { Loader } from "./Loader";

interface IButtonProps {
  loading?: boolean;
  disabled?: boolean;
  type: "button" | "submit" | "reset";
  text: string;
}

const Button = ({
  loading = false,
  disabled = false,
  type = "button",
  text = "",
}: IButtonProps) => {
  const content = loading ? <Loader /> : text;

  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      aria-busy={loading}
    >
      {content}
    </button>
  );
};

export { Button };
