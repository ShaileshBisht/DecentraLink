import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar, WalletBadge } from "@/components/shared";
import { User } from "@/lib/api";
import { MoreHorizontal, Clock, Zap } from "lucide-react";

interface PostHeaderProps {
  user?: User;
  walletAddress: string;
  timestamp: string;
  isHovered?: boolean;
}

export function PostHeader({ user, walletAddress, timestamp, isHovered }: PostHeaderProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <UserAvatar user={user} walletAddress={walletAddress} size="lg" showOnlineIndicator />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-white text-lg truncate">{user?.username || "Anonymous User"}</h3>
            <Badge
              variant="secondary"
              className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm text-xs flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Web3
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <WalletBadge walletAddress={walletAddress} className="self-start" />
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10 rounded-xl w-10 h-10 p-0 flex-shrink-0 border border-white/20 ${
          isHovered ? "opacity-100" : ""
        }`}
      >
        <MoreHorizontal className="w-4 h-4 text-white/60" />
      </Button>
    </div>
  );
}
