import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/api";
import { Hexagon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: User | null;
  walletAddress?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showOnlineIndicator?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-16 h-16",
};

const indicatorSizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
  xl: "w-6 h-6",
};

const iconSizeMap = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
  xl: "w-3 h-3",
};

export function UserAvatar({ user, walletAddress, size = "md", showOnlineIndicator = false, className }: UserAvatarProps) {
  const getUserInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (walletAddress) return walletAddress[2]?.toUpperCase() || "?";
    return "?";
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeMap[size], "border-2 border-white/20 shadow-2xl")}>
        {user?.profile_pic_url && <AvatarImage src={user.profile_pic_url} alt="Profile" />}
        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold">
          {getUserInitial()}
        </AvatarFallback>
      </Avatar>

      {showOnlineIndicator && (
        <div
          className={cn(
            "absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/30 flex items-center justify-center",
            indicatorSizeMap[size]
          )}
        >
          <Hexagon className={cn("text-white", iconSizeMap[size])} />
        </div>
      )}
    </div>
  );
}
