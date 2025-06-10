import { useState, useEffect, useCallback } from "react";
import { Post, apiService } from "@/lib/api";

interface UsePostsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const fetchedPosts = await apiService.getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refreshPosts = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const createPost = useCallback(async (content: string) => {
    try {
      const newPost = await apiService.createPost(content);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      throw err;
    }
  }, []);

  const updatePost = useCallback(async (postId: number) => {
    try {
      const updatedPost = await apiService.getPost(postId);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }, []);

  const likePost = useCallback(
    async (postId: number) => {
      try {
        await apiService.likePost(postId);
        await updatePost(postId);
      } catch (err) {
        throw err;
      }
    },
    [updatePost]
  );

  const commentOnPost = useCallback(
    async (postId: number, content: string) => {
      try {
        await apiService.commentOnPost(postId, content);
        await updatePost(postId);
      } catch (err) {
        throw err;
      }
    },
    [updatePost]
  );

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        // Only refresh when tab is visible
        refreshPosts();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshPosts]);

  return {
    posts,
    isLoading,
    error,
    isRefreshing,
    refreshPosts,
    createPost,
    likePost,
    commentOnPost,
    updatePost,
  };
}
