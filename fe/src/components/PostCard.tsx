"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Post, apiService } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share, MoreHorizontal, Clock, Sparkles, Reply, ThumbsUp, Zap, Hexagon } from "lucide-react";

interface PostCardProps {
  post: Post;
  onPostUpdate?: () => void;
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { address, isConnected } = useAccount();
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [justLiked, setJustLiked] = useState(false);

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("auth_token");
  const hasLiked = post.likes?.some((like) => like.wallet_address.toLowerCase() === address?.toLowerCase());
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const handleLike = async () => {
    if (!isConnected || !isAuthenticated) return;

    setIsLiking(true);
    setError("");

    try {
      await apiService.likePost(post.id);
      onPostUpdate?.();
    } catch (error: any) {
      if (error.message.includes("already liked")) {
        setError("You have already liked this post");
      } else {
        setError("Failed to like post");
      }
      console.error("Error liking post:", error);
    } finally {
      setTimeout(() => {
        setIsLiking(false);
      }, 300);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!isConnected || !isAuthenticated) return;

    setIsCommenting(true);
    setError("");

    try {
      await apiService.commentOnPost(post.id, commentContent.trim());
      setCommentContent("");
      onPostUpdate?.();
    } catch (error) {
      setError("Failed to add comment");
      console.error("Error commenting on post:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getUserInitial = (user: any, walletAddress: string) => {
    return user?.username ? user.username[0].toUpperCase() : walletAddress[2].toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <div
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group transition-all duration-500 hover:scale-[1.01] shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-white/20 shadow-2xl">
                  {post.user?.profile_pic_url ? <AvatarImage src={post.user.profile_pic_url} alt="Profile" /> : null}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-bold">
                    {getUserInitial(post.user, post.wallet_address)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Hexagon className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white text-lg truncate">{post.user?.username || "Anonymous User"}</h3>
                  <div className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm rounded-lg text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Web3
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <div className="font-mono text-xs bg-white/10 text-white/70 border border-white/20 self-start backdrop-blur-sm px-2 py-1 rounded-lg">
                    {formatWalletAddress(post.wallet_address)}
                  </div>
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
        </div>

        {/* Post Content */}
        <div className="px-6 pb-4">
          <div className="prose prose-invert max-w-none">
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
          </div>
        </div>

        {/* Engagement Stats */}
        {(likesCount > 0 || commentsCount > 0) && (
          <div className="px-6 pb-4">
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
          </div>
        )}

        <div className="mx-6 border-t border-white/10"></div>

        {/* Post Actions */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLike}
                disabled={isLiking || !isConnected || !isAuthenticated}
                className={`group/like flex-1 sm:flex-none transition-all duration-300 hover:bg-white/10 border border-white/20 hover:border-pink-400/40 rounded-xl ${
                  hasLiked ? "text-pink-300 bg-pink-500/20 border-pink-400/30" : "text-white/70 hover:text-pink-300"
                } ${isLiking ? "animate-pulse" : ""}`}
              >
                {isLiking ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-pink-300/30 border-t-pink-300 rounded-full animate-spin" />
                    <span className="text-sm">Liking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        hasLiked ? "fill-current scale-110" : "group-hover/like:scale-110"
                      }`}
                    />
                    <span className="text-sm font-medium">{likesCount > 0 ? likesCount : "Like"}</span>
                    {hasLiked && <Sparkles className="w-3 h-3 animate-pulse" />}
                  </div>
                )}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowComments(!showComments)}
                className="group/comment flex-1 sm:flex-none transition-all duration-300 hover:bg-white/10 text-white/70 hover:text-purple-300 border border-white/20 hover:border-purple-400/40 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 transition-transform group-hover/comment:scale-110" />
                  <span className="text-sm font-medium">{commentsCount > 0 ? commentsCount : "Comment"}</span>
                </div>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="group/share flex-1 sm:flex-none transition-all duration-300 hover:bg-white/10 text-white/70 hover:text-blue-300 border border-white/20 hover:border-blue-400/40 rounded-xl"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 transition-transform group-hover/share:scale-110" />
                  <span className="text-sm font-medium">Share</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-400/40 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-300 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              {/* Comment Form */}
              {isConnected && isAuthenticated && (
                <form onSubmit={handleComment} className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 border border-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                        {address ? address[2].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a comment..."
                        className="min-h-[80px] resize-none bg-white/5 border border-white/20 focus:border-blue-400/60 text-white placeholder:text-white/50 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isCommenting || !commentContent.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 rounded-lg border-0"
                    >
                      {isCommenting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Posting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Reply className="w-3 h-3" />
                          <span>Reply</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 border border-white/20">
                        {comment.user?.profile_pic_url ? <AvatarImage src={comment.user.profile_pic_url} alt="Profile" /> : null}
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-xs font-bold">
                          {getUserInitial(comment.user, comment.wallet_address)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white text-sm">{comment.user?.username || "Anonymous"}</span>
                          <span className="text-white/40 text-xs">•</span>
                          <span className="text-white/60 text-xs">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Comments State */}
              {post.comments?.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
