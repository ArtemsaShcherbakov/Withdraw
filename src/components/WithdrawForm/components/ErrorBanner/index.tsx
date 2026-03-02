interface IErrorBannerProps {
  error: string | null;
}

const ErrorBanner = ({ error }: IErrorBannerProps) =>
  error ? (
    <div
      className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      role="alert"
      data-testid="error-message"
    >
      {error}
    </div>
  ) : null;

export { ErrorBanner };
