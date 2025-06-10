import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return <div className={cn("border-2 border-white/30 border-t-white rounded-full animate-spin", sizeMap[size], className)} />;
}
