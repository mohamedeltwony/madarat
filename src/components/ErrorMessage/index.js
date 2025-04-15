export default function ErrorMessage({ message, error }) {
  return (
    <div className="text-center">
      <div className="text-red-600 mb-2">{message}</div>
      {process.env.NODE_ENV === 'development' && error && (
        <div className="text-sm text-gray-500">{error.toString()}</div>
      )}
    </div>
  );
} 