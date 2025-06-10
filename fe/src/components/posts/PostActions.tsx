import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, ThumbsUp } from "lucide-react";
import { LoadingSpinner } from "@/components/shared";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: number;
  hasLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => Promise<void>;
  onComment: () => void;
  isAuthenticated: boolean;
}

export function PostActions({ postId, hasLiked, likesCount, commentsCount, onLike, onComment, isAuthenticated }: PostActionsProps) {
  const { isConnected } = useAccount();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isConnected || !isAuthenticated || isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-1">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={handleLike}
          disabled={isLiking || !isConnected || !isAuthenticated}
          className={cn(
            "group/like flex-1 sm:flex-none transition-all duration-300 hover:bg-white/10 border border-white/20 hover:border-pink-400/40 rounded-xl",
            hasLiked ? "bg-pink-500/20 border-pink-400/60 text-pink-300" : "text-white/70 hover:text-pink-300"
          )}
        >
          <div className="flex items-center gap-2">
            {isLiking ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Heart
                className={cn("w-5 h-5 transition-all duration-300", hasLiked ? "fill-current scale-110" : "group-hover/like:scale-110")}
              />
            )}
            <span className="font-medium">{isLiking ? "Liking..." : hasLiked ? "Liked" : "Like"}</span>
            {likesCount > 0 && <span className="text-sm bg-white/10 px-2 py-1 rounded-full">{likesCount}</span>}
          </div>
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onComment}
          disabled={!isConnected || !isAuthenticated}
          className="group/comment flex-1 sm:flex-none transition-all duration-300 hover:bg-white/10 border border-white/20 hover:border-blue-400/40 rounded-xl text-white/70 hover:text-blue-300"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover/comment:scale-110" />
            <span className="font-medium">Comment</span>
            {commentsCount > 0 && <span className="text-sm bg-white/10 px-2 py-1 rounded-full">{commentsCount}</span>}
          </div>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="lg"
          className="group/share hidden sm:flex transition-all duration-300 hover:bg-white/10 border border-white/20 hover:border-green-400/40 rounded-xl text-white/70 hover:text-green-300"
          disabled
        >
          <div className="flex items-center gap-2">
            <Share className="w-5 h-5 transition-transform duration-300 group-hover/share:scale-110" />
            <span className="font-medium">Share</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
