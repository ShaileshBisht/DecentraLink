"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/providers/AuthProvider";
import { Post, apiService } from "@/lib/api";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, MessageCircle, Heart, Clock, Sparkles, TrendingUp, Zap, Wifi, WifiOff, Shield, AlertTriangle } from "lucide-react";

// Modern Web3 Skeleton Loader Component
function PostSkeleton() {
  return (
    <div className="card-web3-bright rounded-2xl overflow-hidden animate-pulse">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full border-2 border-white/20"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full border-2 border-white/20"></div>
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 bg-gradient-to-r from-white/20 to-white/10 rounded-lg w-32"></div>
                  <div className="h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-16"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gradient-to-r from-white/15 to-white/5 rounded w-24"></div>
                  <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 space-y-3">
          <div className="h-5 bg-gradient-to-r from-white/15 to-white/5 rounded w-full"></div>
          <div className="h-5 bg-gradient-to-r from-white/15 to-white/5 rounded w-4/5"></div>
          <div className="h-5 bg-gradient-to-r from-white/15 to-white/5 rounded w-3/5"></div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-12 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl border border-white/10"></div>
            <div className="flex-1 h-12 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-white/10"></div>
            <div className="flex-1 h-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10"></div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

export function PostFeed() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [networkError, setNetworkError] = useState(false);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      setError("");
      setNetworkError(false);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const fetchedPosts = await apiService.getAllPosts();
      setPosts(fetchedPosts);
      setLastRefreshTime(new Date());
    } catch (error: any) {
      console.error("Error fetching posts:", error);

      if (error.message?.includes("Network") || error.message?.includes("fetch")) {
        setNetworkError(true);
        setError("Network connection failed. Check your internet connection.");
      } else {
        setError("Failed to load posts. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!refreshing && !loading) {
        fetchPosts(true);
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, refreshing, loading, fetchPosts]);

  const handlePostUpdate = () => {
    fetchPosts(true);
  };

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefreshTime.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center avatar-glow">
              <TrendingUp className="w-6 h-6 text-white sparkle" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-bright">Loading Feed</h2>
              <p className="text-bright-secondary">Fetching latest posts from the network...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>

        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-web3-bright rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-400/40">
            {networkError ? <WifiOff className="w-8 h-8 text-red-300" /> : <AlertTriangle className="w-8 h-8 text-red-300" />}
          </div>
          <h3 className="text-xl font-bold text-bright mb-3">{networkError ? "Connection Failed" : "Failed to Load Posts"}</h3>
          <p className="text-bright-secondary mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => fetchPosts()} className="btn-web3 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            {networkError && (
              <Button variant="outline" onClick={() => window.location.reload()} className="border-white/20 text-white hover:bg-white/10">
                <Wifi className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card-web3-bright rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <MessageCircle className="w-10 h-10 text-bright-muted" />
          </div>
          <h3 className="text-2xl font-bold text-bright mb-4">No Posts Yet</h3>
          <p className="text-bright-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Be the first to share something amazing with the decentralized community!
          </p>

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-400/40 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-orange-300 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Sign In Required</span>
              </div>
              <p className="text-orange-200/80 text-sm">Connect your wallet and sign in to create posts</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 bg-white/15 text-bright border-white/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Share Your Thoughts
            </Badge>
            <Badge className="px-4 py-2 bg-white/15 text-bright border-white/30 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              Web3 Native
            </Badge>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center avatar-glow">
            <TrendingUp className="w-6 h-6 text-white sparkle" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-bright">Latest Posts</h2>
            <p className="text-bright-secondary">
              {posts.length} {posts.length === 1 ? "post" : "posts"} from the community
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Status */}
          <div className="flex items-center gap-3">
            <Badge
              className={`px-3 py-1 ${
                autoRefresh
                  ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border-green-400/40"
                  : "bg-white/10 text-white/70 border-white/20"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${autoRefresh ? "bg-green-400 animate-pulse" : "bg-white/50"}`}></div>
              {autoRefresh ? "Live Feed" : "Manual Refresh"}
            </Badge>

            <Badge variant="outline" className="text-white/60 border-white/20 bg-white/5 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Updated {formatLastRefresh()}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-bright-secondary">Live</span>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
              />
            </div>

            {/* Network status */}
            <Badge
              variant="outline"
              className={`${networkError ? "text-red-300 border-red-400/40" : "text-green-300 border-green-400/40"}`}
            >
              {networkError ? <WifiOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
              {networkError ? "Offline" : "Online"}
            </Badge>

            {/* Manual refresh */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="glass hover:bg-white/15 text-bright-secondary hover:text-blue-300 border border-white/20 hover:border-blue-400/40 transition-all duration-300"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Authentication Warning */}
      {!isAuthenticated && (
        <div className="bg-orange-500/10 border border-orange-400/40 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-300">Authentication Required</h4>
              <p className="text-orange-200/80 text-sm">Sign in with your wallet to like posts, comment, and create content</p>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
        ))}
      </div>

      {/* Load more indicator */}
      {posts.length > 0 && (
        <div className="text-center py-8">
          <Badge variant="outline" className="text-white/60 border-white/20 bg-white/5">
            <Sparkles className="w-3 h-3 mr-1" />
            You're all caught up!
          </Badge>
        </div>
      )}
    </div>
  );
}
