"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import { Sparkles, Send, Image, Smile, Hash, AtSign, Zap, Globe, Users, MessageCircle, Rocket } from "lucide-react";

interface PostComposerProps {
  onPostCreated?: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, isLoading } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const maxLength = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    if (!isConnected || !isAuthenticated) {
      setError("Please connect your wallet and sign in first");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await apiService.createPost(content.trim());
      setContent("");
      onPostCreated?.();
    } catch (error: any) {
      setError(error.message || "Failed to create post");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInitial = () => {
    return address ? address[2].toUpperCase() : "?";
  };

  // Show loading state during authentication check
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <MessageCircle className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Loading Post Composer...</h3>
          <p className="text-white/70">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (!isConnected || !isAuthenticated) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Share Your Voice</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              {!isConnected
                ? "Connect your wallet to start posting on the decentralized social network"
                : "Sign in with your wallet to start creating posts"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-3 py-1 bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-lg text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Decentralized
              </div>
              <div className="px-3 py-1 bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-lg text-sm flex items-center gap-1">
                <Users className="w-3 h-3" />
                Web3 Native
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white/20 shadow-2xl">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white text-lg font-bold">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Share Your Thoughts</h3>
              <p className="text-white/70 text-sm">What's happening in the decentralized world?</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="px-3 py-1 bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-lg text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Public
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused ? "ring-2 ring-blue-400/40" : ""}`}>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Share your thoughts with the world... What's on your mind?"
                  className="min-h-[120px] resize-none bg-white/5 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-lg text-white placeholder:text-white/50 backdrop-blur-sm rounded-xl"
                  maxLength={maxLength}
                />
                <div className="absolute bottom-4 right-4 opacity-60">
                  <Sparkles className="w-5 h-5 text-white/40" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`text-sm px-3 py-1 bg-white/10 border border-white/20 text-white/70 transition-all duration-300 rounded-lg ${
                      content.length > maxLength * 0.8
                        ? "border-yellow-400/60 text-yellow-300 bg-yellow-500/15"
                        : content.length > maxLength * 0.9
                        ? "border-orange-400/60 text-orange-300 bg-orange-500/15"
                        : content.length >= maxLength
                        ? "border-red-400/60 text-red-300 bg-red-500/15"
                        : ""
                    }`}
                  >
                    {content.length}/{maxLength}
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/10 text-white/70 hover:text-blue-300 border border-white/20 hover:border-blue-400/40 transition-all duration-300 rounded-lg"
                      disabled
                    >
                      <Image className="w-4 h-4 mr-2" />
                      <span className="text-sm">Media</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/10 text-white/70 hover:text-purple-300 border border-white/20 hover:border-purple-400/40 transition-all duration-300 rounded-lg"
                      disabled
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      <span className="text-sm">Tags</span>
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !content.trim() || content.length > maxLength}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl w-full sm:w-auto rounded-xl border-0"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      <span>Share Post</span>
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-300 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/30">
              <Badge className="px-3 py-2 bg-white/10 text-bright-secondary border-white/30 hover:bg-white/15 hover:border-white/40 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <AtSign className="w-3 h-3 mr-2" />
                Mention
              </Badge>
              <Badge className="px-3 py-2 bg-white/10 text-bright-secondary border-white/30 hover:bg-white/15 hover:border-white/40 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Hash className="w-3 h-3 mr-2" />
                Hashtag
              </Badge>
              <Badge className="px-3 py-2 bg-white/10 text-bright-secondary border-white/30 hover:bg-white/15 hover:border-white/40 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Smile className="w-3 h-3 mr-2" />
                Emoji
              </Badge>
            </div>
          </form>
        </div>
      </CardContent>
    </div>
  );
}
