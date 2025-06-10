import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onDismiss, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={cn("bg-red-500/15 border border-red-400/40 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3", className)}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-300 hover:text-red-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
