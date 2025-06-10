import { Heart, MessageCircle, ThumbsUp } from "lucide-react";

interface PostEngagementStatsProps {
  likesCount: number;
  commentsCount: number;
}

export function PostEngagementStats({ likesCount, commentsCount }: PostEngagementStatsProps) {
  if (likesCount === 0 && commentsCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {likesCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Heart className="w-3 h-3 text-white fill-current" />
              </div>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                <ThumbsUp className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            <span className="font-medium text-white/80">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
          </div>
        )}

        {commentsCount > 0 && (
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-purple-300" />
            <span className="font-medium text-white/80">
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
