import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  hoverColor: string;
}

export const FeatureCard = memo(({ icon: Icon, title, description, gradient, hoverColor }: FeatureCardProps) => (
  <div className="group cursor-pointer">
    <div
      className={`flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-${hoverColor}/30 transition-all duration-300`}
    >
      <div className={`w-10 h-10 ${gradient} rounded-xl flex items-center justify-center border border-${hoverColor}/20`}>
        <Icon className={`w-5 h-5 text-${hoverColor}`} />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
));

FeatureCard.displayName = "FeatureCard";
