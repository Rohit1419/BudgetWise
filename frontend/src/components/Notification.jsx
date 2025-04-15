import { useEffect } from "react";
import { X } from "lucide-react";

export default function Notification({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  // Auto-close notification after duration
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  // Determine background color based on type
  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-500 text-red-700"
      : type === "warning"
      ? "bg-yellow-100 border-yellow-500 text-yellow-700"
      : "bg-blue-100 border-blue-500 text-blue-700";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded border ${bgColor} shadow-md max-w-md flex items-center justify-between`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}
