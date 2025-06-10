import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  gradient: string;
  color: string;
}

export const StatCard = memo(({ icon: Icon, label, value, gradient, color }: StatCardProps) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 text-${color}`} />
      <span className="text-sm text-white/80">{label}</span>
    </div>
    <div className={`px-3 py-1 ${gradient} text-${color} border border-${color}/20 rounded-lg text-sm font-medium`}>{value}</div>
  </div>
));

StatCard.displayName = "StatCard";
